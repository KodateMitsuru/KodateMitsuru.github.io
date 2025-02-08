---
title: 修改cp210x converter信息
published: 2025-02-08 23:00:36 +08:00
description: '省流：安装simplicity studio'
image: ''
tags: [usb,serial,uart,robomaster]
category: 'coding'
draft: false 
lang: ''
---

# 为什么

手上有几个cp210x的串口转接器要接在同一台设备上，由于它们信息一致,所以没法区分，因此手动修改它们的信息

# 方法一 cp210x-program

## 安装

::github{repo="VCTLabs/cp210x-program"}

```shell
paru -S cp210x-program
```

## 烧写

```shell
cp210x-program --write-cp210x \
               --set-serial-number=0721
```

## 结果

不知道是不是因为cp210x内核驱动的原因一旦烧写即断联

遂放弃

# 方法二 usbxpresshostsdk

# 安装

[地址](https://www.silabs.com/search#q=usbxpresshostsdk&t=Documentation&sort=relevancy)

```shell
paru -S silabs-usbxpresshostsdk
```

## 烧写

### 寻找配置文件

首先查找其配置文件

类似`A1-cp2102n_a02_gqfn20.configuration`

```txt
FilterPartNumByte {  { 22 }  } 
FilterVidPid {  { 10C4 }  { EA60 }  } 
Config {  { A6 02 01 FF FF 12 01 00 02 00 00 00 40 C4 10 60 EA 00 01 01 02 03 01 09 02 20 00 01 01 00 80 32 09 04 00 00 02 FF 00 00 00 07 05 02 02 40 00 00 07 05 82 02 40 00 00 04 03 09 04 00 1C 03 50 00 69 00 65 00 72 00 61 00 20 00 53 00 79 00 73 00 74 00 65 00 6D 00 73 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 16 03 43 00 61 00 6E 00 61 00 72 00 65 00 65 00 20 00 50 00 4D 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 1E 03 43 00 4E 00 52 00 41 00 31 00 32 00 31 00 4A 00 30 00 30 00 30 00 30 00 31 00 31 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 50 05 00 FF FF 0F FF FE 0F 50 05 00 FF FF 0F FF FB 0F 0F FF 83 06 33 42 00 00 01 01 00 00 00 00 00 00 00 80 02 00 00 80 02 00 00 C0 C6 2D 10 01 00 00 00 3F 01 00 00 7F 00 00 00 FF FF 07 10 0F 00 07 1F 80 02 00 00 80 02 00 00 00 00 00 00 00 00 00 00 33 00 2E 00 30 00 00 00 00 00 03 01 00 3B AC  }  } 
```

### 执行烧写

```shell
cp210xsmt --device-count 1 --set-and-verify-config my_config.txt
```

## 结果

同上，放弃

# 方法三 simplicity studio

## 安装

[官网](https://www.silabs.com/products/development-tools/software/simplicity-studio)

```shell
paru -S simplicitystudio5-bin
```

之后打开simplicity studio，连接转接器

选择install->install by connecting device(s)

![install](https://s2.loli.net/2025/02/08/zay3Y1ckormTRpQ.png)

然后一路走下去

打开xpress Configurator并编辑

![Xpress Configurator](https://s2.loli.net/2025/02/08/RSPw6XpFT7IBgUo.png)

选择Program to device烧写

## 结果

成功了，可能也有我在windows下操作的原因

# 后记

没用上，串口线一接就断连了，被哈基nuc气笑了