# Office 实时数据定时更新脚本
# 频率：每 5 分钟
# 用途：更新 Office 状态数据并自动推送部署

Write-Host "========================================"
Write-Host "Office Status Update - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "========================================"

# 进入网站目录
$websiteDir = "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website"
Set-Location $websiteDir

Write-Host "[INFO] 当前目录：$(Get-Location)"

# 执行 Office Status 更新
Write-Host "[INFO] 开始更新 Office 状态数据..."
try {
    $output = node api/office-status.js 2>&1
    Write-Host $output
} catch {
    Write-Host "[ERROR] 更新失败：$_" -ForegroundColor Red
    exit 1
}

# 检查是否有文件变更
Write-Host "[INFO] 检查文件变更..."
$changed = git diff --name-only

if ($changed) {
    Write-Host "[INFO] 检测到数据变更："
    Write-Host $changed
    
    # 配置 git 用户信息（如果未配置）
    $gitUser = git config user.name
    if (-not $gitUser) {
        Write-Host "[INFO] 配置 git 用户信息..."
        git config user.name "OpenClaw Cron Bot"
        git config user.email "cron@topstrat.pages.dev"
    }
    
    # 提交变更
    Write-Host "[INFO] 提交变更..."
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git add data/activity-log.json data/office-state.json 2>$null
    git commit -m "chore: 自动更新 Office 状态数据 ($timestamp)"
    
    if ($LASTEXITCODE -eq 0) {
        # 推送部署
        Write-Host "[INFO] 推送到 GitHub 触发部署..."
        git push origin master
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] ✓ 更新完成并推送部署" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] ⚠ 推送失败，请检查网络连接" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[WARNING] ⚠ 提交失败，可能没有实际变更" -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] 无数据变更，跳过提交" -ForegroundColor Cyan
}

Write-Host "========================================"
Write-Host "下次执行：5 分钟后"
Write-Host "========================================"
