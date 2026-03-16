# Agent 自动检查 inbox 机制

**创建时间：** 2026-03-17 05:44  
**负责人：** 诸葛亮（zhugeliang）

---

## 📋 机制说明

每个 Agent 需要每 5 分钟检查自己的 inbox，领取新任务。

---

## 🔧 配置方式

### 方式 1：HEARTBEAT.md 配置

在每个 Agent 的 `workspace-{agentId}/HEARTBEAT.md` 中添加：

```markdown
## 任务检查

每 5 分钟：
1. 检查 `inbox/{agentId}/` 目录
2. 读取新任务通知（*.md 文件）
3. 如果有新任务：
   - 读取任务详情
   - 更新 `tasks/queue.json` 状态为 inProgress
   - 更新 `sessions/{agentId}.session`
   - 开始执行任务
4. 向诸葛亮汇报（如有需要）
```

### 方式 2：检查脚本

创建 `workspace-{agentId}/check-inbox.js`：

```javascript
const fs = require('fs');
const path = require('path');

const AGENT_ID = 'sunbin'; // 替换为实际 Agent ID
const INBOX_DIR = path.join(__dirname, 'inbox', AGENT_ID);
const TASKS_FILE = path.join(__dirname, 'tasks', 'queue.json');
const SESSION_FILE = path.join(__dirname, 'sessions', `${AGENT_ID}.session`);

// 检查 inbox
function checkInbox() {
  if (!fs.existsSync(INBOX_DIR)) {
    console.log(`[${new Date().toISOString()}] Inbox not found`);
    return;
  }

  const tasks = fs.readdirSync(INBOX_DIR).filter(f => f.endsWith('.md'));
  
  if (tasks.length > 0) {
    console.log(`[${new Date().toISOString()}] Found ${tasks.length} tasks`);
    
    // 读取第一个任务
    const taskFile = tasks[0];
    const taskContent = fs.readFileSync(path.join(INBOX_DIR, taskFile), 'utf8');
    
    // 提取任务 ID
    const taskIdMatch = taskContent.match(/\*\*任务 ID：\*\*\s*(\S+)/);
    const taskId = taskIdMatch ? taskIdMatch[1] : taskFile.replace('.md', '');
    
    // 更新任务队列
    updateTaskStatus(taskId);
    
    // 更新会话
    updateSession(taskId);
    
    console.log(`[${new Date().toISOString()}] Task ${taskId} claimed`);
  }
}

// 更新任务状态
function updateTaskStatus(taskId) {
  if (!fs.existsSync(TASKS_FILE)) return;
  
  const queue = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
  const task = queue.pending.find(t => t.id === taskId);
  
  if (task) {
    task.status = 'inProgress';
    task.startedAt = new Date().toISOString();
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(queue, null, 2), 'utf8');
  }
}

// 更新会话
function updateSession(taskId) {
  const session = {
    agentId: AGENT_ID,
    status: 'busy',
    currentTask: taskId,
    lastHeartbeat: new Date().toISOString()
  };
  
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2), 'utf8');
}

// 每 5 分钟检查一次
setInterval(checkInbox, 5 * 60 * 1000);

// 立即执行一次
checkInbox();
```

---

## 📝 立即执行

### 为每个 Agent 配置 HEARTBEAT.md

**已更新 HEARTBEAT.md 的 Agent：**
- [x] 管仲
- [x] 孙膑
- [x] 郭嘉
- [x] 墨子
- [x] 萧何
- [x] 张良
- [x] 范蠡
- [x] 韩信
- [x] 陈平
- [x] 商鞅

---

## 🎯 验证方式

1. 检查 sessions 文件是否更新
2. 检查 tasks/queue.json 状态是否变更
3. 检查 inbox/zhugeliang/ 是否有汇报

---

*创建时间：2026-03-17 05:44*  
*下次检查：每 5 分钟自动执行*
