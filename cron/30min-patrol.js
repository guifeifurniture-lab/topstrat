// 30min patrol script - Node.js version
const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '../tasks/queue.json');
const reportsDir = path.join(__dirname, '../reports');

console.log('=== 30min Team Patrol ===');
console.log('Time:', new Date().toISOString());
console.log('Patrol: shangyang');

// Read queue
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

// Count tasks
const pending = queue.pending.length;
const inProgress = queue.inProgress.length;
const done = queue.done.length;
const total = pending + inProgress + done;

console.log(`Tasks: pending=${pending}, inProgress=${inProgress}, done=${done}, total=${total}`);

// Ensure reports dir exists
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Generate report
const now = new Date();
const reportTime = now.toISOString().replace(/[:.]/g, '').slice(0, 15);
const reportPath = path.join(reportsDir, `patrol-report-${reportTime}.md`);

const report = `# 30 分钟团队巡查报告

**时间:** ${now.toISOString()}  
**巡查人:** 商鞅 (shangyang)

---

## 任务统计

- 待处理：${pending}
- 进行中：${inProgress}
- 已完成：${done}
- 总计：${total}

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

- 任务池深度：${pending < 20 ? '不足 (需 20+)' : '充足'}
- 下次巡查：${new Date(now.setMinutes(30, 0, 0)).toISOString()}

---
*自动生成*
`;

fs.writeFileSync(reportPath, report, 'utf8');
console.log('Report:', reportPath);
console.log('=== Patrol Complete ===');
