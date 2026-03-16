# 谋士天团官网 - 开发技能需求清单

**创建时间：** 2026-03-16 09:08  
**创建者：** 管仲（architect Agent）  
**参考：** voxyz.space / topstrat.pages.dev

---

## 📊 当前状态

### 已完成页面
- ✅ index.html（首页）- 8 位谋士展示
- ✅ office.html（实时办公室）- 谋士状态 + 活动流
- ✅ radar.html（需求雷达）- 需求发现
- ✅ vault.html（定价页）- 产品介绍
- ✅ insights/（洞察笔记）- 技术博客

### 待开发功能
- ⏳ Vault 购买流程（支付集成）
- ⏳ 用户认证（GitHub OAuth）
- ⏳ 实时数据同步（WebSocket）
- ⏳ 数据分析后台
- ⏳ 自定义域名绑定

---

## 🛠️ 技能需求清单

### P0 - 高优先级（本周）

#### 1. 支付集成（Lemon Squeezy）
**用途：** Vault 页面购买流程、自动交付  
**技能：**
- Lemon Squeezy Checkout 集成
- Webhook 处理（支付成功通知）
- GitHub 自动授权（支付后添加 collaborator）

**学习资源：**
- [Lemon Squeezy Docs](https://docs.lemonsqueezy.com/)
- [Checkout API](https://docs.lemonsqueezy.com/api/overview)
- [Webhook 指南](https://docs.lemonsqueezy.com/help/webhooks)

**预计时间：** 4-6 小时

---

#### 2. GitHub OAuth 认证
**用途：** 用户登录、购买后访问控制  
**技能：**
- GitHub OAuth App 注册
- OAuth 2.0 流程实现
- JWT Token 管理
- 权限验证中间件

**学习资源：**
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [NextAuth.js GitHub Provider](https://next-auth.js.org/providers/github)

**预计时间：** 3-4 小时

---

#### 3. 实时数据同步
**用途：** Office 页面实时更新（替代轮询）  
**技能：**
- WebSocket 基础
- Cloudflare Durable Objects（实时状态存储）
- 前端 WebSocket 客户端

**学习资源：**
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

**预计时间：** 6-8 小时

---

### P1 - 中优先级（下周）

#### 4. 数据分析后台
**用途：** 访问统计、用户行为追踪  
**技能：**
- Cloudflare Web Analytics
- Google Analytics 4 集成
- 自定义事件追踪
- 数据可视化（Chart.js / Recharts）

**学习资源：**
- [Cloudflare Web Analytics](https://www.cloudflare.com/en-ca/application-services/products/web-analytics/)
- [Google Analytics 4](https://analytics.google.com/)

**预计时间：** 4-5 小时

---

#### 5. SEO 优化进阶
**用途：** 提升搜索引擎排名  
**技能：**
- 结构化数据（Schema.org）
- Sitemap 生成
- robots.txt 配置
- Open Graph 优化
- Twitter Card 优化

**学习资源：**
- [Schema.org](https://schema.org/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

**预计时间：** 2-3 小时

---

#### 6. 性能优化
**用途：** 提升页面加载速度  
**技能：**
- 图片优化（WebP、AVIF）
- CDN 配置（Cloudflare）
- 缓存策略（Service Worker）
- 代码分割（Lazy Loading）
- Lighthouse 优化

**学习资源：**
- [Web.dev Performance](https://web.dev/performance/)
- [Cloudflare Cache](https://developers.cloudflare.com/cache/)

**预计时间：** 4-6 小时

---

### P2 - 低优先级（按需）

#### 7. 邮件营销集成
**用途：** 用户通讯、产品更新通知  
**技能：**
- Resend / SendGrid API
- 邮件模板设计
- 订阅管理

**预计时间：** 3-4 小时

---

#### 8. 内容管理系统
**用途：** insights 博客文章管理  
**技能：**
- Markdown 渲染
- 静态站点生成（Next.js + MDX）
- RSS Feed 生成

**预计时间：** 4-5 小时

---

#### 9. A/B 测试框架
**用途：** 转化率优化  
**技能：**
- Vercel Edge Config
- 分流逻辑
- 转化追踪

**预计时间：** 3-4 小时

---

## 📚 技术栈推荐

### 前端
| 技术 | 用途 | 状态 |
|------|------|------|
| React | UI 框架 | ✅ 已用 |
| Tailwind CSS | 样式 | ✅ 已用 |
| TypeScript | 类型安全 | ⏳ 建议添加 |

### 后端/服务
| 技术 | 用途 | 状态 |
|------|------|------|
| Cloudflare Pages | 部署 | ✅ 已用 |
| Cloudflare Workers | 后端逻辑 | ⏳ 建议 |
| Cloudflare D1 | 数据库 | ⏳ 建议 |
| Cloudflare Durable Objects | 实时状态 | ⏳ 建议 |

### 第三方服务
| 服务 | 用途 | 状态 |
|------|------|------|
| Lemon Squeezy | 支付 | ⏳ 待集成 |
| GitHub OAuth | 认证 | ⏳ 待集成 |
| Cloudflare Analytics | 数据分析 | ⏳ 待集成 |

---

## 🎯 学习路径建议

### 第 1 周（P0）
1. Lemon Squeezy 支付集成（4-6h）
2. GitHub OAuth 认证（3-4h）
3. Vault 页面完善（2-3h）

### 第 2 周（P1）
1. 实时数据同步（6-8h）
2. 数据分析后台（4-5h）
3. SEO 优化进阶（2-3h）

### 第 3 周（P2）
1. 性能优化（4-6h）
2. 邮件营销集成（3-4h）
3. 内容管理系统（4-5h）

---

## 💡 关键决策

### 支付平台选择
**推荐：** Lemon Squeezy  
**理由：**
- 支持全球支付
- 自动处理 VAT/税务
- Webhook 完善
- 开发者友好

### 数据库选择
**推荐：** Cloudflare D1（SQLite）  
**理由：**
- 免费额度充足
- 与 Workers 无缝集成
- SQL 查询支持

### 实时方案
**推荐：** WebSocket + Durable Objects  
**理由：**
- 真正实时（替代轮询）
- 状态持久化
- 成本可控

---

## 📈 技能掌握进度

| 技能 | 优先级 | 状态 | 负责人 |
|------|--------|------|--------|
| Lemon Squeezy | P0 | ⏳ 待学习 | 管仲 + 孙膑 |
| GitHub OAuth | P0 | ⏳ 待学习 | 管仲 + 孙膑 |
| WebSocket | P1 | ⏳ 待学习 | 孙膑 |
| Cloudflare D1 | P1 | ⏳ 待学习 | 商鞅 |
| SEO 进阶 | P1 | ⏳ 待学习 | 张良 |
| 性能优化 | P2 | ⏳ 待学习 | 墨子 |

---

## 🔗 快速链接

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Lemon Squeezy Docs](https://docs.lemonsqueezy.com/)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

*最后更新：2026-03-16 09:08*  
*下一步：开始 P0 技能学习（Lemon Squeezy + GitHub OAuth）*
