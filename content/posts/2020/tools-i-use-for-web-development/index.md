---
title: "2020年N個作為Web開發人員的常用工具"
date: 2020-05-30T09:55:05+08:00
draft: false
categories: ["Coding"]
tags: ["tool"]
---

市道不穩，所以在這個星期向公司請辭了，並準備迎接新的工作。今早雷雨交加，打算整理一下過往工作上使用過的軟體工具，方便我入職第一日可以快速配置新機台。

<!--more-->

### 網頁瀏覽器

1.  {{<blanklink name="Chrome" href="https://www.google.com/chrome/">}}

    全球使用人數最多，無論日常使用和工作都超好用，不得不装的瀏覽器。偵錯用的Inspector和SEO用的Audit(比Lighthouse方便)根本殺手級别。擴展方面稍後介绍。

2.  {{<blanklink name="Firefox" href="https://www.mozilla.org/en-US/firefox/">}}

    RAM使用量方面本身其實和Chrome差不多，不過擴展少一些，多分頁時感覺也就順暢一些。當主力後台開發的時候會用這個。

### 編輯器

1.  {{<blanklink name="Visual Studio Code" href="https://code.visualstudio.com/">}}

    著名而使用者眾多的IDE，背靠Microsoft，開源免費，大部分編程開發工作都在上面進行，操作簡易，擴展多，夠用。我使用{{<blanklink name="`Cascadia Code`" href="https://github.com/microsoft/cascadia-code/wiki/Installing-Cascadia-Code">}}作預設字型，可讀性不俗。

2.  {{<blanklink name="Nodepad++" href="https://notepad-plus-plus.org/">}}

    支援多種文字編碼，補足VS Code預設UTF-8編碼的不足。我座位旁邊有一位非常強大的前端開發者，就是用這款非常強大的文字編輯器作為她日常工作使用的IDE。曾經有日需要在一個已被編譯擾亂的php檔案中修改一個值，我可以用VS Code進行定位但因為編碼限制不能正確修改，而她使用Nodepad++輕易完成任務。所以這可謂是居家旁身必備軟體之一。

### 測試偵錯

1.  {{<blanklink name="Postman" href="https://www.postman.com/">}}

    測試、制訂HTTP/Restful API test cases好幫手，介面感覺不是最好用但功能齊全。

### 源碼版本控制

1.  {{<blanklink name="Sourcetree" href="https://www.sourcetreeapp.com/">}}

    作為免費軟體功能尚算完備，commercial friendly，但部分操作無效，存在不少問題。

2.  {{<blanklink name="GitKraken" href="https://www.gitkraken.com/">}}

    免費版不接受私有repository，功能齊全，操作方便，比Sourcetree好用，如果公司肯付費更好，推薦。

### 開發環境管理

1.  {{<blanklink name="Visual NMP" href="http://www.ampnmp.com/visual-nmp/">}}

    為Windows快速提供Nginx+PHP開發環境的工具，簡單方便，但深入配置有難度。使用Docker/k8s取代可能更好。

### 容器管理

1.  {{<blanklink name="Docker Desktop" href="https://www.docker.com/">}}

    只要上手容器基本使用方法，搭建開發環境就超方便，也容易縮短與生產環境之間的差異。可以一鍵啟用k8s環境(卻吃掉了差不多8GB RAM)，新版本也整合了WSL2支援（但當WSL2變得穩定可用時，我或者會直接安裝k3s，進一步降低RAM使用量）。

2.  {{<blanklink name="Portainer" href="https://www.portainer.io/">}}

    以圖形化介面管理Docker，不用牢記那麼多的Docker指令。它透過容器方式安裝運行，web介面，功能齊全，推薦。

3.  {{<blanklink name="Lens" href="https://k8slens.dev/">}}

    以圖形化介面管理k8s，能夠插入matric工具以紀錄和顯示Node運行情况，內建Helm方便安裝更多應用。

### 遠端存取

1.  {{<blanklink name="FileZilla" href="https://filezilla-project.org/">}}

    一個常用的普通FTP工具，經常有補丁更新。

2.  {{<blanklink name="Termius" href="https://termius.com/">}}

    個人覺得不錯的SSH終端，免費版基本夠用，如果你有遠端主機掌控權可以嘗試更稳定的mosh連線，付費版整合SFTP可取代FileZilla，推薦。

3.  {{<blanklink name="SoftEther VPN" href="https://www.softether.org/">}}

    免費VPN工具可以穿透NAT，讓主機連接到遠端內網，可選參數多，設定稍為複雜，穏定。

4.  {{<blanklink name="ngrok" href="https://ngrok.com/">}}

    可以生成一個public domain，以HTTP或HTTPS連接到本機指定port，測試自定義webhook非常方便，推薦。

### 數據庫管理

1.  {{<blanklink name="MySQLWorkbench" href="https://www.mysql.com/products/workbench/">}}

    官方MySQL數據庫存取管理工具，沒有不用它的理由，别跟我説phpMyAdmin甚麽的。

2.  {{<blanklink name="MongoDB Compass" href="https://www.mongodb.com/products/compass">}}

    官方MongoDB數據庫存取管理工具，一般檢視和基本操作沒有問題，組合和測試aggregation有一點慢，有時程序崩潰要kill process，暫時沒有其他更好的選擇。

3.  {{<blanklink name="Medis" href="https://github.com/luin/medis">}}

    一個Redis圖形客戶端，用來檢視一下Redis內部狀態，免費工具來説不能有甚麽批評。

### 通訊

1.  {{<blanklink name="Slack" href="https://slack.com/intl/en-hk/">}}

    盡管公司內部不使用Slack溝通，但挷定諸如GitLab、Kapacitor等服務，作為事件推送通知介面，非常方便。

