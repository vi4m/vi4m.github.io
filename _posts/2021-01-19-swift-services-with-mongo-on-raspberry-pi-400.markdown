---
title: Swift on Raspberry Pi 400
date: 2021-01-19 16:45:00 Z
categories:
- programming
tags:
- swift
- raspberrypi
---


# Swift on Raspberry PI as a microservices backend
 
Raspberry Pi 400 has sufficient power to run full-featured microservices written in Swift. Running Swift (together with MongoDB) on such a small gadget is serious fun!


I've tested this setup on Raspberry PI 400 which has a quad core processor, 4 GB of RAM and a speedy USB 3.0 SSD, however the instructions below are not limited only to this device. The base configuration was not overclocked.


# But why?

I did it just for fun, this was just a trial, but it seems, this setup will stay with me much longer! The potential applications cover: serving home pages, or running a variety of small applications.

To my surprise, Raspberry PI 400 has a great heatsink and allows not only running Swift backends on it, but it also runs Visual Studio Code. 


# Installing Swift on Rasperry PI

If you want to use the latest Vapor 4, you need to upgrade Raspberry PI OS to 64 bits. Otherwise, this step may be skipped.

Ideal setup, as of 01/2020 is:

* Swift 5.3.1
* MongoDB 4.9.0
* Nginx

For IDE we will use:

* Visual Studio Code 1.52.1 (latest current version)
* sourcekit-lsp trunk (revision:6eb17c9a7bc00bec83d57d2399ba9f5ab14d3bcc )

## Upgrading to Rasperry PI OS 64 bit

Swift ARM builds are available here: https://packagecloud.io/swift-arm/release. 
Unfortunatelly, the latest version for Rasperry PI OS (default distribution) is 5.1.3 and it's not usable with the latest Vapor 4 version. We need to upgrade the operating system to 64 bits.

1. Install the beta version of Rasperry PI OS 64 bit https://www.raspberrypi.org/forums/viewtopic.php?p=1668160 if you need the latest Swift. 
2. Install  ```dpkg -i https://packagecloud.io/swift-arm/release/packages/debian/buster/swiftlang_5.3.1-3-debian-buster_arm64.deb package from packagecloud.io```.
3. Swift REPL is not usable at the moment, but it's not a big deal so don't worry. 
4. Swap file. Swift needs a lot of memory during the compilation, so let's find a spare SSD drive, and create some fast swap files, at least 5 GB. 

```sh
swapoff -a
dd if=/dev/zero of=/media/[yourssd]/swap ibs=1M obs=1M count=5000
mkswap /media/[yourssd]/swap
swapon /media/[yourssd]/swap
```
5. That's it. Test if your code compiles. Vapor 4 should run just fine!
```sh

swift package init --type executable
swift build
```

## IDE on Raspberry PI with Visual Studio Code, LSP and Swift

1. Install ARM64 DEB package from Visual Studio Code https://code.visualstudio.com/download
2. You need this package: `https://github.com/apple/sourcekit-lsp` to use the Auto-Completion functionality in Visual Studio Code, because version 5.3.1 is unusably slow. The new version is 10 times more performant. We will compile it from sources using this documentation https://github.com/apple/sourcekit-lsp/blob/main/Documentation/Development.md. 

This will work for arm64:
```sh
swift build -c release -Xcxx -I/usr/lib/swift -Xcxx -I/usr/lib/swift/Block
cp .build/aarch64-unknown-linux-gnu/release/sourcekit-lsp /usr/local/bin/sourcekit-lsp

apt-get install npm
cd Editors/vscode
npm run createDevPackage
code --install-extension ./out/sourcekit-lsp-vscode-dev.vsix
```
After installation, every feature should work well, including: autocompletion, fix-its, documentation, go to definition.
If not, it's probably because of the internal card speed - see below how to improve the performance by a factor of 10.


## Optimization

SD cards tend to be slow. I recommend to either boot from an SSD entirely, or boot from an SD card, but in this case move the essential data to faster drive. It makes a huge difference during development.


