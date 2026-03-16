# Office 实时数据自动更新机制

**创建时间：** 2026-03-17 05:28  
**负责人：** 商鞅（shangyang）  
**监督人：** 诸葛亮（zhugeliang）

---

## 📊 问题

Office 页面需要实时显示团队状况，但当前数据不会自动更新。

---

## 🎯 目标

- **更新频率：** 每 5 分钟自动更新
- **数据文件：** `data/office-state.json`
- **自动部署：** 更新后自动推送到 Cloudflare Pages

---

## 🔧 解决方案

### 方案 1：OpenClaw Cron 服务（推荐）

**配置位置：** `~/.openclaw/config.json` 或工作区 `cron/cron-config.json`

**配置内容：**
```json
{
  "tasks": {
    "office-state-update": {
      "name": "Office 状态更新",
      "description": "每 5 分钟更新 Office 页面团队状态数据",
      "schedule": "*/5 * * * *",
      "command": "node website/api/update-office-state.js",
      "cwd": "C:\\Users\\JINDA\\.openclaw\\workspace-zhugeliang",
      "enabled": true,
      "timeout": 60,
      "log": true
    }
  }
}
```

**优点：**
- 与 OpenClaw 深度集成
- 可追踪执行日志
- 可与其他 Agent 任务协调

**缺点：**
- 需要配置 Cron 服务

---

### 方案 2：GitHub Actions（推荐用于部署）

**配置位置：** `.github/workflows/office-update.yml`

**配置内容：**
```yaml
name: Office State Update

on:
  schedule:
    - cron: '*/5 * * * *'  # 每 5 分钟
  workflow_dispatch:       # 允许手动触发

jobs:
  update-office-state:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Generate office state
        run: |
          cd website
          node api/update-office-state.js

      - name: Commit and push if changed
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add website/data/office-state.json
          git diff --staged --quiet || git commit -m "chore: update office state $(date -u)"
          git push
```

**优点：**
- 无需本地服务
- 自动触发部署
- 有执行历史记录

**缺点：**
- 依赖 GitHub Actions 配额
- 可能有 1-2 分钟延迟

---

### 方案 3：Windows 任务计划程序

**配置方式：**
1. 打开"任务计划程序"
2. 创建基本任务
3. 配置触发器：每 5 分钟
4. 配置操作：
   - 程序：`node.exe`
   - 参数：`C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\api\update-office-state.js`
   - 起始于：`C:\Users\JINDA\.openclaw\workspace-zhugeliang\website`

**优点：**
- 系统级支持
- 稳定可靠

**缺点：**
- 配置复杂
- 需要手动提交 Git

---

### 方案 4：Agent 执行（商鞅）

**配置位置：** `workspace-shangyang/HEARTBEAT.md`

**配置内容：**
```markdown
## 定时任务

每 30 分钟巡查时执行：
1. node website/api/update-office-state.js
2. git add website/data/office-state.json
3. git commit -m "chore: update office state"
4. git push origin master
```

**优点：**
- 与 Agent 工作流集成
- 有 Agent 监督

**缺点：**
- 频率较低（30 分钟）
- 依赖 Agent 执行

---

## 🎯 推荐方案

**组合方案：**

1. **GitHub Actions** - 每 5 分钟自动更新 + 部署
2. **商鞅巡查** - 每 30 分钟验证执行
3. **手动触发** - 需要时立即更新

---

## 📝 立即执行

### 步骤 1：创建 GitHub Actions 工作流

**文件：** `.github/workflows/office-update.yml`

### 步骤 2：测试工作流

```bash
# 手动触发测试
gh workflow run office-update.yml
```

### 步骤 3：验证更新

访问 https://topstrat-7mv.pages.dev/office 查看数据

---

## 📈 监控指标

| 指标 | 目标 | 监控方式 |
|------|------|---------|
| 更新频率 | 每 5 分钟 | GitHub Actions 日志 |
| 数据准确性 | 100% | 人工抽查 |
| 部署成功率 | >99% | Cloudflare 部署日志 |
| 页面加载时间 | <3 秒 | Lighthouse |

---

## 🚨 故障处理

### 问题 1：数据未更新

**检查：**
1. GitHub Actions 是否执行
2. 脚本是否有错误
3. Git push 是否成功

**解决：**
```bash
# 手动执行一次
cd website
node api/update-office-state.js
git add data/office-state.json
git commit -m "fix: manual office state update"
git push origin master
```

### 问题 2：页面显示旧数据

**检查：**
1. Cloudflare 部署状态
2. 浏览器缓存

**解决：**
- 强制刷新（Ctrl+F5）
- 清除浏览器缓存
- 检查 Cloudflare 部署日志

---

## 🎯 下一步

1. 创建 GitHub Actions 工作流
2. 测试自动更新
3. 配置监控告警
4. 文档化操作流程

---

*创建时间：2026-03-17 05:28*  
*下次审查：2026-03-24*
