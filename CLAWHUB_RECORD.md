# 🧰 ClawHub 技能市场记录

**记录时间:** 2026-03-16 07:55 GMT+8  
**负责人:** 管仲 🔧 (CTO/前端)  
**任务:** 定期搜索团队需要的技能并学习

---

## 🌐 官方网站

**URL:** https://clawhub.ai/  
**用途:** OpenClaw 技能市场  
**功能:**
- 搜索技能
- 安装技能
- 更新技能
- 发布技能

---

## 🔧 使用方式

### CLI 命令
```bash
# 搜索技能
clawhub search <skill-name>

# 安装技能
clawhub install <skill-name>

# 更新技能
clawhub update <skill-name>

# 列出已安装技能
clawhub list

# 发布技能
clawhub publish <skill-folder>
```

### 通过 OpenClaw
```bash
# 使用 clawhub 技能
openclaw skills list
```

---

## 📋 管仲的定期任务

### 任务 1: 技能学习检查 (每小时)
**Cron ID:** 25f7bade-407d-472f-929a-4a71171eef91  
**频率:** 每小时  
**内容:**
- 检查已安装技能状态
- 记录新技能数量
- 验证技能功能正常

### 任务 2: 知识学习 (每 4 小时)
**Cron ID:** c2198701-0c99-444a-9823-f2599d3af061  
**频率:** 每 4 小时  
**内容:**
- 学习新知识
- 记录到知识库
- 更新技能文档

### 新增任务：ClawHub 技能搜索 (每日)
**频率:** 每日 08:00  
**内容:**
1. 访问 https://clawhub.ai/
2. 搜索新发布的技能
3. 评估技能价值
4. 安装有用技能
5. 记录到技能清单

---

## 🎯 搜索策略

### 优先级 P0 - 核心技能
- coding-agent 增强
- 前端开发工具
- 后端开发工具
- DevOps 工具

### 优先级 P1 - 扩展技能
- 消息平台集成 (discord, slack)
- 知识库工具 (notion, obsidian 增强)
- 媒体处理 (图像，视频，音频)

### 优先级 P2 - 工具类
- 效率工具
- 自动化工具
- 监控工具

---

## 📊 技能评估标准

| 标准 | 权重 | 说明 |
|------|------|------|
| **实用性** | 40% | 是否解决实际问题 |
| **稳定性** | 30% | 是否经过测试 |
| **文档质量** | 20% | 是否有完整文档 |
| **社区评价** | 10% | 用户反馈如何 |

**评分 ≥80 分:** 立即安装  
**评分 60-79 分:** 观察后决定  
**评分 <60 分:** 暂不安装

---

## 📈 学习计划

### 每日任务 (08:00)
```powershell
# 1. 访问 ClawHub
$website = "https://clawhub.ai/"

# 2. 搜索新技能
clawhub search --new --limit 10

# 3. 评估技能
# 根据评估标准打分

# 4. 安装高分技能
clawhub install <skill-name>

# 5. 记录到日志
Add-Content "C:\Users\JINDA\.openclaw\memory\skill-learning-$(Get-Date -Format 'yyyy-MM-dd').md" `
  "- Installed: <skill-name> - Score: XX/100"
```

### 每周总结 (周日 20:00)
- 本周安装技能数
- 技能使用频率
- 技能效果评估
- 下周学习计划

---

## 📁 记录位置

### 技能清单
**路径:** `C:\Users\JINDA\.openclaw\workspace-market\website\SKILLS_FULL_LIST.md`  
**内容:** 56 个完整技能清单 + 安装状态

### 安装进度
**路径:** `C:\Users\JINDA\.openclaw\workspace-market\website\SKILL_INSTALL_PROGRESS.md`  
**内容:** 安装进度报告 + 待安装清单

### 学习计划
**路径:** `C:\Users\JINDA\.openclaw\workspace-market\website\SKILL_LEARNING_PLAN.md`  
**内容:** 学习路线图 + 优先级

### 每日记忆
**路径:** `C:\Users\JINDA\.openclaw\memory\YYYY-MM-DD.md`  
**内容:** 每日技能学习记录

---

## 🔔 通知机制

### 安装新技能后
1. 更新技能清单文档
2. 提交 Git 仓库
3. 通知团队成员
4. 更新配置集 (如需要)

### 通知方式
```powershell
# 提交 Git
cd C:\Users\JINDA\.openclaw\workspace-market\website
git add -A
git commit -m "feat: 安装新技能 <skill-name>"
git push origin master

# 团队通知 (Stage Feed)
# 更新 stage.html FEED_DATA
```

---

## 📊 当前技能状态

| 状态 | 数量 | 占比 |
|------|------|------|
| **已就绪** | 12 | 21.4% |
| **已安装** | 10 | 17.9% |
| **待安装** | ~15 | 26.8% |
| **macOS 跳过** | 7 | 12.5% |
| **特殊依赖** | ~12 | 21.4% |

**当前进度:** 22/56 (39.3%)  
**目标进度:** 47/56 (84%)

---

## ⏭️ 下一步

1. ✅ 记录 ClawHub 官网
2. ✅ 安排管仲负责技能搜索
3. ✅ 并行到现有 Cron 任务
4. ⏳ 每日 08:00 执行技能搜索
5. ⏳ 每周日 20:00 执行周总结

---

*最后更新：2026-03-16 07:55*  
*负责人：管仲 🔧*  
*下次检查：明日 08:00*