**Directories to move to external faster drive:**
```

~/.config/Code (for Visual Studio Code)
~/.cache  (for various developmnt tasks)
/tmp (e.g. lsp cache)
```

```
fs.inotify.max_user_watches=524288
cd /sys/devices/system/cpu
echo performance > cpu0/cpufreq/scaling_governor 
echo performance > cpu1/cpufreq/scaling_governor 
echo performance > cpu2/cpufreq/scaling_governor 
echo performance > cpu3/cpufreq/scaling_governor 
echo performance > cpu4/cpufreq/scaling_governor 
```


## MongoDB on Raspberry PI

Ok, this is an optional step. Chances are, your microservice needs a database, such as MongoDB. Yes, it works just fine, but you need to compile it from sources.

1. You need at least 20 GB of free space for compilation. Compilation will take at least 5-10 hours.
2. We will compile as usual using https://github.com/mongodb/mongo/blob/master/docs/building.md, but have to provide additional flag since there are problems with crc32 because of missing instructions. [More information here](https://jira.mongodb.org/browse/SERVER-30893)
Using flag ```--use-hardware-crc32=off``` will compile it fine. Full script should look similar to this: 
```
git clone https://github.com/mongodb/mongo.git

python3 -m vevn virtualenv
source virtualenv/bin/activate

python3 buildscripts/scons.py install-mongod --disable-warnings-as-errors --use-hardware-crc32=off

```
3. Congratulations, after 5-10 hours, you will get the 4,2 GB binary file called `mongodb`. It's time to strip it to just ~40 MB with the instructions below:
```
root@raspberrypi:/media/pi/rpi/mongo# ls build/install/bin/mongod
build/install/bin/mongod

root@raspberrypi:/media/pi/rpi/mongo# strip build/install/bin/mongod
root@raspberrypi:/media/pi/rpi/mongo# cp build/install/bin/mongod /usr/local/bin
```
4. Now it's time to prepare a storage space for a database and logs. Use your external drive and mount it somewhere. E.g. create `mongo-data` and `mongo-logs` directories, and use the following configuration files as examples.
I used the simplest configuration possible. I recommend changing the default user `pi`, for security reasons.


```sh
root@raspberrypi:/media/pi/rpi/mongo# cat /etc/systemd/system/mongodb.service 
```
```ini
[Unit]
Description=MongoDB Database Server
Documentation=https://docs.mongodb.org/manual
After=network-online.target
Wants=network-online.target

[Service]
User=pi
Group=adm
#EnvironmentFile=-/etc/default/mongod
ExecStart=/usr/local/bin/mongod --config /etc/mongod.conf
PIDFile=/var/run/mongodb/mongod.pid
# file size
LimitFSIZE=infinity
# cpu time
LimitCPU=infinity
# virtual memory size
LimitAS=infinity
# open files
LimitNOFILE=64000
# processes/threads
LimitNPROC=64000
# locked memory
LimitMEMLOCK=infinity
# total threads (user+kernel)
TasksMax=infinity
TasksAccounting=false

# Recommended limits for mongod as specified in
# https://docs.mongodb.com/manual/reference/ulimit/#recommended-ulimit-settings

[Install]
WantedBy=multi-user.target
```

And this is the counterpart `/etc/mongod.conf` file.
```ini
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /media/[yourssd]/mongo-data
  journal:
    enabled: true
#  engine:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /media/[yourssd]/mongo-logs/mongo.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1


# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

#security:

#operationProfiling:

#replication:

#sharding:

## Enterprise-Only Options:

#auditLog:

#snmp:
```
It's time to run it!

```sh
systemctl daemon-reload
service mongodb start
```

Check your logs directory for troubleshooting with `journalctl -u mongodb.service`.


Congratulations!

I hope you will have as much fun as I did with this. Feel free to leave any comments or suggestions below. 
Thanks for trying it out!

