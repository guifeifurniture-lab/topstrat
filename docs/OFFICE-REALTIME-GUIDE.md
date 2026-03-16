# Office 实时数据系统 - 使用指南

**版本：** v1.0  
**更新时间：** 2026-03-16 19:15  
**负责人：** 孙膑（sunbin）

---

## 📊 系统架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Agent     │────▶│  Server.js   │────▶│   Office    │
│  上报状态    │     │  API + WS    │     │   页面显示   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  数据文件     │
                    │  (JSON)      │
                    └──────────────┘
```

---

## 🚀 快速开始

### 1. 启动服务器

```bash
cd website
node server.js
```

服务器将在 `http://localhost:3000` 启动，提供：
- 静态文件服务（HTML/CSS/JS）
- API 端点（`/api/office/*`）
- WebSocket 连接（`/ws/office`）

### 2. 访问 Office 页面

打开浏览器访问：`http://localhost:3000/office.html`

### 3. Agent 上报状态

各 Agent 通过脚本上报自己的状态：

```bash
# 基本用法
node report-status.js <agentId> <agentName> <action> [content] [task]

# 示例
node report-status.js zhugeliang 诸葛亮 working "派发任务" "任务协调"
node report-status.js sunbin 孙膑 working "修复 Bug" "前端开发"
node report-status.js guanzhong 管仲 coffee "休息" ""
```

---

## 📡 API 端点

### 获取完整状态
```bash
GET /api/office/state
```

返回完整的 Office 状态（兼容旧的 office-state.json 格式）

### 获取 Agent 状态
```bash
GET /api/office/agents
```

返回所有 Agent 的实时状态列表

### 获取活动流
```bash
GET /api/office/activity?limit=20
```

返回最近的活动记录（默认 20 条）

### 获取 Shipping Log
```bash
GET /api/office/shipping
```

返回已发布项目列表

### 获取准确率排行榜
```bash
GET /api/office/accuracy
```

返回 Agent 准确率排行榜

### 获取 Pulse 指标
```bash
GET /api/office/pulse
```

返回团队健康指标（总事件数、活跃 Agent 数等）

### 获取 Idea Graveyard
```bash
GET /api/office/graveyard
```

返回被拒绝的想法列表

### 上报 Agent 状态
```bash
POST /api/office/report
Content-Type: application/json

{
  "agentId": "zhugeliang",
  "agentName": "诸葛亮",
  "action": "working",
  "content": "派发任务",
  "task": "任务协调"
}
```

---

## 🔧 Agent 状态上报集成

### 在 Agent 代码中上报

```javascript
const http = require('http');

function reportStatus(agentId, agentName, action, content, task) {
  const data = JSON.stringify({
    agentId,
    agentName,
    action,
    content,
    task
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/office/report',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`✓ 状态已上报 (${agentName} - ${action})`);
  });
  
  req.on('error', (error) => {
    console.error(`✗ 上报失败：${error.message}`);
  });
  
  req.write(data);
  req.end();
}

// 使用示例
reportStatus('zhugeliang', '诸葛亮', 'working', '派发任务', '任务协调');
```

### 使用命令行脚本

```bash
# 工作开始
node report-status.js zhugeliang 诸葛亮 working "开始任务派发" "任务协调"

# 任务交接
node report-status.js zhugeliang 诸葛亮 handoff "将任务移交给孙膑" "任务协调"

# 休息
node report-status.js guanzhong 管仲 coffee "短暂休息" ""

# 会议
node report-status.js sunbin 孙膑 meeting "团队站会" "每日同步"
```

---

## 📊 数据文件说明

### activity-log.json
记录所有 Agent 的活动历史

```json
[
  {
    "id": "act_1710586200000",
    "agentId": "zhugeliang",
    "agentName": "诸葛亮",
    "action": "working",
    "content": "派发任务",
    "task": "任务协调",
    "timestamp": "2026-03-16T11:00:00Z"
  }
]
```

