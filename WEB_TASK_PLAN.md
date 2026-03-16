# 谋士天团网站任务规划 v1.0

**创建时间：** 2026-03-16 08:53  
**参考来源：** VoxYZ Insights 10 篇文章核心洞察  
**当前状态：** 官网已部署 (topstrat.pages.dev)

---

## 📊 当前状态

### 已完成
- ✅ 6 个核心页面（index, office, stage, vault, radar, insights）
- ✅ SEO 优化（meta 标签、Open Graph、Twitter Card）
- ✅ Cloudflare Pages 部署
- ✅ Git 版本控制（4 commits）
- ✅ 域名可用（topstrat.pages.dev）

### 待完成（按优先级）

---

## 🔴 P0 - 核心功能（1-2 周）

### 1. Vault 页面完善（产品页）

**参考：** https://www.voxyz.space/vault

**需要开发：**
- [ ] 双层级定价卡片（Starter/Pro）
- [ ] FAQ 折叠组件（8 个问题）
- [ ] 邮箱收集表单
- [ ] 购买流程（对接 Lemon Squeezy 或 Gumroad）
- [ ] 购买后 GitHub 访问授权流程

**技术栈：**
- React + Tailwind CSS（与现有保持一致）
- 表单提交：Cloudflare Workers 或 Serverless Function
- 支付：Lemon Squeezy（推荐，支持全球支付）

**预计工作量：** 2-3 天

---

### 2. Office 页面实时数据层

**参考：** https://www.voxyz.space/office

**核心功能模块：**

| 模块 | 功能描述 | 复杂度 |
|------|----------|--------|
| 谋士状态卡片 | 5 位谋士实时状态（工作中/待机/咖啡） | 中 |
| 实时活动流 | 对话记录、任务交接、时间戳 | 高 |
| Shipping Log | 已发布项目列表、部署链接 | 中 |
| 准确率排行榜 | 预测准确度统计表格 | 中 |
| 多视图切换 | Output/Pulse/Lab 三视图 | 中 |
| 房间级活动 | War Room、Coffee Bar 等房间状态 | 高 |

**技术架构：**
```
数据存储：GitHub Issues（任务）+ 本地 JSON（状态）
实时更新：前端每 30 秒轮询
谋士数据源：sessions_list API 获取真实 Agent 活动
Cron 任务：每小时更新谋士状态、活动日志
```

**数据库设计（Supabase 或本地 JSON）：**
```json
{
  "agents": [
    {
      "id": "nexus",
      "name": "Nexus",
      "emoji": "🧭",
      "status": "talking|coffee|idle",
      "lastActivity": "2026-03-16T08:50:00Z",
      "eventsToday": 156
    }
  ],
  "handoffs": [
    {
      "from": "Guide",
      "to": "Forge",
      "type": "technical_issue",
      "status": "pending|acked|completed",
      "createdAt": "2026-03-16T08:45:00Z"
    }
  ],
  "shipping": [
    {
      "title": "Paper Reproducibility Cloud",
      "shippedAt": "2026-03-16T00:07:00Z",
      "contributors": ["growth", "Forge", "Nexus"],
      "deployUrl": "https://..."
    }
  ]
}
```

**预计工作量：** 5-7 天

---

### 3. Cap Gates 机制实现

**参考：** VoxYZ 文章 "AI Company with OpenClaw"

**目的：** 防止任务队列堆积，在提案入口拒绝超额请求

**实现步骤：**
1. 定义任务类型配额（每日推文数、内容发布数、部署次数）
2. 创建 `createProposalAndMaybeAutoApprove` 统一入口函数
3. 所有触发器、API、Reaction 必须经过此函数
4. 拒绝时记录原因并发出警告事件

**代码结构：**
```typescript
// proposal-service.ts
const STEP_KIND_GATES = {
  write_content: checkWriteContentGate,
  post_tweet: checkPostTweetGate,
  deploy: checkDeployGate,
};

async function createProposalAndMaybeAutoApprove(input) {
  // 1. 检查每日限制
  // 2. 检查 Cap Gates
  // 3. 插入提案
  // 4. 触发事件
  // 5. 评估自动审批
  // 6. 如批准 → 创建任务 + 步骤
}
```

**预计工作量：** 2-3 天

---

## 🟡 P1 - 增强功能（2-4 周）

### 4. 对抗层（Adversarial Layer）

**参考：** "Swarm Adversarial Layer" 文章

**功能：** 在 Swarm 模式下添加交叉审查，防止群体思维

**三阶段流程：**
1. 独立分析 - 专家盲写报告
2. 交叉审查 - 审查员必须输出反对论点、盲点、矛盾
3. 裁决 - 协调员判定保留/需证据/推翻

**触发条件：** ≥3 个专家时自动启用

**预计工作量：** 3-4 天

---

### 5. 交接合约系统（Handoff Contract）

**参考：** "First Reorg" 文章

**核心：** 数据库驱动的交接，非消息@提及

**实现：**
```typescript
// handoff.ts
insert('ops_mission_proposals', {
  agent_id: target_agent_id,
  title,
  objective,
  context_snapshot: {
    handoff_from: mission.created_by,
    source_mission_id: mission.id,
    source_step_id: step.id,
  },
  status: 'pending',
})
```

**预计工作量：** 2-3 天

---

