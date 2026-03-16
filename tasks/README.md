# 谋士天团 - 任务管理系统

**版本：** v1.0  
**创建时间：** 2026-03-16 19:54  
**目标：** 产物驱动的任务交接系统

---

## 📊 任务队列结构

```
tasks/
├── queue.json              # 任务队列（主文件）
├── proposals/              # 任务提案
│   └── task-XXX-proposal.md
├── artifacts/              # 任务产出物
│   └── task-XXX-*.md
├── reviews/                # 审查报告
│   └── task-XXX-review.md
└── logs/                   # 执行日志
    └── task-XXX-log.md
```

---

## 🔄 任务状态机

```
pending → in_progress → review → done
              ↓             ↓
           failed        rejected
```

### 状态说明

| 状态 | 说明 | 转换条件 |
|------|------|---------|
| `pending` | 待处理 | 诸葛亮创建任务 |
| `in_progress` | 执行中 | Agent 领取任务 |
| `review` | 待审查 | Agent 提交产出物 |
| `done` | 已完成 | 审查通过 + 部署成功 |
| `rejected` | 已拒绝 | 审查不通过 |
| `failed` | 失败 | 执行出错 |

---

## 📝 任务提案模板

**文件：** `tasks/proposals/task-XXX-proposal.md`

```markdown
# 任务提案：{任务标题}

**ID:** task-XXX  
**负责人:** {Agent}  
**优先级:** P0/P1/P2  
**创建时间:** YYYY-MM-DD HH:mm

## 背景
{为什么需要这个任务}

## 目标
{完成后的预期结果}

## 执行计划
1. 步骤 1
2. 步骤 2
3. 步骤 3

## 预期产出物
- `artifacts/task-XXX-output.md`
- `code/feature.patch`

## 风险评估
- 风险 1
- 风险 2

## 审批状态
- [ ] 诸葛亮审批
- [ ] 老庄审批（如需要）
```

---

## 🎯 产物交接协议

### 规则

1. **所有任务必须产出文件**
   - ❌ 对话汇报："我做完了"
   - ✅ 文件交接：`artifacts/task-XXX-complete.md`

2. **产出物必须是结构化格式**
   - Markdown 文档
   - JSON 数据
   - 代码 Patch
   - 测试报告

3. **下游 Agent 直接使用上游产出**
   ```
   孙膑开发完成
   → `code/feature.patch`
   → 萧何直接读取 patch 编写测试
   ```

---

## 🔧 任务管理脚本

### 创建任务

```powershell
# 文件：tasks/create-task.ps1
param(
    [string]$title,
    [string]$assignedTo,
    [string]$priority = "P1",
    [bool]$approvalRequired = $false
)

# 读取 queue.json
# 添加新任务到 pending 数组
# 保存文件
```

### 领取任务

```powershell
# 文件：tasks/claim-task.ps1
param(
    [string]$taskId,
    [string]$agentId
)

# 更新任务状态：pending → in_progress
# 记录领取时间
```

### 提交产出

```powershell
# 文件：tasks/submit-task.ps1
param(
    [string]$taskId,
    [string]$artifactPath
)

# 更新任务状态：in_progress → review
# 添加 artifact 到任务记录
```

---

## 📊 监控指标

| 指标 | 计算公式 | 目标 |
|------|---------|------|
| 任务完成率 | done / (done + failed) | >90% |
| 平均完成时间 | Σ(done_time - created_at) / done_count | <4 小时 |
| 审查通过率 | approved / reviewed | >80% |
| 队列深度 | pending.length | <20 |

---

*最后更新：2026-03-16 19:54*
