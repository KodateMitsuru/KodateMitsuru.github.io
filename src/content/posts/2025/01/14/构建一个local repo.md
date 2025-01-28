---
title: 构建一个local repo
published: 2025-01-14 18:39:09 +08:00
description: ''
image: ''
tags: [git,AUR,Archlinux,javascript,cloudflare]
category: 'coding'
draft: false 
lang: ''
---
# 起因

Archlinux用了也快有五六年了，AUR是每天都要打交道的东西(指天天`paru`)但是aur里面的东西不一定都是好的，很多PKGBUILD早就过时了，或者我有什么神奇需求，比如Kernel Lockdown啦，就得对PKGBUILD进行一番改造，这到没什么，paru有一个自动合并的功能，只要你对修改后的仓库commit过，就会自动帮你合并以后的更改

但是在paru里，aur的优先级默认是最低，而且改不了，因为貌似是硬编码的，因此如果你像我一样有什么archlinuxcn,chaotic-aur,arch4edu,blackarch的话，默认就会从它们那里更新未修改的版本，然后你的自定义就没了

那么有什么办法解决呢？~其实很简单，只要注册一个AUR账号，然后向包管理者提出共同维护或者直接orphan掉，然后拿到维护权限就可以随便自定义了~那么local repo就可以出场了

# 什么是 local repo？

local repo 字面意思就是本地的repo,它和线上的repo是同样的，但是文件存在本地，通过这个机制，我们就可以提高特定包在paru里面的优先权限

:::note[相关知识]
pacman 读取 `/etc/pacman.conf` 的repo后会根据从上到下的顺序设定优先级，更新优先从最上方的repo开始，每次选取该仓库内所有可更新的软件包，且不会重复选取

:::

# 怎么使用？

## 首先

首先就是到`/etc/pacman.conf`里面新建一个local repo

事实上里面就有一个例子，取消注释后选取一个你喜欢的位置即可

```
[custom]
SigLevel = Optional TrustAll
Server = file:///home/admin/.local/share/LocalRepo/
```

## 然后

在`/etc/paru.conf`里面同样启用，你也可以在其他合法配置文件位置进行

```
LocalRepo=custom
#Chroot
#Sign
#SignDb
#KeepRepoCache
```

## 然后的然后

~就没有了，enjoy it！~

如果只是配置本地仓库，那么已经结束了，不过既然都整了本地仓库了，为什么不搞个线上仓库呢？

# 配置线上仓库

## gpg key

首先生成一对gpg key

```shell
gpg --full-gen-key
gpg --send-keys key-id
```

可以看看密钥对不对

```shell
gpg --list-keys
gpg --list-secret-keys
```

## 加入pacman密钥环

```shell
sudo pacman-key --recv-key key-id --keyserver keyserver.ubuntu.com
sudo pacman-key --lsign-key key-id
```

然后可以启用paru里面的签名

```
LocalRepo=custom
#Chroot
Sign
SignDb
#KeepRepoCache
```

如果有未签名的包，用gpg手动签名

```shell
gpg --detach-sign --no-armor package.pkg.tar.zst
repo-add custom.db.tar.gz package.pkg.tar.zst -s -v
```

## 测试

现在可以删除`/etc/pacman.conf`中的`SigLevel = Optional TrustAll`检测是否可以正常安装local repo包

如果一切正常，那么弄个服务器把文件放上去就可以了

# 结束了。。。？

当然没有，如果你手上没有服务器呢，也可以使用git lfs存储

## 存储

首先将你的repo变为git repo

```shell
git init
```

然后启用lfs

```shell
git lfs install
```

跟踪文件

```shell
git lfs track "*.pkg.tar.zst"
```

上传github

## 对外服务

想要令其能够正常使用，直接用raw是不行的，其一是因为你的repo里面含有软链接，这在github里面呈现为一个文本，根本无法使用，其二是因为lfs不能从raw获取，因为它的实际存储位于github的S3上

那么就没有办法了吗，不，我们可以使用cloudflare worker来帮助我们完成重定向

```javascript
export default {
	async fetch(request ,env) {
		const url = new URL(request.url);
		if(url.pathname !== '/'){
			let githubRawUrl = 'https://github.com/$user/$repo/raw/refs/heads/main';
			if (url.pathname === "/custom.db") {
				githubRawUrl += "/custom.db.tar.gz";
			} else if (url.pathname === "/custom.db.sig") {
				githubRawUrl += "/custom.db.tar.gz.sig";
			} else if (url.pathname === "/custom.file") {
				githubRawUrl += "/custom.file.tar.gz";
			} else if (url.pathname === "/custom.file.sig") {
				githubRawUrl += "/custom.file.tar.gz.sig";
			} else {
				githubRawUrl += url.pathname;
			}
			githubRawUrl += "?download="


			// 构建请求头
			const headers = new Headers();

			// 发起请求
			const response = await fetch(githubRawUrl, { headers });

			// 检查请求是否成功 (状态码 200 到 299)
			if (response.ok) {
				return new Response(response.body, {
					status: response.status,
					headers: response.headers
				});
			} else {
				const errorText = env.ERROR || '无法获取文件，检查路径或TOKEN是否正确。';
				// 如果请求不成功，返回适当的错误响应
				return new Response(errorText, { status: response.status });
			}
		} else {
			//首页自定义
			return new Response(await nginx(), {
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				},
			});
		}
	}
};

async function nginx() {
	const text = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
  <meta charset="utf-8" />
  <title>xxx's repo</title>
</head>
<body>

<header>
<h1 class="title">xxx's repo</h1>
<blockquote class="metadata">
</blockquote>
</header>
<main>
<h1 id="xxx-repo">xxx's repo</h1>
</main>
</body>
</html>
`
	return text ;
}
```

那么就可以正常获取内容了

# 后记

欢迎大家使用我的[repo](https://repo.kodatemitsuru.com/)！

也欢迎star

::github{repo="KodateMitsuru/customrepo"}
