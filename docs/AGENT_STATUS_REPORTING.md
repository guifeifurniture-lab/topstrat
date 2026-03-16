# Agent 状态上报机制

## 概述

本机制用于追踪和记录 Agent 的实时工作状态，为 Office 页面提供真实数据源。

## 状态类型

| 状态 | 说明 | 自动判定条件 |
|------|------|-------------|
| `working` | 工作中 | 最后活动时间 < 5 分钟 |
| `coffee` | 咖啡休息 | 活动类型为 coffee |
| `idle` | 待机 | 5 分钟 ≤ 最后活动时间 < 30 分钟 |
| `offline` | 离线 | 最后活动时间 ≥ 30 分钟 |

## 活动类型

| 类型 | 说明 | 图标 |
|------|------|------|
| `working` | 执行任务 | 🔨 |
| `talking` | 讨论/发言 | 💬 |
| `coffee` | 休息 | ☕ |
| `handoff` | 任务交接 | 🔄 |

## 状态上报 API

### 上报活动

```javascript
POST /api/agent/activity
Content-Type: application/json

{
  "agentId": "zhugeliang",
  "action": "working",
  "content": "正在开发 Office 页面",
  "task": "Office 页面深度开发"
}
```

### 响应

```json
{
  "success": true,
  "activityId": "act-xxx",
  "timestamp": "2026-03-16T10:09:00Z"
}
```

## 自动状态更新

### 巡查机制

每 30 分钟自动巡查一次，更新所有 Agent 状态：

1. 读取活动日志
2. 计算每个 Agent 的最后活动时间
3. 根据时间差更新状态
4. 统计今日事件数
5. 更新 office-state.json

### 触发更新

以下情况触发立即更新：

- Agent 上报新活动
- 收到状态查询请求
- 定时任务触发（每 5 分钟）

## 数据文件

| 文件 | 说明 | 更新频率 |
|------|------|---------|
| `config/agents.json` | Agent 配置 | 手动 |
| `data/activity-log.json` | 活动日志 | 实时 |
| `data/shipping-log.json` | 发布日志 | 手动 |
| `data/accuracy.json` | 准确率数据 | 每日 |
| `data/idea-graveyard.json` | 被拒想法 | 手动 |
| `data/office-state.json` | 综合状态 | 每 5 分钟 |

## 活动日志格式

```json
{
  "id": "act-001",
  "agentId": "zhugeliang",
  "agentName": "诸葛亮",
  "action": "working",
  "content": "正在开发 Office 页面",
  "task": "Office 页面深度开发",
  "timestamp": "2026-03-16T10:09:00Z"
}
```

## Shipping Log 格式

```json
{
  "id": "ship-001",
  "title": "项目名称",
  "shippedAt": "2026-03-16T06:45:00Z",
  "contributors": ["墨子", "孙膑"],
  "deployUrl": "https://...",
  "status": "shipped",
  "confidence": "95%",
  "duration": "3d 12h 00m",
  "tags": ["website", "launch"]
}
```

## 准确率数据格式

```json
{
  "agentId": "zhugeliang",
  "agent": "诸葛亮",
  "accuracy": "96",
  "samples": 39,
  "best": "Narrative",
  "weakest": "WTP",
  "signal": "—",
  "narrative": "96% →",
  "build": "—",
  "wtp": "—"
}
```

## 实现脚本

使用 `api/office-status.js` 提供的函数：

```javascript
const officeApi = require('./api/office-status');

// 上报活动
officeApi.logActivity({
  agentId: 'zhugeliang',
  action: 'working',
  content: '...',
  task: '...'
});

// 更新状态
officeApi.updateOfficeState();

// 获取状态
const state = officeApi.getAgentStates();
```

## 注意事项

1. 活动日志保留最近 1000 条
2. Shipping Log 永久保存
3. 准确率数据 rolling 90 天窗口
4. 所有时间使用 ISO 8601 格式
5. 时区：Asia/Shanghai