**action 类型：**
- `working` - 工作中
- `talking` - 沟通中
- `coffee` - 休息中
- `handoff` - 任务交接
- `meeting` - 会议中

### shipping-log.json
记录已发布的项目

### accuracy.json
Agent 准确率统计数据

### idea-graveyard.json
被拒绝的想法列表

---

## 🔄 自动更新机制

### 服务器端
- **每 30 秒** 自动更新 Office 状态
- 通过 WebSocket 广播给所有连接的客户端

### 客户端（Office 页面）
- **每 5 秒** 轮询 API 获取最新数据
- 如果 WebSocket 可用，使用 WebSocket 接收实时更新
- 检测到数据变化时自动刷新显示

---

## 🌐 生产环境部署

### Cloudflare Pages 部署

Cloudflare Pages 是静态网站托管，不支持 Node.js 服务器。需要：

**方案 1：使用 Cloudflare Workers**
- 将 API 逻辑迁移到 Cloudflare Workers
- 使用 Workers KV 存储数据
- 优点：无服务器，自动扩展
- 缺点：需要重写 API 逻辑

**方案 2：使用外部后端**
- 在 VPS/云平台上部署 Node.js 服务器
- Office 页面通过 API 调用后端
- 优点：完整功能，易于维护
- 缺点：需要额外服务器

**方案 3：静态网站 + 定时任务**
- 使用 cron 定时运行 `node api/office-status.js` 更新数据文件
- 各 Agent 通过 webhook 上报状态
- 优点：简单，成本低
- 缺点：实时性较差（依赖 cron 频率）

### 推荐方案

对于谋士天团，推荐**方案 3**（静态网站 + 定时任务）：

1. 在 OpenClaw 中创建定时任务（每 5 分钟）
2. 任务执行：`node website/api/office-status.js`
3. Agent 通过 OpenClaw sessions_send 上报状态
4. 数据自动写入 JSON 文件
5. Cloudflare Pages 自动部署更新

---

## 📈 监控与告警

### 健康检查端点
```bash
GET /api/office/pulse
```

检查团队活动状态

### 告警指标
- **Agent 离线：** 超过 30 分钟无活动
- **活动量异常：** 小时活动量 < 10 或 > 500
- **数据更新失败：** 状态文件超过 10 分钟未更新

---

## 🧪 测试

### 测试 API
```bash
# 获取 Agent 状态
curl http://localhost:3000/api/office/agents

# 获取活动流
curl http://localhost:3000/api/office/activity?limit=5

# 上报状态
curl -X POST http://localhost:3000/api/office/report \
  -H "Content-Type: application/json" \
  -d '{"agentId":"test","agentName":"测试","action":"working","content":"测试","task":"测试"}'
```

### 测试 WebSocket
```javascript
const ws = new WebSocket('ws://localhost:3000/ws/office');
ws.onmessage = (event) => {
  console.log('收到更新:', JSON.parse(event.data));
};
```

---

## 📝 故障排查

### 问题：Office 页面显示"0 位谋士"
**原因：** 数据文件为空或 API 未响应  
**解决：**
1. 检查 server.js 是否运行
2. 检查数据文件是否存在且有效 JSON
3. 运行 `node api/office-status.js` 手动更新状态

### 问题：状态上报失败
**原因：** 服务器未启动或端口被占用  
**解决：**
1. 确认 server.js 正在运行
2. 检查端口 3000 是否被占用
3. 检查防火墙设置

### 问题：数据不更新
**原因：** 定时任务未执行或 Agent 未上报  
**解决：**
1. 检查 cron 任务是否配置
2. 手动运行一次上报脚本测试
3. 检查 activity-log.json 是否有新记录

---

## 🎯 下一步优化

- [ ] 实现 Cloudflare Workers 版本 API
- [ ] 添加 Agent 状态持久化（数据库）
- [ ] 实现历史数据查询 API
- [ ] 添加更多可视化图表
- [ ] 实现移动端适配

---

*文档维护：孙膑（sunbin）*  
*最后更新：2026-03-16 19:15*
