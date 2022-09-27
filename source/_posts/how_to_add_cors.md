---
title: 记录为live2dapi添加cors
author:
tags: cors,vercel,api,nodejs
categories: 建站
date: 2022/9/27 20:49:29
---
# 1 说在最前

因为个人是高中生，没有资金来源，所以想干什么都先将费用问题放在第一上。
最近用一个免费主机freehostia建了本博客的
live2dapi[^1]
但是遇到了cors跨域问题。
这里给出一个解决方案(反代+添加标头)，同时解决cors及加载缓慢的问题。

# 2 选择部署平台

## 2.1 vercel serverless平台

### 2.1.1 注册帐号

注册链接在此
[vercel注册](https://vercel.com/signup)

可以通过github,gitlab或bitbucket~有人用过吗~直接注册，也可以用邮箱

### 2.1.2 部署

见后文

## 2.2 其他平台

其他还有cfpage,railway,koyeb等，可自行测试

# 3 部署

## 3.1 创建仓库

创建一个github仓库
公开或私有随意
创建主脚本文件index.js

```Nodejs
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require('path');
//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    // 设置是否运行客户端设置 withCredentials
    // 即在不同域名下发出的请求也可以携带 cookie
    res.header("Access-Control-Allow-Credentials", true)
    // 第二个参数表示允许跨域的域名，* 代表所有域名  
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
    // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
});

var targetUrl = "domain";
// 拦截api的请求，转到目标服务器(domain换成api域名)
app.use('/*', createProxyMiddleware({ target: targetUrl, changeOrigin: true }));



//配置服务端口
app.listen(3000, () => {
    console.log(`localhost:3000`);
});
```

向package.json中添加依赖

```json
{
  "name": "cors",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "node index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/KodateMitsuru/cors.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/KodateMitsuru/cors/issues"
  },
  "homepage": "https://github.com/KodateMitsuru/cors#readme",
  "dependencies": {
    "connect-timeout": "^1.9.0",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "http-proxy-middleware": "^2.0.6"
  }
}
```

填写vercel.json

```json
{
	  "version": 2,
	 "builds": [
        {
            "src": "/index.js",
            "use": "@vercel/node"
        }
    ],
	"routes": [
        {
            "src": "/(.*)",
            "dest": "/index.js"
        }
    ]
}
```

## 3.2 部署

连接vercel,部署

# 4 使用

将vercel提供域名替换原域名即可

# 5 提示

vercel免费判断每月500GB为不滥用，尽量不超过

### 脚注

[^1]: 感谢大佬开源，仓库地址[live2d-widget](https://github.com/stevenjoezhang/live2d-widget),[live2d_api](https://github.com/fghrsh/live2d_api)

