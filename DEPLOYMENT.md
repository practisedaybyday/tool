# 🚀 Vercel 部署指南

## 📋 前置要求

1. [Vercel 账号](https://vercel.com/signup)
2. GitHub 账号（推荐）
3. Node.js 18+

## 🔧 本地配置

### 安装 Vercel CLI

```bash
npm install -g vercel
```

### 登录 Vercel

```bash
vercel login
```

## 📦 部署步骤

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "chore: add vercel deployment config"
git push origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [https://vercel.com/new](https://vercel.com/new)
2. 选择你的 GitHub 仓库
3. 配置构建选项：

| 设置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `client/dist` |
| Install Command | `npm install` |

### 3. 配置环境变量（如需要）

在 Vercel 项目设置中添加：
- `NODE_ENV` = `production`

### 4. 部署到生产环境

```bash
# 预览部署
npm run deploy:preview

# 生产部署
npm run deploy
```

## 🔗 自动部署

Vercel 会自动在以下情况部署：
- 推送到主分支 → 生产环境
- 推送到其他分支 → 预览环境
- 打开 Pull Request → 预览环境

## 🌐 域名配置

### 1. 添加自定义域名

1. 进入 Vercel 项目设置
2. 点击 "Domains"
3. 添加你的域名（如 `cron.example.com`）

### 2. 配置 DNS

在你的域名服务商处添加 CNAME 记录：

| 类型 | 名称 | 值 |
|------|------|-----|
| CNAME | cron | cname.vercel-dns.com |

## 📊 监控与日志

- 访问 [https://vercel.com/dashboard](https://vercel.com/dashboard) 查看部署状态
- 点击 "Logs" 查看实时日志
- 使用 Analytics 查看访问统计

## 🔙 回滚部署

```bash
# 查看部署历史
vercel list

# 回滚到上一个版本
vercel rollback [deployment-url]
```

## ⚙️ 高级配置

### 自构构建脚本

编辑 `vercel.json` 自定义构建流程：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 环境特定配置

```json
{
  "env": {
    "API_URL": {
      "development": "http://localhost:3001",
      "production": "https://api.example.com"
    }
  }
}
```

## 🚨 常见问题

### 构建失败

1. 检查 `node_modules` 是否已提交（不应提交）
2. 确保 `.vercelignore` 配置正确
3. 查看构建日志定位错误

### API 跨域问题

如果调用后端 API 遇到跨域问题：

1. 确保后端已配置 CORS
2. 或使用 Vercel Edge Functions 作为代理

### 性能优化

1. 启用 Vercel Analytics
2. 配置图片优化
3. 使用 CDN 加速静态资源

## 📚 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [项目状态页](https://vercel.com/dashboard)
