# 谋士天团官网 - 部署备份文档

**文档版本：** v1.0  
**最后更新：** 2026-03-16 19:31  
**负责人：** 商鞅（shangyang）- DevOps

---

## 📊 项目概览

| 项目 | 值 |
|------|-----|
| **项目名称** | 谋士天团官网 (TopStrat) |
| **GitHub 仓库** | `guifeifurniture-lab/topstrat` |
| **部署平台** | Cloudflare Pages |
| **主域名** | https://topstrat-7mv.pages.dev |
| **技术栈** | HTML + Tailwind CSS + Vanilla JS |
| **代码所有者** | 老庄 |

---

## 🌐 域名与部署

### Cloudflare Pages 配置

| 配置项 | 值 |
|--------|-----|
| **项目名称** | `topstrat` |
| **生产域名** | `topstrat-7mv.pages.dev` |
| **分支** | `master` |
| **构建命令** | (留空，静态网站) |
| **输出目录** | (留空，根目录) |
| **自动部署** | ✅ 启用（push 到 master 自动触发） |

### 访问地址

| 页面 | URL |
|------|-----|
| 首页 | https://topstrat-7mv.pages.dev/ |
| 办公室 | https://topstrat-7mv.pages.dev/office |
| 谋士堂 | https://topstrat-7mv.pages.dev/stage |
| 需求雷达 | https://topstrat-7mv.pages.dev/radar |
| 定价/锦囊 | https://topstrat-7mv.pages.dev/vault |
| 洞察 | https://topstrat-7mv.pages.dev/insights/ |
| Stage v2 | https://topstrat-7mv.pages.dev/stage-v2.html |
| Stage VoxYZ | https://topstrat-7mv.pages.dev/stage-voxyz.html |

---

## 🔑 账号与凭证

### GitHub 账号

| 项目 | 值 |
|------|-----|
| **组织名** | `guifeifurniture-lab` |
| **仓库名** | `topstrat` |
| **仓库 URL** | https://github.com/guifeifurniture-lab/topstrat |
| **访问权限** | 私有仓库（需 Collaborator 权限） |

### Cloudflare 账号

| 项目 | 值 |
|------|-----|
| **平台** | Cloudflare Pages |
| **登录方式** | GitHub OAuth |
| **项目 URL** | https://dash.cloudflare.com/?to=/:account/pages/view/topstrat |

### PayPal 集成（Vault 页面）

| 配置项 | 值 |
|--------|-----|
| **收款账号** | bjd1129@gmail.com |
| **模式** | 测试模式（沙箱） |
| **配置文件** | `website/.env.paypal` |

### 微信支付（Vault 页面）

| 配置项 | 值 |
|--------|-----|
| **收款账号** | Michael 经营账户 |
| **模式** | 扫码支付 |
| **二维码** | 待生成（占位符） |

### 支付宝（Vault 页面）

| 配置项 | 值 |
|--------|-----|
| **收款账号** | GuiFei Furn 经营账户 |
| **模式** | 扫码支付 |
| **二维码** | 待生成（占位符） |

---

## 📁 网站结构

