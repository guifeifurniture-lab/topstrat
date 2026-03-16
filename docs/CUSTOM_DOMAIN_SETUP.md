# 自定义域名配置指南 - topstrat.guifeifurn.com

**配置时间：** 2026-03-17 04:06  
**目标域名：** `topstrat.guifeifurn.com`  
**当前部署：** Cloudflare Pages (`topstrat-7mv.pages.dev`)

---

## 📋 配置步骤

### 步骤 1：在 Cloudflare 添加 DNS 记录

**登录 Cloudflare Dashboard：**
1. 访问 https://dash.cloudflare.com
2. 选择 `guifeifurn.com` 域名

**添加 CNAME 记录：**
- **Type:** CNAME
- **Name:** `topstrat`
- **Target:** `topstrat-7mv.pages.dev`
- **Proxy status:** Proxied (橙色云)
- **TTL:** Auto

**或者添加 A 记录（备选方案）：**
- **Type:** A
- **Name:** `topstrat`
- **IPv4 address:** `76.76.21.21` (Vercel)
- **Proxy status:** Proxied
- **TTL:** Auto

---

### 步骤 2：在 Cloudflare Pages 配置自定义域名

**访问 Pages Dashboard：**
1. https://dash.cloudflare.com/?to=/:account/pages
2. 选择 `topstrat` 项目

**添加自定义域名：**
1. 点击 **Custom domains** 标签
2. 点击 **Add a custom domain**
3. 输入：`topstrat.guifeifurn.com`
4. 点击 **Add domain**

**Cloudflare 会自动：**
- 验证 DNS 记录
- 配置 SSL 证书（免费）
- 启用 CDN 加速

---

### 步骤 3：验证配置

**DNS 传播检查：**
```powershell
# 等待 5-10 分钟后测试
nslookup topstrat.guifeifurn.com

# 应该返回 Cloudflare 的 IP
```

**访问测试：**
- http://topstrat.guifeifurn.com
- https://topstrat.guifeifurn.com（自动 HTTPS）

---

## 🔧 快速配置命令

### 在 PC-A PowerShell 执行（验证 DNS）

```powershell
# 检查 DNS 记录
nslookup topstrat.guifeifurn.com

# 检查 Cloudflare Pages
curl -I https://topstrat-7mv.pages.dev
```

---

## 📊 配置前后对比

| 项目 | 配置前 | 配置后 |
|------|--------|--------|
| **域名** | topstrat-7mv.pages.dev | topstrat.guifeifurn.com |
| **SSL** | Cloudflare 免费证书 | Cloudflare 免费证书 |
| **CDN** | Cloudflare 全球加速 | Cloudflare 全球加速 |
| **自定义** | ❌ | ✅ 品牌域名 |

---

## ⚠️ 注意事项

### 1. DNS 传播时间
- **Cloudflare 内部：** 立即生效
- **全球 DNS：** 5-30 分钟
- **最长可能：** 24 小时

### 2. SSL 证书
- Cloudflare 自动申请 Let's Encrypt 证书
- 约 5-10 分钟生效
- 自动续期

### 3. 重定向（可选）
如需将 `topstrat-7mv.pages.dev` 重定向到 `topstrat.guifeifurn.com`：

**在 Cloudflare Pages 设置：**
1. Custom domains
2. 点击 `topstrat.guifeifurn.com`
3. 启用 **Redirect subdomain**

---

## 🎯 完整配置清单

### Cloudflare DNS（guifeifurn.com）
- [ ] CNAME 记录：`topstrat` → `topstrat-7mv.pages.dev`
- [ ] Proxy status: Proxied（橙色云）

### Cloudflare Pages（topstrat 项目）
- [ ] 添加自定义域名：`topstrat.guifeifurn.com`
- [ ] 验证 DNS 记录
- [ ] SSL 证书签发

### 验证
- [ ] `nslookup topstrat.guifeifurn.com` 返回 Cloudflare IP
- [ ] https://topstrat.guifeifurn.com 可访问
- [ ] SSL 证书有效

---

## 🚀 一键验证脚本

**在 PC-A 执行：**

```powershell
Write-Host "=== 域名配置验证 ==="
Write-Host ""

# 检查 DNS
Write-Host "1. DNS 记录检查..."
nslookup topstrat.guifeifurn.com

Write-Host ""
Write-Host "2. HTTPS 访问测试..."
curl -I https://topstrat.guifeifurn.com

Write-Host ""
Write-Host "3. 原域名测试..."
curl -I https://topstrat-7mv.pages.dev

Write-Host ""
Write-Host "=== 验证完成 ==="
```

---

## 📞 需要帮助？

**Cloudflare 支持：**
- 文档：https://developers.cloudflare.com/pages/
- 社区：https://community.cloudflare.com/

**内部联系：**
- 老庄：决策者
- 诸葛亮：技术协调

---

*配置文档创建时间：2026-03-17 04:06*  
*下次审查：配置完成后*
