# Agent 巡查报告

**巡查频率：** 每 30 分钟  
**负责人：** 诸葛亮（market Agent）

---

## 📊 巡查清单

### 检查项
- [ ] 各 Agent 活动状态
- [ ] 任务进度更新
- [ ] Git 提交记录
- [ ] 部署状态
- [ ] 异常检测

### Agent 列表
1. market（诸葛亮）- CEO/总指挥
2. architect（管仲）- CTO/技术架构
3. delivery（孙膑）- 全栈开发
4. ops（商鞅）- DevOps
5. qa（萧何）- QA/测试
6. content（张良）- 产品/内容
7. sales（范蠡）- CFO/财务

---

## 📝 报告模板

```markdown
## 【30 分钟巡查报告】

**巡查时间：** YYYY-MM-DD HH:MM-HH:MM

### Agent 工作时长统计

| Agent | 谋士 | 工作时长 | 主要任务 | 状态 |
|-------|------|----------|----------|------|
| market | 诸葛亮 | XX 分钟 | 任务协调 | 🟢 |
| architect | 管仲 | XX 分钟 | 技能调研 | 🟢 |
| delivery | 孙膑 | XX 分钟 | 开发任务 | 🟢 |
| ops | 商鞅 | XX 分钟 | DevOps | 🟢 |
| qa | 萧何 | XX 分钟 | 测试 | 🟢 |
| content | 张良 | XX 分钟 | 产品设计 | 🟡 |
| sales | 范蠡 | XX 分钟 | 财务 | 🟡 |

### 本周期完成

- [任务 1] - 负责人 - 状态
- [任务 2] - 负责人 - 状态

### 进行中任务

- [任务 A] - 负责人 - 进度%
- [任务 B] - 负责人 - 进度%

### 重大事件

- 事件描述（如有）

### 下周期计划

- [计划 1]
- [计划 2]
```

---

## 🔍 巡查方法

### 1. 检查 Agent 活动
```bash
# 检查工作区最后修改时间
Get-ChildItem C:\Users\JINDA\.openclaw\workspace-* | 
  Select-Object Name, LastWriteTime |
  Sort-Object LastWriteTime -Descending
```

### 2. 检查 Git 提交
```bash
# 检查最近提交
cd C:\Users\JINDA\.openclaw\workspace-market\website
git log --since="30 minutes ago" --oneline
```

### 3. 检查部署状态
```bash
# 访问网站验证
curl https://topstrat.pages.dev/office
```

---

## ⚠️ 异常检测规则

| 异常类型 | 触发条件 | 处理方式 |
|----------|----------|----------|
| 空闲超时 | Agent 60 分钟无活动 | 发送提醒 |
| 任务阻塞 | 任务 2 小时无进展 | 介入协助 |
| 部署失败 | 连续 2 次部署失败 | 回滚 + 排查 |
| 质量下降 | 测试覆盖率<80% | 暂停开发补测试 |

---

## 📈 统计指标

### 每日统计
- 总工作时长（各 Agent 累加）
- 完成任务数
- Git 提交数
- 部署次数

### 每周统计
- 平均工作时长/天
- 任务完成率
- Bug 数量/修复率
- 性能指标趋势

---

*创建时间：2026-03-16 09:17*  
*下次巡查：2026-03-16 09:30*