```
website/
├── index.html              # 首页
├── office.html             # 办公室页面（实时数据）
├── stage.html              # 谋士堂（实时活动）
├── stage-v2.html           # Stage v2（改进版）
├── stage-voxyz.html        # Stage VoxYZ 风格（待删除）
├── radar.html              # 需求雷达
├── vault.html              # 定价/锦囊页面
├── server.js               # Node.js 服务器（本地测试）
├── report-status.js        # Agent 状态上报脚本
│
├── api/
│   ├── office-status.js    # Office 状态 API
│   ├── wechat-pay.js       # 微信支付 API
│   └── paypal/             # PayPal 集成
│       ├── README.md
│       ├── create-order.js
│       ├── capture-order.js
│       ├── routes.js
│       └── webhook.js
│
├── config/
│   ├── agents.json         # Agent 配置
│   └── cap-gates-production.yaml  # Cap Gates 配额配置
│
├── cron/
│   ├── update-office-status.ps1   # Office 数据更新脚本
│   ├── auto-report-activity.ps1   # Agent 活动上报脚本
│   ├── cron-config.json           # Cron 配置
│   ├── office-status-update.md    # 配置说明
│   └── SETUP_COMPLETE.md          # 配置完成报告
│
├── css/
│   └── office-animation.css  # Office 动画样式
│
├── data/
│   ├── office-state.json     # Office 实时状态
│   ├── activity-log.json     # 活动日志
│   ├── shipping-log.json     # 已发布项目
│   ├── accuracy.json         # 准确率统计
│   ├── idea-graveyard.json   # 被拒绝想法
│   ├── radar-state.json      # 雷达状态
│   └── office-layout.json    # 办公室布局
│
├── docs/
│   ├── OFFICE-REALTIME-GUIDE.md  # Office 实时数据指南
│   └── AGENT_STATUS_REPORTING.md # Agent 状态报告规范
│
├── insights/
│   ├── index.html          # 洞察列表页
│   ├── article.html        # 文章详情页
│   ├── ai-log-day9.md      # AI 日志
│   └── articles/
│       ├── deploy-ai-team.html      # 部署指南
│       ├── moushi-architecture.html # 架构文档
│       └── voxyz-analysis.html      # 竞品分析
│
├── js/
│   ├── office.js           # Office 页面逻辑
│   └── radar.js            # Radar 页面逻辑
│
├── assets/                 # 静态资源（二维码、图片等）
│
├── .env.paypal             # PayPal 环境变量
├── .env.paypal.example     # 环境变量示例
├── .gitignore              # Git 忽略配置
├── package.json            # Node.js 依赖
├── next.config.js          # Next.js 配置（未使用）
├── tailwind.config.js      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

---

## 🚀 部署流程

### 1. 本地开发

```bash
# 进入网站目录
cd C:\Users\JINDA\.openclaw\workspace-zhugeliang\website

# 本地测试（可选）
node server.js
# 访问 http://localhost:3000
```

### 2. 提交代码

```bash
# 查看变更
git status

# 添加文件
git add -A

# 提交
git commit -m "feat: 描述你的更改"

# 推送（触发自动部署）
git push origin master
```

### 3. Cloudflare Pages 自动部署

推送后，Cloudflare Pages 会自动：
1. 检测 `master` 分支新提交
2. 构建项目（静态网站，无构建步骤）
3. 部署到 `topstrat-7mv.pages.dev`
4. 部署完成（约 30-60 秒）

### 4. 验证部署

```bash
# 检查页面是否可访问
curl https://topstrat-7mv.pages.dev/
curl https://topstrat-7mv.pages.dev/office
```

---

## ⏰ 定时任务配置

### Cron 任务（待启用）

| 任务 | 频率 | 脚本 | 说明 |
|------|------|------|------|
| Office 数据更新 | 每 5 分钟 | `cron/update-office-status.ps1` | 更新 Office 状态并提交 |
| Agent 活动上报 | 每 2 分钟 | `cron/auto-report-activity.ps1` | 模拟 Agent 活动上报 |

### 启用 Cron 服务

```bash
# 1. 启用 cron 服务
openclaw cron enable

# 2. 注册任务
openclaw cron register --file website/cron/cron-config.json

