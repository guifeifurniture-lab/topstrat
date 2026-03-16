# Agent 自动激活机制

**版本：** v1.0  
**创建时间：** 2026-03-16 20:00  
**目标：** 断网重连后自动唤醒所有 Agent 并分配任务

---

## 🔄 问题场景

### 场景 1：网络中断后重连
```
网络中断
   ↓
Agent 会话断开
   ↓
所有 Agent 状态变为"待命"
   ↓
网络恢复
   ↓
❌ 问题：Agent 不会自动领取任务
```

### 场景 2：系统重启后
```
系统重启
   ↓
OpenClaw 重启
   ↓
Agent 会话丢失
   ↓
❌ 问题：需要手动启动每个 Agent
```

---

## ✅ 解决方案

### 方案 1：任务队列持久化（已实现）

**核心：** `tasks/queue.json` 作为唯一真相源

```json
{
  "pending": [...],
  "inProgress": [...],
  "done": [...],
  "autoRefill": {
    "enabled": true,
    "minTasks": 20,
    "targetTasks": 25
  }
}
```

**优势：**
- 断网后任务不丢失
- 重连后可立即读取队列
- 支持多 Agent 并发领取

---

### 方案 2：Agent 启动时自动领取任务

**脚本：** `scripts/auto-claim-task.ps1`

```powershell
# Agent 启动时自动执行
# 1. 检查任务队列
# 2. 领取分配给自己的待处理任务
# 3. 更新状态为 in_progress
# 4. 开始执行
```

**流程：**
```
Agent 启动
   ↓
读取 tasks/queue.json
   ↓
查找 assignedTo=自己的 pending 任务
   ↓
更新状态为 in_progress
   ↓
开始执行任务
```

---

### 方案 3：Cron 定时检查 + 自动派发

**脚本：** `cron/auto-dispatch.ps1`

```powershell
# 每 5 分钟执行一次
# 1. 检查任务队列深度
# 2. 如果 < 20 个，自动创建新任务
# 3. 检查空闲 Agent
# 4. 自动派发任务给空闲 Agent
```

**逻辑：**
```
检查队列深度
   ↓
[< 20 个] → 创建新任务
   ↓
检查空闲 Agent
   ↓
[有待办任务] → 自动派发
   ↓
记录日志
```

---

### 方案 4：心跳检测 + 自动唤醒

**脚本：** `cron/heartbeat-check.ps1`

```powershell
# 每 15 分钟执行一次
# 1. 检查每个 Agent 最后活动时间
# 2. 如果超过 30 分钟无活动 → 标记为 idle
# 3. 如果有 pending 任务 → 发送唤醒通知
```

**唤醒方式：**
- OpenClaw sessions_send
- 飞书消息通知
- 邮件通知

---

## 🔧 实现脚本

### auto-claim-task.ps1（Agent 启动脚本）

```powershell
# 文件：scripts/auto-claim-task.ps1
param(
    [string]$agentId
)

$queuePath = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\tasks\queue.json"
$queue = Get-Content $queuePath -Raw | ConvertFrom-Json

# 查找分配给此 Agent 的待处理任务
$myTasks = $queue.pending | Where-Object { $_.assignedTo -eq $agentId }

if ($myTasks.Count -eq 0) {
    Write-Host "[$agentId] 没有待处理任务"
    exit 0
}

# 领取优先级最高的任务
$task = $myTasks | Sort-Object priority | Select-Object -First 1

# 更新任务状态
$task.status = "in_progress"
$task.startedAt = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')

# 保存队列
$queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath -Encoding UTF8

Write-Host "[$agentId] 已领取任务：$($task.id) - $($task.title)"

# 执行任务（根据任务类型调用不同脚本）
& ".\scripts\execute-task.ps1" -taskId $task.id
```

---

### auto-dispatch.ps1（自动派发脚本）

```powershell
# 文件：cron/auto-dispatch.ps1

$queuePath = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\tasks\queue.json"
$queue = Get-Content $queuePath -Raw | ConvertFrom-Json

Write-Host "=== 自动任务派发 ==="
Write-Host "时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 1. 检查队列深度
$pendingCount = $queue.pending.Count
Write-Host "当前待处理任务：$pendingCount"

if ($pendingCount -lt 20) {
    Write-Host "⚠️ 任务数量不足，需要补充"
    # 调用任务创建脚本
    & ".\scripts\create-tasks.ps1" -count (25 - $pendingCount)
}

# 2. 检查空闲 Agent
$agents = @("guanzhong", "sunbin", "shangyang", "xiaohe", "zhangliang", "fanli")
foreach ($agent in $agents) {
    # 检查 Agent 是否有进行中任务
    $inProgress = $queue.inProgress | Where-Object { $_.assignedTo -eq $agent }
    
    if ($inProgress.Count -eq 0) {
        Write-Host "[$agent] 空闲，检查是否有待办任务"
        
        # 查找此 Agent 的待处理任务
        $pendingTasks = $queue.pending | Where-Object { $_.assignedTo -eq $agent }
        
        if ($pendingTasks.Count -gt 0) {
            Write-Host "[$agent] 有 $($pendingTasks.Count) 个待办任务，发送唤醒通知"
            # 发送 sessions_send 或飞书通知
        }
    }
}

Write-Host "=== 派发完成 ==="
```

---

## 📊 状态恢复流程

### 断网重连后的恢复

```
1. 网络恢复
   ↓
2. OpenClaw 自动重连
   ↓
3. 读取 tasks/queue.json
   ↓
4. 检查任务状态：
   - in_progress 超过 30 分钟无更新 → 重置为 pending
   - pending 任务 → 等待领取
   ↓
5. 各 Agent 执行 auto-claim-task.ps1
   ↓
6. 领取任务并继续执行
```

---

## 🎯 最佳实践

### 1. 任务状态超时重置

```json
{
  "timeoutReset": {
    "enabled": true,
    "inProgressTimeout": 1800,
    "reviewTimeout": 3600
  }
}
```

**逻辑：**
- in_progress 超过 30 分钟无更新 → 重置为 pending
- review 超过 1 小时无处理 → 自动升级

### 2. 任务自动补充

```json
{
  "autoRefill": {
    "enabled": true,
    "minTasks": 20,
    "targetTasks": 25,
    "categories": ["功能开发", "测试验证", "代码审查", "运维优化"]
  }
}
```

### 3. Agent 活动日志

```json
{
  "agentActivity": {
    "zhugeliang": {
      "lastActive": "2026-03-16T20:00:00Z",
      "status": "active"
    }
  }
}
```

---

## 📝 配置文件

### agent-config.json

```json
{
  "agents": {
    "zhugeliang": {
      "autoClaim": true,
      "maxConcurrentTasks": 3,
      "notifyOnAssign": true
    },
    "guanzhong": {
      "autoClaim": true,
      "maxConcurrentTasks": 2,
      "notifyOnAssign": true
    }
  }
}
```

---

*最后更新：2026-03-16 20:00*
