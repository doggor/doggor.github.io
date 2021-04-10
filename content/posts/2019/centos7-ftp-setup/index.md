---
title: "記一下CentOS 7上安裝FTP server步驟"
date: 2019-08-04T12:25:35+08:00
draft: false
categories: ["DevOps"]
tags: ["centos", "ftp"]
---

工作上很少機會需要親自安裝FTP server，怕日後忘記了然後又再花不必要的功夫，這邊記一下在CentOS 7上的安裝步驟。

<!--more-->

1. 安裝vsfpd（FTP server）：
    ```sh
    yum install -y vsftpd
    ```

2. 把需要進行FTP連線的Linux賬戶登入名稱寫入`vsftpd.userlist：
    ```sh
    echo "<your_ftp_account>" >> /etc/vsftpd/vsftpd.userlist
    ```

    > - 建議為每位使用者創建一個FTP專用賬戶，並在`/etc/passwd`裡把所有FTP賬戶的shell改成`/usr/sbin/nologin`，以禁止SSH登錄。
    > - 可以使用{{<blanklink name="useradd" href="https://linux.die.net/man/8/useradd">}}指令新增賬戶。

3. 編緝`/etc/vsftpd/vsftpd.conf`，修改成以下設定：

    ```conf
    anonymous_enable=NO
    local_enable=YES
    write_enable=YES
    connect_from_port_20=YES
    chroot_local_user=YES
    listen=NO
    listen_ipv6=YES
    pam_service_name=vsftpd
    userlist_enable=YES
    tcp_wrappers=YES
    userlist_file=/etc/vsftpd/vsftpd.userlist
    userlist_deny=NO
    pasv_max_port=51000
    pasv_min_port=50000
    port_enable=YES
    pasv_enable=YES
    pasv_addr_resolve=YES
    check_shell=NO
    passwd_chroot_enable=YES
    # sovle 500 OOPS: vsftpd: refusing to run with writable root inside chroot()
    allow_writeable_chroot=YES
    ```

4. 假設已修改`/etc/passwd`禁止賬戶的SSH登錄，編緝`/etc/pam.d/vsftpd`把以下設定注釋掉：

    ```conf
    # auth required pam_shells.so
    ```

5. 讓FTP server隨系統開機啟用，並現在立即啟動：

    ```sh
    systemctl enable vsftpd
    server vsftpd start
    ```

上述設定請按項目實際情況作出適當調整，以確保可用性與安全性兼並。
