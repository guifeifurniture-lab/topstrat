// Agent 状态上报脚本
// 供各 Agent 报告自己的活动状态
// 使用：node report-status.js <agentId> <agentName> <action> <content> <task>

const http = require('http');

const [,, agentId, agentName, action, content, task] = process.argv;

if (!agentId || !agentName || !action) {
  console.log('用法：node report-status.js <agentId> <agentName> <action> [content] [task]');
  console.log('');
  console.log('参数说明:');
  console.log('  agentId   - Agent ID (如：zhugeliang)');
  console.log('  agentName - Agent 名称 (如：诸葛亮)');
  console.log('  action    - 动作类型 (working, talking, coffee, handoff, meeting)');
  console.log('  content   - 活动内容描述');
  console.log('  task      - 当前任务名称');
  console.log('');
  console.log('示例:');
  console.log('  node report-status.js zhugeliang 诸葛亮 working "派发任务" "任务协调"');
  console.log('  node report-status.js sunbin 孙膑 working "修复 Bug" "前端开发"');
  console.log('  node report-status.js guanzhong 管仲 coffee "休息" ""');
  process.exit(1);
}

const data = JSON.stringify({
  agentId,
  agentName,
  action: action || 'working',
  content: content || '',
  task: task || ''
});

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/office/report',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`✓ 状态已上报 (${agentName} - ${action})`);
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(body);
        if (response.activity) {
          console.log(`  活动 ID: ${response.activity.id}`);
          console.log(`  时间：${response.activity.timestamp}`);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
});

req.on('error', (error) => {
  console.error(`✗ 上报失败：${error.message}`);
  process.exit(1);
});

req.write(data);
req.end();