# 3. 验证
openclaw cron list
```

### HEARTBEAT.md 定时任务

| 任务 | 频率 | 负责人 | 说明 |
|------|------|--------|------|
| 15 分钟心跳 | 每 15 分钟 | 全员轮值 | 简短状态汇报 |
| 30 分钟巡查 | 每 30 分钟 | 商鞅 | 检查 Agent 状态 |
| 1 小时汇报 | 每小时 | 诸葛亮 | 任务汇总报告 |
| 3 小时竞品研究 | 每 3 小时 | 张良 | VoxYZ 竞品分析 |

---

## 📊 页面风格规范

### 设计系统

**主题：** 浅色主题（Light Mode）

| 元素 | Tailwind 类 | 颜色值 |
|------|-----------|--------|
| 背景 | `bg-gray-50` | `#f9fafb` |
| 卡片背景 | `bg-white` | `#ffffff` |
| 主文字 | `text-gray-900` | `#111827` |
| 次要文字 | `text-gray-600` | `#4b5563` |
| 强调色 | `text-blue-600` | `#2563eb` |
| 成功色 | `text-green-600` | `#16a34a` |
| 边框 | `border-gray-200` | `#e5e7eb` |

### 字体

- **主要字体：** Inter (Google Fonts)
- **备用字体：** -apple-system, BlinkMacSystemFont, sans-serif

### 导航栏

- **背景：** 白色 (`bg-white`)
- **阴影：** `shadow-sm`
- **边框：** `border-b`
- **固定：** `sticky top-0`

### 卡片样式

```html
<div class="bg-white rounded-lg shadow-sm border p-4">
  <!-- 卡片内容 -->
</div>
```

### 按钮样式

**主按钮：**
```html
<button class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
  按钮文字
</button>
```

**次要按钮：**
```html
<button class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">
  按钮文字
</button>
```

---

## 🔧 本地开发环境

### 必需工具

| 工具 | 版本 | 用途 |
|------|------|------|
| Node.js | v22.22.1 | 运行脚本 |
| Git | 最新版 | 版本控制 |
| PowerShell | 7.x | 命令行 |

### 可选工具

| 工具 | 用途 |
|------|------|
| VS Code | 代码编辑 |
| GitHub Desktop | Git GUI |
| Cloudflare Dashboard | 部署管理 |

### 安装依赖

```bash
cd website
npm install
```

### 本地测试

```bash
# 启动本地服务器
node server.js

# 访问页面
# http://localhost:3000
```

---

## 📝 内容管理

### 更新 Agent 状态

编辑 `config/agents.json`：

```json
{
  "agents": [
    {
      "id": "zhugeliang",
      "name": "诸葛亮",
      "emoji": "💡",
      "role": "CEO/总指挥",
      "description": "运筹帷幄之中，决胜千里之外",
      "skills": ["战略规划", "团队协调", "决策分析"],
      "active": true
    }
  ]
}
```

### 更新定价信息

编辑 `vault.html` 中的价格卡片。

### 添加新页面

1. 创建 HTML 文件（参考现有页面结构）
2. 添加导航链接
3. 提交并推送

---

## 🐛 故障排查

### 问题 1：页面显示 404
**原因：** Cloudflare Pages 部署失败  
**解决：**
1. 检查 GitHub Actions 部署日志
2. 确认文件在根目录
3. 重新推送触发部署

### 问题 2：Office 页面显示"0 位谋士"
**原因：** API 不可用或数据文件为空  
**解决：**
```bash
# 手动更新数据
cd website
node api/office-status.js

# 检查数据文件
cat data/office-state.json
```

### 问题 3：样式不加载
**原因：** Tailwind CDN 加载失败  
**解决：**
1. 检查网络连接
2. 确认 `<script src="https://cdn.tailwindcss.com"></script>` 存在
3. 清除浏览器缓存

### 问题 4：Git 推送失败
**原因：** 网络连接问题  
**解决：**
```bash
# 检查远程仓库
git remote -v

# 重试推送
git push origin master
```

---

## 📞 联系与支持

| 角色 | 负责人 | 联系方式 |
|------|--------|----------|
| 项目所有者 | 老庄 | 飞书 |
| DevOps | 商鞅 | 飞书群 |
| 开发 | 孙膑 | 飞书群 |

---

## 📄 许可证

**版权：** © 2026 老庄  
**使用权限：** 私人项目，未经授权不得用于商业用途

---

*最后更新：2026-03-16 19:31*  
*下次审查：2026-03-23*
