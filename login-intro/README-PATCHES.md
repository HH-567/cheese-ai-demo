# vendor/dsh-boot-suite —— 原样搬运 + 9 组补丁（12 个改动点 + 图标整段替换）

上游：https://github.com/LeeRolling/dsh-boot-suite （MIT，作者 LeeRolling；视觉参考自
沈宏宏 / NativeDog1 / @yannicksong0106 的作品，详见原 README）。

这里只保留「浏览器端运行时」：`lib/splash.js`、`lib/splash.css`、`lib/assets/**`。
插件宿主半侧（路由、设置页、模板商店、壁纸）没有搬。

**升级方式**：整目录替换成新版 → 在 `splash.js` 里重新应用下面 10 处改动 → 跑
`node tests/auth.test.mjs && node tests/audio-check.mjs && node tests/e2e-screens.mjs`。
搜 `QISHI PATCH` 可以定位全部改动点（共 10 处标记）。

| # | 位置 | 改了什么 | 不改会怎样 |
|---|---|---|---|
| 1 | `assetUrl()` | 声音地址从写死的 `/dsh-startup/voice/<pack>/line-N.mp3` 改成读 `window.__QISHI_ASSET_BASE__` 的相对基址；`sfx-*` 走 `<base>/sfx/` | 独立静态页没有那些路由，`file://` 下绝对路径直接 404，全程静音 |
| 2 | 模块顶层（`STEP_ACTIONS` 上方） | 新增 `qishiBridge()` / `pendingGateStep`，给页面一个接管第 2 幕的注入点 | 无法把登录框塞进动画 |
| 3 | `waitAction()` | 「身份资料确认」这一幕改为等登录桥 `resolve()`；未注入登录桥时行为与上游一致 | 按一下回车/点一下按钮就放行 = 登录可以被绕过 |
| 4 | `showAction()` | 这一幕把只读身份卡换成页面提供的表单，按钮文案也从桥里读 | 只能显示「身份名称 / 编号 / 权限」的假卡 |
| 5 | `waitTimer()` | `TEMPLATE.gates` → `(TEMPLATE && Array.isArray(TEMPLATE.gates)) ? …` | **上游真 bug**：不注入模板时第一帧抛 `TypeError`，被顶层兜底当场揭幕（黑一下就没了） |
| 6a | `ensureAsset()` | `file://` 下直接返回 `false`，不去 fetch 本地文件 | 控制台一串 CORS 报错（结果反正也是 false） |
| 6b | `voice.line()` | 解码失败时仍然调用 `playAssetAndWait()`，而不是直接 `return 0` | 上游在 `ensureAsset` 失败就把整句丢掉，兜底永远走不到 |
| 6c | `playAssetAndWait()` | 拿不到 WebAudio buffer 时退回 `<audio>` 播同一份素材（只对 `line-*` / `voice:x:line-*`） | `file://` 下六句台词整段静音 |
| 6d | `loadAsset()` / `diagRun()` | 同样是 `file://` 就不发请求（音效回落 `tone()` 合成，诊断日志本来也只是给宿主看的） | 白刷一串 CORS 报错 |
| 7 | 构建 DOM 时 `.dsu-w3label` | 终幕鲸鱼下那行 `D E E P S E E K · H A R N E S S` 改读 `C.welcomeLabel` | 品牌改不掉，终幕还挂着别人的名字 |
| 8 | 构建 DOM 时 `.dsu-logolabel` | 第 3 幕 logo 下方那行 `D E E P S E E K` 改读 `C.logoLabel` | 同上，只是位置不同 |
| 9 | `WHALE_PATH` → `BRAND_PATH`（整段） | 标识换成柒柿的「柿子 + 7」；`svgWhale()` → `svgBrand()`，`fill-rule` 改 `evenodd`，`Path2D` 的 `fill()` 也带 `'evenodd'` | 片头里还是别人的鲸鱼 |
| 10 | `assembleLogo()` 的收尾 | 「落墨」从 `fill: none → currentColor` 改成 `fill-opacity: 0 → 1`（300ms），描边同时 1.1 → 0 | 原写法里 `fill` 起止有一个 `none`，不是可插值属性，浏览器只会硬跳 —— 那 420ms 的过渡等于没有，黑面是「啪」地出现的 |

第 9 条不是"改几行"，是整段路径替换，所以单独用工具维护：

    python tools/vectorize-icon.py     # 位图 → 路径（自带 IoU 校验）
    node   tools/apply-icon.mjs        # 路径 → splash.js 的 ICON-PATH-BEGIN/END 之间

`apply-icon.mjs` 是幂等的，反复跑只会替换两个标记之间的那一行 `var BRAND_PATH = '...'`，
顺带写一份 `assets/icon/favicon.svg`。要换成别的图标，只改 `assets/icon/source-*.png`
再跑这两条命令，**不要手改 splash.js 里那串 7KB 的路径**。

补丁 5 值得单独说：上游的 Host 半侧永远会注入一个模板对象，所以线上跑不出来；
一旦像本项目这样把运行时单独拎出来用，`TEMPLATE` 就是 `null`，`TEMPLATE.gates` 直接抛异常。
本项目**没有**用模板（六幕就是内置的 `BUILTIN_STEPS`），所以必须补这一行。

如果没有注入 `window.__QISHI_LOGIN__`，补丁 2/3/4 全部不生效，行为与上游逐行一致 ——
这是刻意的，方便别处只借这支片头。

## 素材替换（不是代码补丁，但升级时同样会丢）

| 资产 | 换成了什么 | 原文件 |
|---|---|---|
| `lib/assets/voices/f/line-6.mp3` | 终幕那句从 "Welcome to DeepSeek Harness" 换成 **"Welcome to Qishi AI."**：用户提供的整句录音，前半段「Welcome to」与原声逐样本一致，只有名字段是新的；**已按原句电平压平**（−2.9dB → 3.63s / −23.7 dBFS） | `lib/assets/voices/_original/line-6.deepseek-harness.mp3` + `audio/original/line-6.mp3` |
| `lib/splash.js` 的 `BRAND_PATH` | 鲸鱼 → 柒柿「柿子 + 7」（见补丁 9，由 `tools/apply-icon.mjs` 写入） | 上游 `WHALE_PATH`（整段被替换，留在 git 历史里） |

整目录升级时，这两样都要重做：图标跑 `node tools/apply-icon.mjs`，
台词把 `voices/f/line-6.mp3` 覆盖回去（或直接用 `_original/` 里的原声回滚）。

## 已知取舍

- `file://` 双击时，第 1 句台词可能被浏览器的自动播放策略吃掉（那一刻还没有用户手势），
  第 2 句起都在你点过「授予访问权限」之后，能正常出声。要六句齐全，把页面放到任意
  静态服务器上打开（`http://`），走的就是 WebAudio 解码那条主路径。
- `<audio>` 兜底不叠加 `voiceFx` 的 5 种音效（滤波/失真/环形调制都在 WebAudio 上做）。
