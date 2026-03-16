# 自定义域名配置清单 - topstrat.guifeifurn.com

**状态：** 待配置  
**创建时间：** 2026-03-17 04:36

---

## 需要执行的操作

### 1. Cloudflare DNS 配置

登录 https://dash.cloudflare.com → 选择 guifeifurn.com → DNS

**添加 CNAME 记录：**
- Type: CNAME
- Name: topstrat
- Target: topstrat-7mv.pages.dev
- Proxy status: Proxied (橙色云)
- TTL: Auto

---

### 2. Cloudflare Pages 配置

访问 https://dash.cloudflare.com/?to=/:account/pages/view/topstrat

**步骤：**
1. 点击 Custom domains 标签
2. 点击 Add a custom domain
3. 输入：topstrat.guifeifurn.com
4. 点击 Add domain
5. 等待 DNS 验证（约 5 分钟）
6. SSL 证书自动签发（约 10 分钟）

---

### 3. 验证配置

**DNS 检查：**
```powershell
nslookup topstrat.guifeifurn.com
```

应该返回 Cloudflare 的 IP 地址。

**访问测试：**
- http://topstrat.guifeifurn.com
- https://topstrat.guifeifurn.com（自动 HTTPS）

---

## 预计完成时间

- DNS 配置：立即生效
- Pages 验证：5-10 分钟
- SSL 证书：10-30 分钟
- 全球 DNS 传播：最长 24 小时

---

## 完成标准

- [ ] DNS 记录已添加
- [ ] Pages 已添加自定义域名
- [ ] https://topstrat.guifeifurn.com 可访问
- [ ] SSL 证书有效

---

*待执行*
