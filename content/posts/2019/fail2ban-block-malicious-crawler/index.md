---
title: "使用Fail2ban阻擋惡意網絡爬蟲"
date: 2019-06-04T19:34:26+08:00
draft: false
categories: ["devops"]
tags: ["fail2ban", "nginx", "php", "malicious", "crawler", "firewall"]
---

Nginx的error.log裡面看到很多錯誤request, 不斷請求一些不存在的頁面，例如`/wp-admin.php`、`/lucky.php`、`/aa.php`等等。
若果你有架設維護過網頁伺服器的經驗，想必也遇過這種情況，即使未遇上，也只是時間的問題。

<!--more-->

唉，那些惡意爬蟲好煩人

若果是簡單的web應用，直接在該應用的Nginx/Apache設定檔裡指定需要開放出來URL，其他沒有注明的都一律回傳404，比較好辦。但是啊，某些情況下，例如URL需要由web應用去自行處理(e.g. dynamic routes)、後台入口`/wp-admin.php`不能挷定IP等等，設定檔就無能為力了。以上情況，我們可以嘗試引入Fail2ban去解決。

以下是節錄自[Fail2ban官方網頁的介紹](https://www.fail2ban.org/wiki/index.php/Main_Page)：

> Fail2ban scans log files (e.g. /var/log/apache/error_log) and bans IPs that show the malicious signs -- too many password failures, seeking for exploits, etc. Generally Fail2Ban is then used to update firewall rules to reject the IP addresses for a specified amount of time, although any arbitrary other action (e.g. sending an email) could also be configured. Out of the box Fail2Ban comes with filters for various services (apache, courier, ssh, etc).
>
> Fail2Ban is able to reduce the rate of incorrect authentications attempts however it cannot eliminate the risk that weak authentication presents. Configure services to use only two factor or public/private authentication mechanisms if you really want to protect services.

Fail2ban透過監察目標程序的紀錄檔，例如Apache的`/var/log/apache/error_log`，或是今次Nginx範例的`/var/log/nginx/error.log`等，找出那些企圖暴力破解密碼、惡意登入等有問題的IP地址，然後更新防火墻規則(iptables、firewallID等)，在你指定的一段時間之內該IP的請求都會被擋下來。

Fail2ban預設支援的程序非常多，參數亦不少，以下將介紹CentOS7上安裝和設定Fail2Ban v0.9.5的方法，以阻擋PHP掃描。

#### 1. Installation

首先，確保已安裝[EPEL](https://fedoraproject.org/wiki/EPEL)：
```
#RHEL/CentOS 7
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

#建議也開啟optional, extras, 及HA repositories
subscription-manager repos --enable "rhel-*-optional-rpms" --enable "rhel-*-extras-rpms"  --enable "rhel-ha-for-rhel-*-server-rpms"
```

安裝Fail2Ban：
```sh
yum install fail2ban
```

Fail2Ban的預設設定檔位於`/etc/fail2ban/jail.conf`，你可以透過創建/etc/fail2ban/\*.local覆寫其設定。為方便解說，我們直接複製一份出來改寫：
```sh
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

接著編輯`/etc/fail2ban/jail.local`。

#### 2. IgnoreIP

首先，如果你是使用固定IP連線到此機器，建議把你的IP加到ignoreip之上，確保不會被擋掉：

```sh
vi /etc/fail2ban/jail.local
```

{{< highlight conf "linenos=table,linenostart=50" >}}
ignoreip = 127.0.0.1/8
{{< / highlight >}}

ignoreip接受IP、IP range及完整domain，每個值以空白鍵或半形逗號分隔，不接受如`*.example.com`這類wildcard domain。

#### 3. Action

透過設定`action`值，Fail2Ban可以向你發出IP封鎖報告電郵，也可以整合CloudFlare、blocklist.de等服務。預設提供有8種action，我們採用最基本的一種，不接收電郵，不整合第三方服務，僅僅把IP封鎖掉。這裡我們甚麼都不用改，若果想了解多些也可以看看下面關於action內容：
{{< highlight conf "linenos=table,hl_lines=51,linenostart=163" >}}
# The simplest action to take: ban only
action_ = %(banaction)s[name=%(__name__)s, bantime="%(bantime)s", port="%(port)s", protocol="%(protocol)s", chain="%(chain)s"]

# ban & send an e-mail with whois report to the destemail.
action_mw = %(banaction)s[name=%(__name__)s, bantime="%(bantime)s", port="%(port)s", protocol="%(protocol)s", chain="%(chain)s"]
            %(mta)s-whois[name=%(__name__)s, sender="%(sender)s", dest="%(destemail)s", protocol="%(protocol)s", chain="%(chain)s"]

# ban & send an e-mail with whois report and relevant log lines
# to the destemail.
action_mwl = %(banaction)s[name=%(__name__)s, bantime="%(bantime)s", port="%(port)s", protocol="%(protocol)s", chain="%(chain)s"]
             %(mta)s-whois-lines[name=%(__name__)s, sender="%(sender)s", dest="%(destemail)s", logpath=%(logpath)s, chain="%(chain)s"]

# See the IMPORTANT note in action.d/xarf-login-attack for when to use this action
#
# ban & send a xarf e-mail to abuse contact of IP address and include relevant log lines
# to the destemail.
action_xarf = %(banaction)s[name=%(__name__)s, bantime="%(bantime)s", port="%(port)s", protocol="%(protocol)s", chain="%(chain)s"]
             xarf-login-attack[service=%(__name__)s, sender="%(sender)s", logpath=%(logpath)s, port="%(port)s"]

# ban IP on CloudFlare & send an e-mail with whois report and relevant log lines
# to the destemail.
action_cf_mwl = cloudflare[cfuser="%(cfemail)s", cftoken="%(cfapikey)s"]
                %(mta)s-whois-lines[name=%(__name__)s, sender="%(sender)s", dest="%(destemail)s", logpath=%(logpath)s, chain="%(chain)s"]

# Report block via blocklist.de fail2ban reporting service API
#
# See the IMPORTANT note in action.d/blocklist_de.conf for when to
# use this action. Create a file jail.d/blocklist_de.local containing
# [Init]
# blocklist_de_apikey = {api key from registration]
#
action_blocklist_de  = blocklist_de[email="%(sender)s", service=%(filter)s, apikey="%(blocklist_de_apikey)s", agent="%(fail2ban_agent)s"]

# Report ban via badips.com, and use as blacklist
#
# See BadIPsAction docstring in config/action.d/badips.py for
# documentation for this action.
#
# NOTE: This action relies on banaction being present on start and therefore
# should be last action defined for a jail.
#
action_badips = badips.py[category="%(__name__)s", banaction="%(banaction)s", agent="%(fail2ban_agent)s"]
#
# Report ban via badips.com (uses action.d/badips.conf for reporting only)
#
action_badips_report = badips[category="%(__name__)s", agent="%(fail2ban_agent)s"]

# Choose default action.  To change, just override value of 'action' with the
# interpolation to the chosen action shortcut (e.g.  action_mw, action_mwl, etc) in jail.local
# globally (section [DEFAULT]) or per specific section
action = %(action_)s
{{< / highlight >}}

> 遇上惡意爬蟲少則數百多則數千數萬，決定開啟電郵通知前請先三思。

#### 4. Nginx botsearch

你會看到預設支援各式各樣服務，而這些服務一開始是未啟用的。讓我們找到nginx-botsearch設定並加入`enabled = true`以啟用它：
{{< highlight conf "linenos=table,hl_lines=2,linenostart=343" >}}
[nginx-botsearch]
enabled     = true
port        = http,https
logpath     = %(nginx_error_log)s #預設是/var/log/nginx/error.log
logencoding = utf-8
maxretry    = 2
{{< / highlight >}}

nginx-botsearch服務會持續掃描`logpath`檔案，如果發現有IP發出的有問題請求紀錄超過`maxretry`，它就會被封鎖。

#### 5. Filter

Fail4ban透過預先於`/etc/fail2ban/filter.d/`下定義的規則來尋找有問題的請求紀錄，並從中抽取來源IP。nginx-botsearch的規則定義在同名的nginx-botsearch.conf內。由於這裡未有我們需要的規則，所以要在`failregex`加入新的正則表達式，用以找出所有"Primary script unknown"錯誤的紀錄：

```
vi /etc/fail2ban/filter.d/nginx-botsearch.conf
```

加入第13行的規則：

{{< highlight conf "linenos=table,hl_lines=13" >}}
# Fail2Ban filter to match web requests for selected URLs that don't exist
#

[INCLUDES]

# Load regexes for filtering
before = botsearch-common.conf

[Definition]

failregex = ^<HOST> \- \S+ \[\] \"(GET|POST|HEAD) \/<block> \S+\" 404 .+$
            ^ \[error\] \d+#\d+: \*\d+ (\S+ )?\"\S+\" (failed|is not found) \(2\: No such file or directory\), client\: <HOST>\, server\: \S*\, request: \"(GET|POST|HEAD) \/<block> \S+\"\, .*?$
            ^ \[error\] \d+#\d+: \*\d+ FastCGI sent in stderr: \"Primary script unknown\" while reading response header from upstream, client\: <HOST>\, server\: \S*\, request: \"(GET|POST|HEAD) \/<block> \S+\"\, .*?$

ignoreregex =


# DEV Notes:
# Based on apache-botsearch filter
#
# Author: Frantisek Sumsal
{{< / highlight >}}

#### 6. Startup

以上我們的設定完成後，利用`fail2ban-client start`指令來啟動服務：

```sh
fail2ban-client start

# 2019-06-06 12:51:48,762 fail2ban.server         [226332]: INFO    Starting Fail2ban v0.9.7
# 2019-06-06 12:51:48,762 fail2ban.server         [226332]: INFO    Starting in daemon mode
```

透過`fail2ban-client status`可以查看當前有甚麼服務正在運行：

```sh
fail2ban-client status

# Status
# |- Number of jail:      1
# `- Jail list:   nginx-botsearch
```

指明服務名稱則可看見該服務現時IP封鎖相關訊息：

```sh
fail2ban-client status nginx-botsearch

# Status for the jail: nginx-botsearch
# |- Filter
# |  |- Currently failed: 2
# |  |- Total failed:     72
# |  `- File list:        /var/log/nginx/error.log
# `- Actions
#    |- Currently banned: 16
#    |- Total banned:     16
#    `- Banned IP list:   119.29.96.35 159.138.0.69 114.67.224.81 52.80.101.24 118.24.122.13 154.83.13.182 140.143.81.182 140.143.0.54 116.196.67.120 148.70.68.20 129.204.75.114 190.85.91.54 59.34.4.176 45.125.12.228 121.133.252.253 104.40.242.46
```

往後若要對設定檔作出修改，可利用`fail2ban-client reload`重新加載：

```sh
fail2ban-client reload
```
