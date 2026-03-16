# Office 实时数据更新机制

**创建时间：** 2026-03-17 05:23  
**负责人：** 商鞅（shangyang）

---

## 📊 问题

Office 页面（https://topstrat-7mv.pages.dev/office）没有实时显示团队状况。

**原因：**
- `data/office-state.json` 数据没有自动更新
- 需要每 5 分钟执行一次更新脚本

---

## 🔧 解决方案

### 方案 1：Cron 定时任务（推荐）

**脚本：** `api/update-office-state.js`

**执行频率：** 每 5 分钟

**配置：**
```json
{
  "schedule": "*/5 * * * *",
  "command": "node api/update-office-state.js"
}
```

### 方案 2：Agent 执行

商鞅每 30 分钟巡查时执行一次。

### 方案 3：GitHub Actions

使用 GitHub Actions 每 5 分钟触发更新。

---

## 📝 执行步骤

### 立即执行：

```bash
cd website
node api/update-office-state.js
git add data/office-state.json
git commit -m "chore: update office state"
git push origin master
```

### 自动执行（待配置）：

1. 配置 Cron 服务
2. 添加定时任务
3. 自动提交和推送

---

## 📈 数据格式

**输出文件：** `data/office-state.json`

**内容：**
```json
{
  "lastUpdated": "2026-03-17T05:23:00Z",
  "agents": [
    {
      "id": "zhugeliang",
      "name": "诸葛亮",
      "emoji": "💡",
      "role": "CEO/总指挥",
      "status": "active",
      "currentTask": "task-001",
      "lastActivity": "2026-03-17T05:23:00Z"
    }
  ],
  "activities": [...],
  "pulse": {
    "totalEvents": 100,
    "activeAgents": 7,
    "totalAgents": 11
  }
}
```

---

## 🎯 下一步

1. 立即手动执行一次
2. 配置 Cron 自动执行
3. 验证 Office 页面显示

---

*创建时间：2026-03-17 05:23*
