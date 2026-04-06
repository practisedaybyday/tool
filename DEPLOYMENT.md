# 🚀 Vercel 部署指南（前后端同域）

本项目采用 Monorepo 结构：

- `client/`：Vite + React 前端
- `server/`：Express API 逻辑
- `api/index.ts`：Vercel Function 入口（复用 `server` 路由）

部署后访问方式：

- 前端：`/`
- API：`/api/*`（同域，无需单独后端域名）

---

## 📋 前置要求

1. [Vercel 账号](https://vercel.com/signup)
2. GitHub 账号（推荐）
3. Node.js 18+

---

## 🔧 本地准备

```bash
cd /Users/yuanbo/ai/claude/tool
npm install
```

可选：本地先验证构建

```bash
npm run build --workspace=client
npm run build --workspace=server
```

---

## 📦 方式一：通过 GitHub 自动部署（推荐）

### 1) 推送代码

```bash
git add .
git commit -m "chore: configure vercel deployment"
git push origin main
```

### 2) 在 Vercel 导入项目

1. 打开 [https://vercel.com/new](https://vercel.com/new)
2. 选择仓库
3. 在导入页检查 **Build and Output Settings**

| 设置项 | 值 |
|---|---|
| Framework Preset | `Vite` |
| Build Command | `npm run build --workspace=client` |
| Output Directory | `client/dist` |
| Install Command | `npm install` |

> 项目根目录已包含 `vercel.json`，通常会自动读取，无需手动改写。

### 3) 触发部署

- 首次导入会自动部署一次
- 后续推送到 `main` 自动触发生产部署
- 推送到其他分支自动触发预览部署

---

## 🧪 方式二：Vercel CLI 部署

### 安装并登录

```bash
npm install -g vercel
vercel login
```

### 预览部署

```bash
vercel
```

### 生产部署

```bash
vercel --prod
```

---

## ✅ 部署后验证

部署完成后先检查：

1. 健康检查接口：`https://<your-domain>/api/health`
2. 页面是否可打开：`https://<your-domain>/`
3. 页面上 Cron 解析与下次执行时间是否正常返回

---

## ⚙️ 当前关键配置说明

### `vercel.json` 关键点

- `buildCommand`: `npm run build --workspace=client`
- `outputDirectory`: `client/dist`
- `functions.api/index.ts.runtime`: `@vercel/node`
- `rewrites`：
  - `/api/(.*)` -> `/api/index.ts`
  - `/(.*)` -> `/index.html`

### API 路径约定

前端统一使用相对路径：

- `/api/cron/parse`
- `/api/cron/next-runs`

这样本地与线上行为一致。

---

## 🌐 自定义域名（可选）

1. Vercel 项目 -> `Settings` -> `Domains`
2. 添加域名（如 `cron.example.com`）
3. 按提示在 DNS 平台添加 CNAME / A 记录

---

## 🚨 常见问题

### 1) 页面打开正常，但 API 404

- 确认仓库包含 `api/index.ts`
- 确认 `vercel.json` 中 `/api/(.*)` rewrite 指向 `/api/index.ts`
- 在部署日志中确认 Function 构建成功

### 2) `FUNCTION_INVOCATION_FAILED` + `ERR_REQUIRE_ESM`

典型日志：

```txt
Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported
```

原因：Vercel Function 运行在 CommonJS 包装时，直接 `require` 到 ESM 文件（例如从 `api/index.ts` 跨目录引用 `server/src/...`）会失败。

处理方式：

- `api/index.ts` 保持自包含（直接定义接口逻辑），避免跨目录 import ESM 路由文件
- 或统一改造为 Vercel 兼容的单一模块输出（成本更高，不建议在当前项目采用）

本项目推荐做法：保持 `api/index.ts` 中直接实现 `/api/cron/parse` 与 `/api/cron/next-runs`。

### 3) 构建失败

- 先本地运行：
  - `npm run build --workspace=client`
  - `npm run build --workspace=server`
- 检查 Node 版本（建议 18+）
- 检查 lockfile 与依赖是否一致

### 4) 首屏正常，刷新子路由 404

- 确认存在 fallback rewrite：`/(.*)` -> `/index.html`

---

## 📚 参考链接

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