### 6. 自愈机制（Self-Healing）

**参考：** "AI Company with OpenClaw" 文章

**功能：** 30 分钟无进展的步骤自动标记失败

**实现：**
```typescript
// heartbeat 中的 recoverStaleSteps
const STALE_THRESHOLD_MS = 30 * 60 * 1000;

const stale = await db
  .from('steps')
  .select('id, mission_id')
  .eq('status', 'running')
  .lt('updated_at', staleThreshold);

for (const step of stale) {
  await db.from('steps').update({
    status: 'failed',
    failure_reason: 'stale_timeout',
  });
}
```

**预计工作量：** 1-2 天

---

### 7. 按主题路由（Per-Topic Routing）

**参考：** "Everyone Teaches You How to Install" 文章

**功能：** 飞书群按角色分 Topic，每个 Topic 独立会话和记忆

**配置示例：**
```yaml
channels:
  feishu:
    chat_id: "xxx":
      topics:
        "daily-brief": { agentId: "nexus" }
        "radar": { agentId: "scout" }
        "content": { agentId: "quill" }
        "runtime": { agentId: "forge" }
        "support": { agentId: "guide" }
```

**预计工作量：** 1-2 天

---

## 🟢 P2 - 优化功能（4-6 周）

### 8. Context Doctor 集成

**参考：** "The More Rules I Wrote" 文章

**功能：** 扫描工作空间 token 使用情况，优化 Agent 表现

**核心指标：**
- Token Budget（总预算/已用/剩余）
- Agent Health Cards（每个 Agent 的 token 开销）
- File-Level Breakdown（每个文件的 token 消耗）
- Optimization Suggestions（删除建议、迁移建议）

**实现方式：**
- 方案 A：集成开源 Context Doctor（github.com/Heyvhuang/openclaw-context-doctor）
- 方案 B：自建简化版扫描工具

**预计工作量：** 2-3 天

---

### 9. 财务 Agent（第 6 位谋士）

**参考：** "My Agent Finished the Job" 文章

**功能：** 自动发票、对账、支付处理

**集成：**
- Airwallex API（跨境支付）
- Lemon Squeezy Webhook（购买通知）
- 自动发票生成（PDF）

**预计工作量：** 4-5 天

---

### 10. 双时间线运营

**参考：** "Everyone Says Quit Your Job" 文章

**功能：** 白天监控，晚上发布（适应全职工作者）

**实现：**
- 白天：Agent 收集素材、写草稿、分析数据
- 晚上（安全时段）：发送最佳草稿供审批发布
- Cron 配置：发布任务仅在 19:00-23:00 执行

**预计工作量：** 1 天

---

## 📅 执行时间表

| 周次 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| 第 1 周 | Vault 页面完善 | 墨子（前端） | ⏳ 待开始 |
| 第 1-2 周 | Office 实时数据层 | 孙膑（后端）+ 墨子 | ⏳ 待开始 |
| 第 2 周 | Cap Gates 机制 | 商鞅（DevOps） | ⏳ 待开始 |
| 第 3 周 | 对抗层 + 交接合约 | 孙膑 + 管仲 | ⏳ 待开始 |
| 第 3 周 | 自愈机制 | 商鞅 | ⏳ 待开始 |
| 第 4 周 | 按主题路由 + Context Doctor | 商鞅 + 管仲 | ⏳ 待开始 |
| 第 5-6 周 | 财务 Agent + 双时间线 | 孙膑 + 商鞅 | ⏳ 待开始 |

---

## 🛠️ 技术债务清理

### 立即执行
- [ ] 运行 Context Doctor 扫描当前工作空间
- [ ] 优化 SOUL.md/AGENTS.md 位置（重要规则放顶部）
- [ ] 检查是否有技能描述 3 个月未触发
- [ ] 迁移历史决策到 memory/ 文件夹

### 目标
- 每个 Agent 工作空间 <5,000 tokens
- 核心规则 100% 可见（不被截断）

---

## 📈 成功指标

| 指标 | 当前 | 目标 | 时间 |
|------|------|------|------|
| 页面加载速度 | - | <2 秒 | 2 周 |
| Office 实时更新延迟 | - | <5 秒 | 3 周 |
| Agent 响应准确率 | - | >95% | 4 周 |
| Token 开销优化 | - | -40% | 2 周 |
| 任务完成率 | - | >90% | 4 周 |

---

## 💡 关键决策点

1. **支付平台选择：** Lemon Squeezy vs Gumroad vs Stripe
   - 推荐：Lemon Squeezy（支持全球、税务处理简单）

2. **数据存储：** Supabase vs 本地 JSON vs GitHub Issues
   - 推荐：本地 JSON（简单）+ GitHub Issues（任务追踪）

3. **实时更新：** WebSocket vs 轮询
   - 推荐：轮询（每 30 秒，简单可靠）

4. **域名方案：**
   - 方案 A：继续使用 topstrat.pages.dev（已有内容）
   - 方案 B：购买自定义域名（topstrat.com/cn）
   - 推荐：方案 A（零成本，已验证可用）

---

**下一步行动：**
1. 老庄确认优先级和预算
2. 激活 coding-agent 开始 Vault 页面开发
3. 安排墨子（前端）和孙膑（后端）任务分配

---

*最后更新：2026-03-16 08:53*
