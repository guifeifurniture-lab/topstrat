# Office 实时数据定时更新任务

**创建时间：** 2026-03-16 19:20  
**负责人：** 商鞅（shangyang）  
**频率：** 每 5 分钟

---

## 任务说明

定时执行 Office Status API 更新数据文件，确保 Office 页面显示最新的 Agent 状态。

---

## 执行脚本

```powershell
# 文件：cron/update-office-status.ps1

# 进入网站目录
Set-Location "C:\Users\JINDA\.openclaw\workspace-zhugeliang\website"

# 执行 Office Status 更新
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 开始更新 Office 状态..."
node api/office-status.js

# 检查是否有文件变更
$changed = git diff --name-only

if ($changed) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 检测到数据变更，提交中..."
    
    # 提交变更
    git add data/activity-log.json
    git commit -m "chore: 自动更新 Office 状态数据 ($(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))"
    
    # 推送部署
    git push origin master
    
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ✓ 更新完成并推送部署"
} else {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 无数据变更，跳过提交"
}
```

---

## OpenClaw Cron 配置

在 `~/.openclaw/config/cron.json` 添加：

```json
{
  "office-status-update": {
    "schedule": "*/5 * * * *",
    "command": "powershell -ExecutionPolicy Bypass -File \"C:\\Users\\JINDA\\.openclaw\\workspace-zhugeliang\\cron\\update-office-status.ps1\"",
    "enabled": true,
    "timeout": 60,
    "log": true
  }
}
```

---

## 手动测试

```powershell
# 手动执行一次
cd C:\Users\JINDA\.openclaw\workspace-zhugeliang\website
node api/office-status.js
```

预期输出：
```
Updating office state...
Office state updated at 2026-03-16T11:20:00.000Z
Agents: 7, Activities: 10, Shipping: 5
```

---

## 监控日志

查看执行日志：
```powershell
Get-Content C:\Users\JINDA\.openclaw\logs\cron-office-status-update.log -Tail 50
```

---

## 故障排查

### 问题：node 命令找不到
**解决：** 确保 Node.js 已安装并添加到 PATH
```powershell
node --version
```

### 问题：git 提交失败
**解决：** 检查 git 配置和远程仓库连接
```powershell
git status
git remote -v
```

### 问题：数据文件为空
**解决：** 检查 activity-log.json 是否存在且有效
```powershell
Get-Content data\activity-log.json | ConvertFrom-Json
```

---

*下次执行：每 5 分钟自动执行*
