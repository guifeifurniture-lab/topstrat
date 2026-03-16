# Office 实时数据定时任务 - 配置完成报告

**配置时间：** 2026-03-16 19:24  
**配置人：** 诸葛亮（zhugeliang）  
**状态：** ✅ 已完成

---

## 📊 配置摘要

### 定时任务清单
| 任务名 | 频率 | 说明 | 状态 |
|--------|------|------|------|
| `office-status-update` | 每 5 分钟 | 更新 Office 状态数据并提交部署 | ✅ 就绪 |
| `agent-activity-report` | 每 2 分钟 | Agent 活动状态上报 | ✅ 就绪 |

---

## 📁 已创建文件

### 1. PowerShell 脚本
- **`cron/update-office-status.ps1`**
  - 执行 Office Status API 更新
  - 检测数据变更并自动 git 提交
  - 推送到 GitHub 触发 Cloudflare Pages 部署

- **`cron/auto-report-activity.ps1`**
  - 简化版：每 2 分钟调用一次 API 更新
  - 保持 Office 数据活跃

### 2. 配置文件
- **`cron/cron-config.json`**
  - OpenClaw cron 任务配置
  - 包含 3 个定时任务定义
  - 时区：Asia/Shanghai

### 3. 文档
- **`cron/office-status-update.md`**
  - 完整的配置说明
  - 故障排查指南
  - 监控日志方法

---

## 🚀 启用步骤

### 方法 1：OpenClaw CLI（推荐）
```bash
# 1. 查看 cron 状态
openclaw cron status

# 2. 启用 cron 服务
openclaw cron enable

# 3. 注册任务配置
openclaw cron register --file website/cron/cron-config.json

# 4. 查看任务列表
openclaw cron list

# 5. 手动测试一次
openclaw cron run office-status-update
```

### 方法 2：手动配置
编辑 `~/.openclaw/config.json`：
```json
{
  "cron": {
    "enabled": true,
    "tasks": {
      "office-status-update": {
        "schedule": "*/5 * * * *",
        "command": "powershell -ExecutionPolicy Bypass -File \"C:\\Users\\JINDA\\.openclaw\\workspace-zhugeliang\\website\\cron\\update-office-status.ps1\"",
        "cwd": "C:\\Users\\JINDA\\.openclaw\\workspace-zhugeliang\\website",
        "timeout": 60,
        "log": true
      }
    }
  }
}
```

---

## 📈 预期效果

### Office 页面数据流
```
每 2 分钟 ─┬─> auto-report-activity.ps1
           └─> 更新 activity-log.json
                    ↓
           每 5 分钟 ─┬─> update-office-status.ps1
                      └─> 执行 api/office-status.js
                               ↓
                      生成 office-state.json
                               ↓
                      git commit + push
                               ↓
                      Cloudflare Pages 自动部署
                               ↓
                      Office 页面显示最新数据
```

### 日志输出示例
```
========================================
Office Status Update - 2026-03-16 19:25:00
========================================
[INFO] 当前目录：C:\Users\JINDA\.openclaw\workspace-zhugeliang\website
[INFO] 开始更新 Office 状态数据...
Updating office state...
Office state updated at 2026-03-16T11:25:00.000Z
Agents: 8, Activities: 12, Shipping: 5
[INFO] 检测到数据变更：
data/activity-log.json
data/office-state.json
[INFO] 提交变更...
[INFO] 推送到 GitHub 触发部署...
[SUCCESS] ✓ 更新完成并推送部署
========================================
下次执行：5 分钟后
========================================
```

---

## 🧪 验证方法

### 1. 手动执行测试
```powershell
# 执行一次更新
cd C:\Users\JINDA\.openclaw\workspace-zhugeliang\website\cron
powershell -ExecutionPolicy Bypass -File update-office-status.ps1
```

### 2. 检查数据文件
```powershell
# 查看最新状态
Get-Content ..\data\office-state.json | ConvertFrom-Json | Select-Object lastUpdated, agents

# 查看活动日志
Get-Content ..\data\activity-log.json | ConvertFrom-Json | Select-Object -First 5
```

### 3. 查看部署状态
访问：https://topstrat-7mv.pages.dev/office.html

### 4. 查看 Git 提交历史
```bash
cd C:\Users\JINDA\.openclaw\workspace-zhugeliang\website
git log --oneline -10
```

预期看到类似：
```
2c619e0 feat: 添加 cron 定时任务配置 (Office 自动更新)
ddbc55d feat: Office 实时数据定时任务 - 配置完成报告
...
```

---

## 🔧 故障排查

### 问题 1：Cron 服务未运行
**症状：** 定时任务不执行  
**解决：**
```bash
# 检查状态
openclaw cron status

# 重启服务
openclaw cron restart
```

### 问题 2：PowerShell 权限错误
**症状：** `ExecutionPolicy Bypass` 无效  
**解决：**
```powershell
# 检查当前策略
Get-ExecutionPolicy -List

# 临时允许当前会话
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### 问题 3：Git 提交失败
**症状：** `git commit` 报错  
**解决：**
```bash
# 配置 git 用户
git config --global user.name "OpenClaw Cron Bot"
git config --global user.email "cron@topstrat.pages.dev"

# 检查远程仓库
git remote -v
```

### 问题 4：数据文件为空
**症状：** office-state.json 无数据  
**解决：**
```bash
# 手动执行一次 API
cd website
node api/office-status.js
```

---

## 📝 监控与维护

### 查看日志
```powershell
# OpenClaw 日志
Get-Content C:\Users\JINDA\.openclaw\logs\cron-*.log -Tail 50

# 或使用 CLI
openclaw cron logs office-status-update --tail 50
```

### 监控指标
- **更新频率：** 每 5 分钟至少 1 次成功更新
- **数据延迟：** < 10 分钟（2 次更新周期）
- **部署状态：** Cloudflare Pages 显示 "Ready"

### 定期维护
- **每周：** 检查日志是否有错误
- **每月：** 清理 activity-log.json（保留最近 1000 条）
- **按需：** 调整更新频率（修改 cron 配置）

---

## 🎯 下一步优化

### 短期（本周）
- [ ] 验证 cron 服务正常运行
- [ ] 监控 24 小时更新日志
- [ ] 调整更新频率（如需要）

### 中期（本月）
- [ ] 添加告警机制（更新失败时通知）
- [ ] 实现 Agent 真实状态上报（非模拟）
- [ ] 优化数据文件大小

### 长期（下季度）
- [ ] 迁移到 Cloudflare Workers（真正实时）
- [ ] 添加数据持久化（数据库）
- [ ] 实现历史数据查询 API

---

## 📞 支持

**负责人：** 商鞅（shangyang）- DevOps  
**联系方式：** 飞书群「谋士天团」  
**文档位置：** `website/cron/office-status-update.md`

---

*配置完成时间：2026-03-16 19:24*  
*下次自动更新：5 分钟后*  
*状态：✅ 就绪，等待启用*
