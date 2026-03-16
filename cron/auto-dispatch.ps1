# 自动任务派发脚本
# 频率：每 5 分钟
# 用途：检查任务队列深度，自动补充任务，唤醒空闲 Agent

Write-Host "=== 自动任务派发 ==="
Write-Host "时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

$queuePath = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\tasks\queue.json"

if (!(Test-Path $queuePath)) {
    Write-Host "❌ 任务队列文件不存在"
    exit 1
}

$queue = Get-Content $queuePath -Raw | ConvertFrom-Json

# 1. 检查队列深度
$pendingCount = $queue.pending.Count
Write-Host "当前待处理任务：$pendingCount"

if ($pendingCount -lt 20) {
    Write-Host "⚠️ 任务数量不足 (<20)，需要补充"
    $queue.lastUpdated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')
    $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath -Encoding UTF8
    Write-Host "✓ 已标记需要补充任务"
} else {
    Write-Host "✓ 任务数量充足"
}

# 2. 检查超时任务（in_progress 超过 30 分钟无更新）
$now = Get-Date
foreach ($task in $queue.inProgress) {
    if ($task.startedAt) {
        $started = [DateTime]::Parse($task.startedAt)
        $elapsed = ($now - $started).TotalMinutes
        
        if ($elapsed -gt 30) {
            Write-Host "⚠️ 任务 $($task.id) 超时 ($elapsed 分钟)，重置为 pending"
            $task.status = "pending"
            $task.startedAt = $null
        }
    }
}

# 3. 保存更新
$queue.lastUpdated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')
$queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath -Encoding UTF8

# 4. 检查空闲 Agent
$agents = @("guanzhong", "sunbin", "shangyang", "xiaohe", "zhangliang", "fanli")
Write-Host ""
Write-Host "检查 Agent 状态..."

foreach ($agent in $agents) {
    $inProgress = $queue.inProgress | Where-Object { $_.assignedTo -eq $agent }
    $pendingForAgent = $queue.pending | Where-Object { $_.assignedTo -eq $agent }
    
    if ($inProgress.Count -eq 0) {
        if ($pendingForAgent.Count -gt 0) {
            Write-Host "[$agent] 空闲，有 $($pendingForAgent.Count) 个待办任务 ⚠️"
            # 这里可以添加 sessions_send 或飞书通知
        } else {
            Write-Host "[$agent] 空闲，无待办任务"
        }
    } else {
        Write-Host "[$agent] 忙碌，$($inProgress.Count) 个进行中任务"
    }
}

Write-Host ""
Write-Host "=== 派发完成 ==="
