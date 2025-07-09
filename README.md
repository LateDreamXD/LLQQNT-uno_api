# LLQQNT-unofficial API

[LiteLoaderQQNT 非官方版](https://github.com/LateDreamXD/LLQQNT-unofficial) API 实现

## 使用方法

目前版本已有的 api:
```ts
// app api
LLQQNTuno.api.app.restart(title?: string): void; // 重启 QQ 客户端
LLQQNTuno.api.app.openURL(url: string | URL, options?: Electron.BrowserWindowConstructorOptions): Electron.BrowserWindow | null; // QQ 内新窗口打开 URL

// 插件 api
LLQQNTuno.api.plugin.install(target: string): void; // 热安装 LiteLoaderQQNT 插件 (实验性)
LLQQNTuno.api.plugin.hotload(slug: string, injects?: {main?: string, preload?: string, renderer?: string}): void; // 热加载 LiteLoaderQQNT 插件 (实验性)
```
