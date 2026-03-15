# 部署文档

## Vercel 部署

### 方法 1: Vercel CLI (推荐)

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

### 方法 2: GitHub 集成

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 连接 GitHub 仓库
4. 自动部署

### 方法 3: 静态导出

```bash
# 构建静态文件
npm run build

# 输出目录：out/
# 可部署到任何静态托管服务
```

## 环境变量

创建 `.env.local` 文件：

```bash
# Stripe (支付)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# GitHub (授权)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# 分析
VERCEL_ANALYTICS_ID=...
```

## 自定义域名

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
3. 配置 CNAME:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

## 性能优化

- [x] 静态生成 (SSG)
- [ ] 图片优化 (next/image)
- [ ] 字体优化
- [ ] 代码分割
- [ ] 懒加载

## 监控

- Vercel Analytics: 自动启用
- Vercel Speed Insights: 自动启用
- 自定义监控：待添加

---

**部署目标：48 小时上线**
