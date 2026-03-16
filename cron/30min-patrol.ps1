# 30min Patrol Script - Simplified
Write-Host "=== 30min Team Patrol ==="
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "Patrol: shangyang"

$queuePath = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\tasks\queue.json"
$reportsDir = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\reports"

if (!(Test-Path $queuePath)) {
    Write-Host "ERROR: queue.json not found"
    exit 1
}

$queue = Get-Content $queuePath -Raw | ConvertFrom-Json
$now = Get-Date

# Count tasks
$pending = $queue.pending.Count
$inProgress = $queue.inProgress.Count
$done = $queue.done.Count

Write-Host "Tasks: pending=$pending, inProgress=$inProgress, done=$done"

# Generate report
$reportTime = Get-Date -Format "yyyyMMdd-HHmm"
$reportPath = "$reportsDir\patrol-report-$reportTime.md"

if (!(Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null
}

$report = @"
# 30 分钟团队巡查报告

**时间:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**巡查人:** 商鞅 (shangyang)

---

## 任务统计

- 待处理：$pending
- 进行中：$inProgress
- 已完成：$done
- 总计：$($pending + $inProgress + $done)

---

## Agent 状态

| Agent | 状态 | 任务数 |
|-------|------|--------|
| 诸葛亮 | 待确认 | - |
| 管仲 | 待确认 | - |
| 孙膑 | 待确认 | - |
| 商鞅 | 待确认 | - |
| 萧何 | 待确认 | - |
| 张良 | 待确认 | - |
| 范蠡 | 待确认 | - |

---

## 备注

- 任务池深度：$(if ($pending -lt 20) { "不足 (需 20+)" } else { "充足" })
- 下次巡查：$(Get-Date -Format "yyyy-MM-dd HH:30:00")

---
*自动生成*
"@

$report | Set-Content $reportPath -Encoding UTF8
Write-Host "Report: $reportPath"
Write-Host "=== Patrol Complete ==="
