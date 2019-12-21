---
title: "InfluxDB使用問題與優化紀錄"
date: 2019-12-21T10:35:06+08:00
draft: false
categories: ["tech"]
tags: ["influx", "centos", "docker"]
---

一個運轉一年多的 NodeJS 專案，每分鐘向 InfluxDB 寫入 40~50 個 point，某天發現不時出現`ETIMEOUT`以及`No host available`連接問題，導致部分資料無法儲存。

<!--more-->

### 1. 不是網絡問題

這個 InfluxDB 實例運行在 Docker container 內，與 NodeJS 程序放在同一個 CentOS 機器上。influxDB 的 log 看不到異常，只有 NodeJS 報連接問題。

第一時間就想是不是本機 network interface 與 Docker / container 之間連接出錯。然而無論重啟或更新 Docker 服務，情況也未有改變。

的確，如果是本機 network 問題，多半是完全無法連接。(曾經有次 Linux 的網路服務自己出包了，要手動重啟。)

程序同時連接另一個運行 MongoDB 的 container，Docker 服務更新前後都沒有類似連接問題，也應該不是 Docker 代碼出包。

[這個問題也在 Github 上被提出過](https://github.com/node-influx/node-influx/issues/171#issuecomment-246092549)。當接收到數次`ETIMEOUT`後，node-influx 會把這個 influxDB 從連接池移除。因為這裡就只得一個 influxDB，移除後自然就`No host available`了。

但為甚麼 timeout 呢？

### 2. 官方的建議

事實上我還未找到一個確切的回答，不過 InfluxData 在他們的文檔提及一些操作姿勢。

#### 2.1 時間戳精度

InfluxDB 文檔中的[FAQ 寫道](https://docs.influxdata.com/influxdb/v1.7/troubleshooting/frequently-asked-questions/#does-the-precision-of-the-timestamp-matter)：

> To maximize performance, use the coarsest possible timestamp precision when writing data to InfluxDB.

「為了使性能最大化，在將數據寫入 InfluxDB 時，請使用最粗略的時間戳精度。」

[文檔記載](https://docs.influxdata.com/influxdb/v1.7/tools/api/#query-string-parameters-2)時間戳精度可為︰`ns`(納秒)、`u`(微秒)、`ms`(毫秒)、`s`(秒)、`m`(分鐘)、`h`(小時)

原本我沒有指定精度，使用預設的`ns`。現在改成`m`，是專案可接受最粗略精度了。用 node-flux 的話這樣加一行︰

{{< highlight js "linenos=table,hl_lines=2" >}}
influx.writePoints([...points], {
    precision: "m",
    retentionPolicy: "raw",
    database: "my_db",
});
{{< / highlight >}}

#### 2.2 批量寫入

在 node-influx 的文檔中寫著[這麼一句](https://node-influx.github.io/class/src/index.js~InfluxDB.html#instance-method-writePoints)：

> For best performance, it's recommended that you batch your data into sets of a couple thousand records before writing it.

「為了獲得最佳性能，建設您把資料以數千條為一組，批量寫入。」

所以我增加一個 array，暫存要寫入的 point，僅當這個 array length >= 1000 或者第一個 point 已經暫存超過一分鐘才進行`influx.writePoints()`動作。當然，寫入條件隨你按實際情況定義，我的情況就大約每分鐘一次寫入 40~50 個 point。

如果使用 Redis 或類近方案作暫存會更好，避免程序崩潰而令資料流失。

另外，如果`influx.writePoints()`再出現`ETIMEOUT`或`No host available`情況時，可以把資料放回暫存，等待下一次嘗試。

{{< highlight js "linenos=table" >}}
const buffer = [];

//...
if (buffer.length >= 1000 || (buffer.length > 0 && buffer[0].timestamp.getTime() >= 60000) {
    const mb = buffer.splice(0, buffer.length);
    try {
        await influx.writePoints(mb, {
            precision: "m", //指定精度
            retentionPolicy: "raw",
            database: "my_db",
        });
    } catch (err) {
        //如不能寫入則放回暫存
        buffer.splice(buffer.length, 0, ...mb);
    }
}
//...
{{< / highlight >}}

但要留意一點，你需要為每個 point 指定`timestamp`屬性，避免讓 influx 設定，因為重試機制會令時間戳變得不正確。

#### 2.3 內部監控 (Internal monitoring)

InfluxDB 文檔在描述內部監控功能前[高調表示](https://docs.influxdata.com/platform/monitoring/influxdata-platform/internal-vs-external#internal-monitoring)︰

> Not recommended for production environments.

「不建議在生產環境中使用。」

就是強烈建議你停用**預設開啟的**內部監控功能。

我的 InfluxDB 是用官方的 Docker image，又嫌麻煩不想改[設定檔](https://docs.influxdata.com/platform/monitoring/influxdata-platform/internal-vs-external#disable-the-internal-database-in-production-clusters)，就直接下環境變數做修改︰

```sh
-e INFLUXDB_MONITOR_STORE_ENABLED=false
```

同樣方法還可以停止上傳使用統計︰

```sh
-e INFLUXDB_REPORTING_DISABLED=true
```

### 3. 效果

`ETIMEOUT`以及`No host available`依然會出現，但頻率低了很多，而且由於順道引入了重試機制，資料最終也寫入到InfluxDB，沒有因為連接問題而流失。


### 4. 我做了甚麼

官方並沒有解釋為甚麼會出現這樣的問題，亦沒有清楚説明上述的優化到底目的何在。以下是我的猜測：

1. 降低時間戳精度可以稍微減少資料量，提高壓縮率
2. 每次寫入資料到InfluxDB時，會直接儲存到硬盤上
3. 如果寫入頻率太高，硬盤速度會追不上，令大量寫入請求超時
4. 如果資料量少，也會做成檔案系統的[寫放大](https://en.wikipedia.org/wiki/Write_amplification)問題
5. `Internal Monitoring`沒有實際用處的話，也可以被視為軟件層級的寫放大
6. 使用InfluxDB頻繁寫入、以及[Retention Policy](https://docs.influxdata.com/influxdb/v1.7/query_language/database_management/#retention-policy-management)重寫資料，令SSD加速老化，導致資料儲存速度減慢，令問題浮現
