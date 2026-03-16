# 谋士天团 - 完整团队配置

**创建时间：** 2026-03-16 09:00  
**团队规模：** 7 位 Agent（5 位技术开发 + 2 位业务）

---

## 📊 团队架构

```
                    诸葛亮 (market)
                    CEO / 总指挥
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    管仲 (architect)  墨子 + 孙膑 (delivery)  商鞅 (ops)
      CTO            前端 + 后端开发        DevOps
        │                │                │
        └────────────────┼────────────────┘
                         │
                    萧何 (qa)
                   质量保证
```

---

## 👥 Agent 详情

### 技术开发团队（5 位）

| Agent | 谋士 | 角色 | 工作空间 | 开发技能 |
|-------|------|------|----------|----------|
| **market** | 诸葛亮 | CEO/总指挥 | `workspace-market` | ✅ Claude Code |
| **architect** | 管仲 | CTO/技术架构 | `workspace-architect` | ✅ Claude Code |
| **delivery** | 孙膑 | 全栈开发 | `workspace-delivery` | ✅ Claude Code |
| **ops** | 商鞅 | DevOps | `workspace-ops` | ✅ Claude Code |
| **qa** | 萧何 | QA/测试 | `workspace-qa` | ✅ Claude Code |

### 业务团队（2 位）

| Agent | 谋士 | 角色 | 工作空间 | 技能 |
|-------|------|------|----------|------|
| **content** | 张良 | 产品/内容 | `workspace-content` | 文案创作 |
| **sales** | 范蠡 | CFO/财务 | `workspace-sales` | 销售/财务 |

---

## 🛠️ 开发工具链

### 统一工具

| 工具 | 版本 | 用途 |
|------|------|------|
| Claude Code CLI | v2.1.76 | AI 代码生成 |
| Node.js | v22.22.1 | JavaScript 运行时 |
| Git | latest | 版本控制 |
| PowerShell | latest | 自动化脚本 |

### 使用方式

```bash
# 开发任务
claude --permission-mode bypassPermissions --print '开发 Vault 产品页面'

# 代码审查
claude --permission-mode bypassPermissions --print '审查 src/components 目录代码'

# 测试编写
claude --permission-mode bypassPermissions --print '为 API 编写单元测试'

# DevOps
claude --permission-mode bypassPermissions --print '配置 CI/CD 流水线'
```

---

## 📋 开发流程

### 标准开发流程

```
1. 需求分析 (market/诸葛亮)
   ↓
2. 架构设计 (architect/管仲)
   ↓
3. 开发实现 (delivery/墨子 + 孙膑)
   ↓
4. 测试验证 (qa/萧何)
   ↓
5. 部署上线 (ops/商鞅)
   ↓
6. 监控运维 (ops/商鞅 + qa/萧何)
```

### 代码审查流程

```
developer 提交 PR
   ↓
architect 审查
   ↓
[通过] → qa 测试
   ↓
[通过] → ops 部署
   ↓
[失败] → 返回修改
```

---

## 🎯 当前任务分配

### P0 优先级（本周）

| 任务 | 负责人 | 协助 | 预计时间 |
|------|--------|------|----------|
| Vault 页面开发 | delivery（墨子） | architect | 2-3 天 |
| Office 数据层 | delivery（孙膑） | ops | 5-7 天 |
| Cap Gates 机制 | ops（商鞅） | architect | 2-3 天 |

### P1 优先级（下周）

| 任务 | 负责人 | 协助 | 预计时间 |
|------|--------|------|----------|
| 对抗层实现 | architect（管仲） | delivery | 3-4 天 |
| 交接合约系统 | delivery（孙膑） | ops | 2-3 天 |
| 自愈机制 | ops（商鞅） | qa | 1-2 天 |
| 测试覆盖率提升 | qa（萧何） | delivery | 持续 |

---

## 📈 团队指标

### 开发效率

| 指标 | 目标 | 当前 |
|------|------|------|
| 需求交付周期 | <1 周 | - |
| 代码审查覆盖率 | 100% | - |
| 测试覆盖率 | >80% | - |
| 部署成功率 | >99% | - |

### 质量指标

| 指标 | 目标 | 当前 |
|------|------|------|
| Bug 检出率 | >95% | - |
| 回归测试通过率 | 100% | - |
| 性能评分（Lighthouse） | >90 | - |
| 安全漏洞（Critical/High） | 0 | - |

---

## 🔗 工作空间路径

```
C:\Users\JINDA\.openclaw\
├── workspace-market/      # 诸葛亮（总指挥）
├── workspace-architect/   # 管仲（CTO）
├── workspace-delivery/    # 墨子 + 孙膑（开发）
├── workspace-ops/         # 商鞅（DevOps）
├── workspace-qa/          # 萧何（测试）
├── workspace-content/     # 张良（内容）
└── workspace-sales/       # 范蠡（财务）
```

---

## 📚 配置文件

每个 Agent 工作空间包含：
- `SOUL.md` - 角色定位和职责
- `AGENTS.md` - 工作区规则
- `TOOLS.md` - 本地工具配置
- `USER.md` - 协作者信息
- `IDENTITY.md` - 身份认同
- `HEARTBEAT.md` - 心跳检查任务

---

## 💡 团队协作

### Agent 间通信

**已启用：** Agent-to-Agent 通信
**允许列表：** 全部 7 位 Agent

### 消息路由

```yaml
bindings:
  - agentId: market
    match:
      channel: feishu
```

### 心跳检查

- **频率：** 每 15 分钟
- **最大并发：** 6 个 Agent
- **子 Agent 并发：** 6 个

---

## 🚀 启动命令

### 启动单个 Agent

```bash
openclaw run architect
openclaw run delivery
openclaw run ops
openclaw run qa
```

### 查看 Agent 状态

```bash
openclaw status
```

### 发送任务给 Agent

```bash
openclaw send delivery "开发 Vault 页面"
openclaw send qa "编写测试用例"
```

---

*最后更新：2026-03-16 09:00*
