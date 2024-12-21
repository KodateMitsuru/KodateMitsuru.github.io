---
title: swup赤石实录
published: 2024-12-21 22:27:02
updated: 2024-12-22 01:26:43
description: '我是小馋猫'
image: ''
tags: [web,swup]
category: 'coding'
draft: false 
lang: ''
---
# 起因

[书接上回](https://blog.kodatemitsuru.com/posts/2024/12/20/sanic%E8%B5%A4%E7%9F%B3%E5%AE%9E%E5%BD%95/#:~:text=%E7%84%B6%E5%90%8E%E7%94%B1%E4%BA%8Eastro%E6%98%AF%E6%8C%89%E9%9C%80%E6%9B%B4%E6%96%B0%E9%A1%B5%E9%9D%A2%E7%9A%84%EF%BC%8C%E5%9C%A8%E6%9F%90%E4%BA%9B%E6%97%B6%E5%80%99%E9%A1%B5%E8%84%9A%E4%B8%8D%E4%BC%9A%E8%A2%AB%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%89%80%E4%BB%A5%E5%B0%B1%E4%BC%9A%E5%87%BA%E7%8E%B0%E4%B8%80%E4%BA%9B%E6%AF%94%E8%BE%83%E8%84%91%E6%AE%8B%E7%9A%84%E6%83%85%E5%BD%A2%EF%BC%88%E5%88%87%E6%8D%A2%E9%A1%B5%E9%9D%A2%E8%AE%A1%E6%95%B0%E4%B8%8D%E5%8F%98%E4%BB%80%E4%B9%88%E5%8E%9F%E6%9D%A5%E6%98%AF%E5%85%A8%E7%AB%99%E8%AE%BF%E9%97%AE%E9%87%8F%E7%BB%9F%E8%AE%A1%E5%90%97%EF%BC%89%E6%88%91%E5%AE%9E%E5%9C%A8%E6%94%B9%E4%B8%8D%E6%9D%A5%E4%BA%86%EF%BC%8C%E4%B8%8B%E6%AC%A1%E5%86%8D%E8%AF%B4)，当我研究怎么修好计数不更新时，我尝试各种了各种引入svelte模块的方式

:::note[相关知识]

## Islands architecture

Astro helped pioneer and popularize a new frontend architecture pattern called **Islands Architecture.** Islands architecture works by rendering the majority of your page to fast, static HTML with smaller “islands” of JavaScript added when interactivity or personalization is needed on the page (an image carousel, for example). This avoids the monolithic JavaScript payloads that slow down the responsiveness of many other, modern JavaScript web frameworks.

### What is an island?

In Astro, an island is an enhanced UI component on an otherwise static page of HTML.

A **client island** is an interactive JavaScript UI component that is hydrated separately from the rest of the page, while a **server island** is a UI component that server-renders its dynamic content separately from the rest of the page.

Both islands run expensive or slower processes independently, on a per-component basis, for optimized page loads.

By default, Astro will automatically render every UI component to just HTML & CSS, **stripping out all client-side JavaScript automatically.**

```astro
<!-- src/pages/index.astro -->

<MyReactComponent />
```

This may sound strict, but this behavior is what keeps Astro websites fast by default and protects developers from accidentally sending unnecessary or unwanted JavaScript that might slow down their website.

Turning any static UI component into an interactive island requires only a `client:*` directive. Astro then automatically builds and bundles your client-side JavaScript for optimized performance.

```astro
<!-- src/pages/index.astro -->

<!-- This component is now interactive on the page!     The rest of your website remains static. -->
<MyReactComponent client:load />
```

With islands, client-side JavaScript is only loaded for the explicit interactive components that you mark using `client:*` directives.

And because interaction is configured at the component-level, you can handle different loading priorities for each component based on its usage. For example, `client:idle` tells a component to load when the browser becomes idle, and `client:visible` tells a component to load only once it enters the viewport.

——引自[astro Docs](https://docs.astro.build/en/concepts/islands/)
:::

因此我尝试了各种各样的`client:*`，事实上什么作用都没有，那么我就只好继续读代码找到底逻辑是怎么运作的

# 经过

我通过不断翻代码找到了这个玩意，有请我们今天的主角——

::github{repo="swup/swup"}

让我们读一读readme

> ## Overview
>
> Swup adds **page transitions** to server-rendered websites. It manages the complete page load lifecycle and smoothly animates between the current and next page. In addition, it offers many other quality-of-life improvements like **caching**, **smart preloading**, native **browser history** and enhanced **accessibility**.
>
> Make your site feel like a snappy single-page app — without any of the complexity.

原来是你小子掌管着我的页面刷新啊，那赶快丢进ai问问怎么不要让它来接管[^1]

ai啪的一下给出来一堆信息，一点卵用没有，全是一些子虚乌有的方法

看来只能硬着头皮上了

打开[docs](https://swup.js.org/getting-started/)让我康康👀用法

。

。

。

经过一阵紧张刺激的阅读后我看到了这个`[data-swup-ignore-script]`

好似天降甘霖，我马上就把它写进去试试

。

。

。

试试就逝世

不能说是效果显著吧，只能说是毫无波兰

<div style="font-size:50px;margin: 0; padding: 0;"> 怎么辦？</div>

![只有殺](https://s2.loli.net/2024/12/21/g94w3eUGbvu5mMA.png)<sub>bushi(</sub>

虽然很想把电脑切了但是还是得看代码

# ~之后看了个爽~

经过一阵青年大学习，我终于认识到其实没有被swup接管才是原因[^2]，为什么呢，因为被包在`<main></main>`里的`<footer />`是可以正常刷新的，但是直接把另一个`<footer />`塞进去会使整个页面错乱，~要不然主题作者为什么不删掉后面一个而是用`block lg:hidden`和`hidden lg:block`做移动端适配~于是我就看了一下指导swup接管另一个`<footer />`的刷新，于是我就看到[这个](https://swup.js.org/options/)

> # Options
>
> Swup has several options that can be passed in during initialization.
>
> ## Defaults
>
> These are the default options. See below for details on each option.
>
> ```javascript
> const swup = new Swup({
>   animateHistoryBrowsing: false,
>   animationSelector: '[class*="transition-"]',
>   animationScope: 'html',
>   cache: true,
>   containers: ['#swup'],
>   hooks: {},
>   ignoreVisit: (url, { el } = {}) => el?.closest('[data-no-swup]'),
>   linkSelector: 'a[href]',
>   linkToSelf: 'scroll',
>   native: false,
>   plugins: [],
>   resolveUrl: (url) => url,
>   requestHeaders: {
>     'X-Requested-With': 'swup',
>     'Accept': 'text/html, application/xhtml+xml'
>   },
>   skipPopStateHandling: (event) => event.state?.source !== 'swup',
>   timeout: 0
> });
> ```

和对应的`astro.config.js`

> ```javascript
> swup({
>   theme: false,
>   animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
>   // the default value `transition-` cause transition delay
>   // when the Tailwind class `transition-all` is used
>   containers: ["main", "#toc"],
>   smoothScrolling: true,
>   cache: true,
>   preload: true,
>   accessibility: true,
>   updateHead: true,
>   updateBodyClass: false,
>   globalInstance: true,
> }),
> ```

这里的container就是指示需要接管的container的

因此我就试着加进去footer

然而事实上并没有任何作用，我加进去的container除了搞崩swup~使得彻底不用担心不刷新~之外就是根本起不到作用[^3]

于是我只能找找别的方法

swup有[hook](https://swup.js.org/hooks/)的机制用于在特定时刻运行指定代码

:::note[相关知识]

## Hooks

Lifecycle hooks allow triggering custom code at each step of the page transition process. Read on to learn about registering handlers or jump straight to the list of available hooks.

### List of hooks

The following hooks are exposed by swup and can be listened to. Refer to the [lifecycle diagram](https://swup.js.org/lifecycle/#lifecycle-diagram) for a visual overview of when the most important hooks are called. Install the [Debug Plugin](https://swup.js.org/plugins/debug-plugin) to log triggered hooks to the browser console as they are happening.


| Hook name               | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| **animation:out:start** | Current content starts animating out. Class`.is-animating` is added.              |
| **animation:out:await** | Swup waits for CSS animations to finish before replacing the content.             |
| **animation:out:end**   | Current content finishes animating out. Content is not yet replaced.              |
| **animation:in:start**  | New content starts animating in. Class`.is-animating` is removed.                 |
| **animation:in:await**  | Swup waits for CSS animations to finish before finishing the visit.               |
| **animation:in:end**    | New content finishes animating out.                                               |
| **animation:skip**      | Page will load at once without animations, e.g. on history navigation.            |
| **cache:set**           | Page is saved to the cache.                                                       |
| **cache:clear**         | The cache is cleared completely.                                                  |
| **content:replace**     | The old content of the page is replaced by the new content.                       |
| **content:scroll**      | The scroll position is reset after replacing the content.                         |
| **enable**              | Swup instance is created.                                                         |
| **disable**             | Swup instance isdisabled.                                                         |
| **fetch:error**         | Fetch request is rejected because of a server error.                              |
| **fetch:request**       | Fetch request is sent.                                                            |
| **fetch:timeout**       | Fetch request has timed out.                                                      |
| **history:popstate**    | History navigation is started: back/forward button was pressed.                   |
| **link:click**          | Link is clicked.                                                                  |
| **link:self**           | Link is clicked that leads to the current page.                                   |
| **link:anchor**         | Link is clicked that jumps to an anchor on the current page.                      |
| **link:newtab**         | Link is clicked that opens to a new tab.                                          |
| **page:load**           | Page is loaded from cache or via fetch request.                                   |
| **page:view**           | New content is visible after replacing the content.                               |
| **scroll:top**          | Scroll to the top of the page.                                                    |
| **scroll:anchor**       | Scroll to an anchor on the current page.                                          |
| **visit:start**         | Visit started: transition to a new page begins.                                   |
| **visit:end**           | Visit ended: all content is replaced, animations have finished.                   |
| **visit:abort**         | Visit aborted: a new link was clicked before the current transition has finished. |

——引自[swup blog](https://swup.js.org/hooks/)
:::

经过我的一番尝试，我发现可以在`page:view`时添加一段代码，于是我开始查找有什么方法可以刷新内容

询问ai,其告诉我可以通过更改element的属性来使其被刷新，然并卵

事实上刷新请求应该全部被swup接管了，所以根本不会变

最后还真让我找到了一个非常好的方法来强制刷新网页。那就是——————

<div style="font-size:100px;margin: 0; padding: 0;"> 自己手动刷！ </div>

没错，就是手动去改html

于是这依托答辩就诞生了

```typescript
const specificElement = document.getElementById('counter'); //奇异搞笑之手动更新
if (specificElement) {
    specificElement.innerHTML = "Loading..."
}
try {
    // fetch the data for the current page
    const response = await fetch(
        `https://example.com/api/pageViews?path=${encodedPath}`,
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

    if (specificElement) {
        specificElement.innerHTML = `Seen 👀 by ${pageViews} human(s)`
    }
} catch (err) {
    // Default to "1" as the current user is seeing the page
    pageViews = 1
}
```

移动端模式下刷新网页，访问计数被刷新了，总算结束了

# 后记

感觉没用的知识又增加了，还是不知道怎么面对线代和高数，🐔

# 后后记
突然发现这样就可以干掉一个位置的`<PageViewCounter client:only="svelte" />`,然后就可以合并计数更新代码到svelte里面[^4]，这样就解决获取计数与更新计数不同步的奇异搞笑问题了
这依托史突然优美不少，绷

[^1]: 这个时候我还不知道原来是没被接管导致的，笑嘻了
    
[^2]: 现在才知道，晚了哈哈，你已经浪费了生命中宝贵的3小时
    
[^3]: 如果有哪位大佬知道可以告诉我，~虽然估计没什么人会看就是~

[^4]: 因为少了一个`<PageViewCounter client:only="svelte" />`打开页面时就不会调用两次代码