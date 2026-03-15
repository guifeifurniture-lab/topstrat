# 🚀 Cloudflare Pages 部署指南

**生成时间:** 2026-03-16 07:40 GMT+8  
**状态:** 等待用户配置

---

## 📋 部署步骤

### 方法 1: Cloudflare Pages (推荐)

#### 步骤 1: 访问 Cloudflare Pages
打开：https://pages.cloudflare.com

#### 步骤 2: 创建项目
1. 点击 **"Create a project"**
2. 选择 **"Connect directly"** 或 **"Connect to Git"**

#### 步骤 3: 连接 GitHub 仓库
- **仓库:** `guifeifurniture-lab/topstrat`
- **分支:** `master`
- 点击 **"Begin setup"**

#### 步骤 4: 配置构建设置
| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Framework preset** | None | 静态网站 |
| **Build command** | (留空) | 无需构建 |
| **Build output directory** | (留空或 `.`) | 当前目录 |
| **Root directory** | `website` | 网站源码目录 |

#### 步骤 5: 设置域名
- **自定义域名:** `topstrat.pages.dev`
- 或稍后在设置中配置

#### 步骤 6: 部署
- 点击 **"Save and Deploy"**
- 等待部署完成 (约 1-2 分钟)

---

### 方法 2: Cloudflare CLI (高级)

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 初始化项目
cd C:\Users\JINDA\.openclaw\workspace-market\website
wrangler pages project create topstrat

# 部署
wrangler pages deploy . --project-name=topstrat
```

---

## 🔧 部署后配置

### 环境变量 (可选)
在 Cloudflare Pages 设置中添加：
- `ENABLE_ANALYTICS=true` (启用分析)
- 其他自定义变量

### 自定义域名
1. 进入项目设置
2. 选择 "Custom domains"
3. 添加域名并配置 DNS

### 预览部署
- 每次 push 到 GitHub 自动创建预览
- 预览 URL: `https://<commit-hash>.topstrat.pages.dev`

---

## ✅ 部署检查清单

部署完成后验证：
- [ ] 主页可访问 (https://topstrat.pages.dev)
- [ ] 所有页面加载正常
- [ ] 内部链接正常
- [ ] 响应式设计正常
- [ ] 实时数据展示正常
- [ ] 移动端适配正常

---

## 📊 当前网站状态

### 已完成页面 (6 个)
| 页面 | 路径 | 状态 |
|------|------|------|
| 主页 | `/index.html` | ✅ |
| 谋士堂 | `/office.html` | ✅ |
| 舞台 | `/stage.html` | ✅ |
| 锦囊库 | `/vault.html` | ✅ |
| 需求雷达 | `/radar.html` | ✅ |
| 场记 | `/insights/` | ✅ |

### Git 状态
- **仓库:** https://github.com/guifeifurniture-lab/topstrat
- **分支:** master
- **最新提交:** 实时数据已推送
- **总提交数:** 15+ 次

---

## 🎯 预计上线时间

| 步骤 | 时间 |
|------|------|
| Cloudflare 配置 | 5 分钟 |
| 首次部署 | 2 分钟 |
| DNS 传播 | 5-10 分钟 |
| **总计** | **约 15-20 分钟** |

---

## 📞 需要帮助？

遇到问题时：
1. 检查 Cloudflare Pages 构建日志
2. 验证 GitHub 仓库连接
3. 确认构建配置正确
4. 查看 Cloudflare 文档：https://developers.cloudflare.com/pages/

---

*最后更新：2026-03-16 07:40*  
*部署完成后更新状态*