### 文件編輯

1.  {{<blanklink name="PDFsam" href="https://pdfsam.org/">}}

    對PDF文件進行拆分、整合很方便。

### 繪圖

1.  {{<blanklink name="GIMP" href="https://www.gimp.org/">}}

    用作少量修改點陣圖像，不想打搞Deginer。

2.  {{<blanklink name="Inkscape" href="https://inkscape.org/">}}

    用作少量修改向量圖像，不想打搞Deginer。

3.  {{<blanklink name="Squoosh" href="https://squoosh.app/">}}

    用作壓縮優化圖像，不想打搞Deginer。

### Chrome擴展

1.  {{<blanklink name="Chrome Remote Desktop" href="https://chrome.google.com/webstore/detail/chrome-remote-desktop/inomeogfingihgjfjlpeplalcfajhgai">}}

    遠端遙控主機，公司没提供TeamViewer下最方便的選擇，疫情下在家工作全靠它。

2.  {{<blanklink name="Google Docs Offline" href="https://chrome.google.com/webstore/detail/google-docs-offline/ghbmnnjooekpmoecnnnilnnbdlolhkhi">}}

    寫文檔心很累，不能再因為斷網而打亂工作，


3.  {{<blanklink name="Google Translate" href="https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb">}}

    即時翻譯網頁文字，看洋文必備。

4.  {{<blanklink name="ChromeVox Classic Extension" href="https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn">}}

    為Chrome提供語音朗讀功能，測試網頁對於視障人士的可讀性。同時應一拼使用平台原生的讀屏功能在各款瀏覧器上作完整評估。

5.  {{<blanklink name="React Developer Tools" href="https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi">}}

    React debug工具，必用。

6.  {{<blanklink name="Redux DevTools" href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd">}}

    Redux debug工具，必用。

7.  {{<blanklink name="Vue.js devtools" href="https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd">}}

    Vue.js debug工具，必用。但自從React Hooks API正式面世後就少接觸了。

8.  {{<blanklink name="Xdebug helper" href="https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc">}}

    PHP的Xdebug擴展偵錯工具，簡單輕便。

9.  {{<blanklink name="Shodan" href="https://chrome.google.com/webstore/detail/shodan/jjalcfnidlmpjhdfepjhjbhnhkbgleap">}}

    確定伺服器沒有曝露不必要的Port，保證設定無誤。

10. {{<blanklink name="Spectrum" href="https://chrome.google.com/webstore/detail/spectrum/ofclemegkcmilinpcimpjkfhjfgmhieb">}}

    測試網頁對於色弱、色盲人士的可讀性。提供多種filter模擬各種情況。

11. {{<blanklink name="Wappalyzer" href="https://chrome.google.com/webstore/detail/wappalyzer/gppongmhjkpfnbhagpmjfkannfbllamg">}}

    檢測網頁所使用的前、後端工具，用於分析第三方網站和學習時非常有用。

12. {{<blanklink name="WhatRuns" href="https://chrome.google.com/webstore/detail/whatruns/cmkdbmfndkfgebldhnkbfhlneefdaaip">}}

    補足Wappalyzer，顯示其他可能未被檢測出的工具。

13. {{<blanklink name="Quick QR Code Generator" href="https://chrome.google.com/webstore/detail/quick-qr-code-generator/afpbjjgbdimpioenaedcjgkaigggcdpp">}}

    簡易的網址轉QR code工具，方便分享到手機上，同類擴展有很多。

### Vistual Studio Code擴展

1.  {{<blanklink name="Better Comments" href="https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments">}}

    對特定注釋進行語法高亮，例如`TODO`。

2.  {{<blanklink name="indent-rainbow" href="https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow">}}

    為縮排空白添加不同的背景色，方便區分各個層次。

3.  {{<blanklink name="Overtype" href="https://marketplace.visualstudio.com/items?itemName=adammaras.overtype">}}

    補足VS Code只有insert mode而沒有replace mode的缺點。

4.  {{<blanklink name="SCSS IntelliSense" href="https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss">}}

    輔助SCSS編寫。

5.  {{<blanklink name="Vetur" href="https://marketplace.visualstudio.com/items?itemName=octref.vetur">}}

    輔助Vue編寫。

6.  {{<blanklink name="npm Intellisense" href="https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense">}}

    自動補完js module import statement。

7.  {{<blanklink name="PHP IntelliSense" href="https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-intellisense">}}

    自動補完PHP和一般syntax check。

8.  {{<blanklink name="Prettier - Code formatter" href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode">}}

    格式化前端普遍用到的語言，例如JS、TS、JSX、CSS、SCSS、JSON。

9.  {{<blanklink name="phpfmt - PHP formatter" href="https://marketplace.visualstudio.com/items?itemName=kokororin.vscode-phpfmt">}}

    覺得整個Marketplace只有這個PHP formatter是可用的。

10. {{<blanklink name="EditorConfig for VS Code" href="https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig">}}

    EditorConfig文件支援。

11. {{<blanklink name="Code Runner" href="https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner">}}

    當前代碼直接跑，試驗某些語法、功能而不需要啟用debugger時非常方便。

12. {{<blanklink name="Jest" href="https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest">}}

    每次修改代碼後自動跑test cases。Jest比mocha好用。

13. {{<blanklink name="Debugger for Chrome" href="https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome">}}

    直接在VS Code上設置breakpoint。

14. {{<blanklink name="Docker" href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker">}}

    輔助Dockerfile編寫和簡易容器偵錯等。

完。
