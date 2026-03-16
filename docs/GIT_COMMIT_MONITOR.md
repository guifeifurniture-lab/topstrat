# Git 提交监控配置

**创建时间：** 2026-03-17 05:48  
**负责人：** 商鞅（shangyang）

---

## 📋 监控目标

确保每个 Agent 的每一步进展都有 Git 提交记录。

---

## 🔧 监控配置

### 方式 1：GitHub Actions 自动监控

**文件：** `.github/workflows/git-monitor.yml`

```yaml
name: Git Commit Monitor

on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Analyze commits
        run: |
          echo "=== 最近 10 次提交 ==="
          git log --oneline -10
          
          echo "=== 按 Agent 统计 ==="
          git log --author="zhugeliang" --oneline | wc -l
          git log --author="shangyang" --oneline | wc -l
          # ... 其他 Agent
          
      - name: Generate report
        run: |
          echo "# Git 提交报告" > reports/git-commit-report.md
          echo "生成时间：$(date)" >> reports/git-commit-report.md
          echo "" >> reports/git-commit-report.md
          echo "## 最近提交" >> reports/git-commit-report.md
          git log --oneline -20 >> reports/git-commit-report.md
```

---

### 方式 2：本地监控脚本

**文件：** `scripts/monitor-commits.ps1`

```powershell
# 每 30 分钟检查一次 Git 提交
while ($true) {
    Write-Host "=== Git 提交检查 $(Get-Date) ==="
    
    # 最近 10 次提交
    git log --oneline -10
    
    # 按作者统计
    $authors = @("zhugeliang", "shangyang", "sunbin", "guojia", "mozi", "xiaohe", "zhangliang", "fanli", "hanxin", "chenping", "guanzhong")
    foreach ($author in $authors) {
        $count = git log --author=$author --oneline | Measure-Object | Select-Object -ExpandProperty Count
        Write-Host "$author : $count 次提交"
    }
    
    Start-Sleep -Seconds 1800 # 30 分钟
}
```

---

### 方式 3：提交前钩子

**文件：** `.git/hooks/pre-commit`

```bash
#!/bin/bash

# 检查提交信息是否包含任务 ID
if ! grep -qE "(task-[0-9]+|patrol-[0-9]+|growth-[0-9]+|success-[0-9]+|intel-[0-9]+)" .git/COMMIT_EDITMSG; then
    echo "❌ 提交信息必须包含任务 ID"
    echo "示例：feat: 完成任务 SU-002（Cap Gates 核心逻辑）"
    exit 1
fi

# 检查是否有产出物
echo "✅ 提交信息格式正确"
```

---

## 📊 提交规范

**格式：**
```
<类型>: 完成任务 <任务 ID>（任务描述）

详细说明（可选）

产出物：
- 文件 1
- 文件 2
```

**示例：**
```
feat: 完成任务 SU-002（Cap Gates 核心逻辑）

实现了配额检查核心逻辑，支持每日/每小时配额限制。

产出物：
- api/cap-gates-core.js
- docs/CAP_GATES_USAGE.md
```

**类型说明：**
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `chore` - 配置/工具
- `test` - 测试相关

---

## 📈 监控面板

**文件：** `reports/git-commit-dashboard.md`

每日生成：
- 总提交数
- 按 Agent 统计
- 按任务统计
- 产出物统计

---

*配置时间：2026-03-17 05:48*  
*监控启动：立即执行*
