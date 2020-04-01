---
title: "如何讓GitLab Runner也可以git clone私有Repositories"
date: 2019-08-03T20:59:24+08:00
draft: false
categories: ["devops"]
tags: ["gitlab","ci","git"]
---

在私有GitLab上架設GitLab Runner去處理CI/CD的確是非常方便，然而當你開始把可重用的library拆分出來成為獨立project，項目之間就會出現依賴關係，這時你的build script可能會在遇上permission denied問題。

<!--more-->

假設你的私有GitLab上有兩個private project，一個是library A，另一個是依賴library A的project B，如果要為B編寫build script給GitLab Runner執行，且build的過程需要git clone A的話，你會因為權限不足而無法把A抓下來。

其中一個解決辦法是把A這個項目的存取權限由private轉為public，但如此一來任何人也可以在無需認證的情況下自由取用這個library。這並非我們所希望的。

另一個解決辦法不需開放項目存取權限，而是以"gitlab-ci-token"作為認證名稱，以`CI_JOB_TOKEN`這個執行時環境變量作為認證密碼，在git clone的時候進行驗證，就能夠獲得私有項目的存取權限。

由於事情在build script內發生，無法與git進行互動，我們先把這個賬密寫入`~/.git-credentials`中，然後讓git在有需要時自動載入這個賬密以進行認證（第11、12行）：

{{< highlight yaml "linenos=table,hl_lines=11 12" >}}
job-build-uat:
    stage: build
    only:
        - release/uat
    tags:
        - docker
    image: node:8.16.0-jessie
    environment:
        name: uat
    script:
        - echo "http://gitlab-ci-token:${CI_JOB_TOKEN}@<your_gitlab_url>" > ~/.git-credentials
        - echo -e "[credential]\n\thelper = store" > ~/.gitconfig
        - npm i --no-save
    cache:
        paths:
            - node_modules/
{{< / highlight >}}

> 請把`<your_gitlab_url>`替換成你私有GitLab的網域名稱或IP。

第11行指示git，當遇到repository的domain是`<your_gitlab_url>`時，嘗試使用對應的賬密進行認證。

第12行指示git，使用`~/.git-credentials`去查找認證用的賬密。

在上面的script中，盡管沒有清楚指出，`npm i --no-save`實際上會對library A進行git clone（對A的依賴關係會寫在`/package.json`，`git clone` A放進`/node_modules`內並快取，往後不需再有第二次clone動作）。這也適用於其他基於git的包管理器。
