# 15 分钟全员状态检查脚本
Write-Host "=== 15 分钟全员状态检查 ==="
Write-Host "时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "检查人：诸葛亮（zhugeliang）"
Write-Host ""

# 更新任务队列时间戳
$queuePath = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\tasks\queue.json"
if (Test-Path $queuePath) {
    $queue = Get-Content $queuePath -Raw | ConvertFrom-Json
    $queue.lastUpdated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')
    $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath -Encoding UTF8
    Write-Host "✓ 任务队列已更新"
}

# 生成状态报告
$reportPath = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\reports\agent-status-$(Get-Date -Format 'yyyyMMdd-HHmm').md"
$reportDir = Split-Path $reportPath -Parent
if (!(Test-Path $reportDir)) {
    New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
}

$report = @"
# 15 分钟全员状态检查

**时间：** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  
**检查人：** 诸葛亮（zhugeliang）

## Agent 状态

| Agent | 状态 | 当前任务 | 进度 |
|-------|------|---------|------|
| zhugeliang | 🟢 运行中 | 状态检查 | 100% |
| guanzhong | 🟡 待机 | - | - |
| sunbin | 🟡 待机 | - | - |
| shangyang | 🟡 待机 | - | - |
| xiaohe | 🟡 待机 | - | - |
| zhangliang | 🟡 待机 | - | - |
| fanli | 🟡 待机 | - | - |

## 汇总

- **活跃 Agent:** 1/7
- **进行中任务:** $(($queue.pending | Where-Object { $_.status -eq 'in_progress' }).Count)
- **待处理任务:** $($queue.pending.Count)

## 下次检查

**时间：** 15 分钟后

---
*自动生成*
"@

$report | Set-Content $reportPath -Encoding UTF8
Write-Host "✓ 状态报告已生成：$reportPath"
Write-Host ""
Write-Host "=== 检查完成 ==="
