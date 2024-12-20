---
title: sanic赤石实录
published: 2024-12-20 22:53:19
description: '我的人生是这样被毁掉的'
image: ''
tags: [python,web,sanic,vercel]
category: 'coding,thinking'
draft: false 
lang: ''
---
# 说的道理

* 可爱道理镇楼

<iframe width="100%" height="468" src="https://player.bilibili.com/player.html?bvid=BV1JB4y1s7Dk&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

# 1. 首先是犯下懒惰之罪的我

为了省事用了vercel,然后花5分钟从网上抄了两段代码，一段给网页加计数器，另一段开一个api提供给前面的api用
~结果两个都不能按预期功能运行~

# 2. 然后是然后

只能学一下这个东西怎么整
其实前端挺简单，就是实现两个请求：GET PUT,关键是放到正确的位置比较麻烦，并且最开始被抄来的代码限制了思考，不知道怎么解决计数器错误增加的问题,~如果按之前的逻辑就会访问一次多两个访问量(就可以假装有好多人看我的傻逼博客)~ 分离获取和计数逻辑后就解决了

```svelte
// PageViewCounter.svelte

<script lang="ts">
import { onMount } from 'svelte'

let pageViews = 0

// execute this function after the component mounts
onMount(async () => {
  const encodedPath = encodeURIComponent(window.location.pathname)

  try {
    // fetch the data for the current page
    const response = await fetch(
      `https://example.org/api/pageViews?path=${encodedPath}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    // Gracefully handle the error scenario.
    // Default to "1" as the current user is seeing the page
    if (!response.ok) {
      pageViews = 1
    } else {
      const { count } = await response.json()
      // Optimistically, show the new page view count
      pageViews = Number(count) + 1
    }
  } catch (err) {
    // Default to "1" as the current user is seeing the page
    pageViews = 1
  }
})
</script>
{#if pageViews > 0}

  Seen 👀 by {pageViews} human(s)

{/if}
```

```astro
// Footer.astro

---
import PageViewCounter from './PageViewCounter.svelte'
...
---

...some code above
<PageViewCounter client:only="svelte" />
...some code below
```

```astro
// PostMeta.astro

---
serverside code here...
---
<script>
    let previousUrl = window.location.pathname;
    let isfirst = 0;
    // 定义一个函数来处理 URL 更改
    function handleUrlChange() {
        const currentUrl = window.location.pathname;
        if (currentUrl === previousUrl  && isfirst != 0) {
            return;
        }
        previousUrl = currentUrl;
        isfirst = 1;
        fetch('https://api.kodatemitsuru.com/api/pageViews', {
            method: 'PUT',
            referrerPolicy: 'same-origin',
            body: JSON.stringify({
                path: currentUrl,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    // 初始调用以处理当前 URL
    handleUrlChange();

    // 监听 popstate 事件以处理 URL 更改
    window.addEventListener('popstate', handleUrlChange);

    // 可选：监听 pushState 和 replaceState 以处理通过 JavaScript 更改的 URL
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handleUrlChange();
    };
</script>

...
```

然后由于astro是按需更新页面的，在某些时候页脚不会被更新，所以就会出现一些比较脑残的情形（切换页面计数不变~什么原来是全站访问量统计吗~）我实在改不来了，下次再说

# 3. 点击输入文字

## chapter 1 开心抄抄包

啪的一下很快ao,作为资深脚本小子及调包侠，我很快就从github上抄，啊不，fork了一个仓库下来改
::github{repo="kodatemitsuru/finicounter"}
~git log 见证我与依赖搏斗的艰辛~

然后装好依赖，在本地开始测试，一切都非常好，非常快于是我就打算把这玩意推上去用

## chapter 2 初见端倪

等我推完后，发现连不上mongodb,直接歇菜了，打开后你只能等待10秒后直接超时，并且离谱的是根本没有一点报错，完全无从下手，那咋办，那就换一个吧，毕竟本地测试的时候速度也稍稍有点慢了

## chapter 3 我艹，R！

于是我就把mongodb换了，换成别的什么好呢，当然是大名鼎鼎的R~ust，使用内存安全语言就肯定不会出错了吧~edis,毕竟知乎都说redis性能很好，于是在python下面调redis要用什么库呢，有一个python-redis里面的 redis.asyncio 刚好与异步框架sanic配合的很好，经过我向<sub>chat</sub>G<sub>PT</sub>老师和K<sub>imi</sub>老师的不耻上问后，我很快就把架构迁移到了redis上，然后`python app.py`，完事了

## chapter 4 真正的考验

推代码上去之后，vercel又炸了，不过这回我有日志，一看是python12和sanic20不兼容。简单，我更新就是了，一把抓住requirements.txt,顷刻删掉sanic版本，然后就炸了，定睛一看log,不知所谓，丢进google一搜，是vercel与sanic21及以上都不兼容，于是推版本，又炸，这回是ASGI环境下行为与python直接执行不同。。。
老实说，我从来没接触过异步和ASGI这些东西，或者说我本来就不怎么会编程，面对这一堆鬼东西完全是抓瞎，那就只好R<sub>ead</sub>T<sub>he</sub>F<sub>ucking</sub>M<sub>manual</sub>了

## chapter 5 《在小小的电脑里面翻啊翻啊翻》

经过一段时间的文档学习，我大概有了点思路，然后就惊奇的发现sanic20与21相比少了一堆装饰器，同时app.ctx这样的语法也没有，经过一阵紧张刺激的修改后，把代码往上一推，又炸了，想到vercel对sanic的诡异支持，不行，**爷 跑 路 了**

## chapter 6 一切的终结

让<sub>chat</sub>G<sub>PT</sub>和K<sub>imi</sub>两位老师给我把python转成nodejs,推送代码，一次成功，结束了。。。

```javascript
// index.js

const express = require("express");
const Redis = require("ioredis");
const app = express();
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(REDIS_URL);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

app.options("/api/pageViews", (req, res) => {
  res.set(corsHeaders).json({});
});

app.get("/api/pageViews", async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) return res.set(corsHeaders).status(404).json({ error: "Path parameter is required" });
    let views = await redis.get(path);
    views = parseInt(views) || 0;
    res.set(corsHeaders).json({ count: views });
  } catch (e) {
    res.set(corsHeaders).status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/pageViews", async (req, res) => {
  try {
    const path = req.body.path;
    if (!path) return res.set(corsHeaders).status(400).json({ error: "Path parameter is required" });

    const keyType = await redis.type(path);
    if (keyType === "none") {
      await redis.set(path, 0);
    }
    const views = await redis.incr(path);
    await redis.hset(path, "updateTime", new Date().toISOString());
    res.set(corsHeaders).status(204).send();
  } catch (e) {
    res.set(corsHeaders).status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));
```

# 4. 后面忘了

最后也可以说是成功跑起来了，前前后后大概折腾了六七个小时吧，自我感觉是几乎啥都没干，每次看到同龄人这个会那个会[^1]的真的peer pressure拉满，今天也是感觉自己菜的不行的一天，人生就这样了吧。

放个速核缓解一下压力

<iframe frameborder="yes" border="100" marginwidth="0" marginheight="0" width=330 height=86 src="https://music.163.com/outchain/player?type=2&id=2043164658&auto=1&height=66"></iframe>

[^1]: 要么进组，要么人工智能不会调参问我怎么调，要么特别随便拉个人都认识，你们这些大佬不要在我面前秀了好不好
