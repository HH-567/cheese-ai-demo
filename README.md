# 柒柿AI · 静态 Demo

这是 [柒柿AI / Cheese AI](https://github.com/HH-567/cheese-ai) 的**静态演示版**：用真实前端界面 + 浏览器内的 mock API，展示聊天命中、问答库、审核治理、用户管理、用量与设置页面。

- 在线地址：<https://hh-567.github.io/cheese-ai-demo/>
- 完整版（真实后端、登录、云端兜底、文件/图片、网页搜索）见主仓库。

## 它是怎么工作的

- `index.html` + `assets/` 是真实前端构建产物（Vite，base=`/cheese-ai-demo/`）；
- `mock-api.js` 在页面加载时接管 `window.fetch`，把 `/api/*` 请求映射到本地数据；
- `data/qa.json`：310 条精选问答，用于聊天里的原问 / 等价问法 / 语义近似匹配；
- `mock/fixtures/`：会话、问答库、治理、成员、用量、设置等页面所需的样例数据。

没有后端、没有数据库、没有真实账号；开场动画会正常播放，结束后自动以 `u-a`（管理员）登录；右上角可切换 `u-b`（审核）/ `u-c`（普通用户），权限和导航会跟着变。

## 限制

- 未命中时不会调用大模型（完整版会走云端兜底）；
- 数据是样例，改动不会保存；刷新即还原；
- 仅用于展示界面与交互，不代表真实数据。

## 本地运行

```powershell
# 在父目录起一个静态服务器，让 /cheese-ai-demo/ 路径成立
python -m http.server 8090
```

打开 <http://127.0.0.1:8090/cheese-ai-demo/>。
