// Office 状态更新脚本
// 用途：生成实时团队状态数据
// 执行：每 5 分钟执行一次

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const INBOX_DIR = path.join(__dirname, 'inbox');
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const TASKS_DIR = path.join(__dirname, 'tasks');

// Agent 配置
const AGENTS = [
  { id: 'zhugeliang', name: '诸葛亮', emoji: '💡', role: 'CEO/总指挥' },
  { id: 'guanzhong', name: '管仲', emoji: '🔧', role: 'CTO/技术架构' },
  { id: 'sunbin', name: '孙膑', emoji: '⚔️', role: '全栈开发' },
  { id: 'guojia', name: '郭嘉', emoji: '🎨', role: '前端专家' },
  { id: 'mozi', name: '墨子', emoji: '🔨', role: '前端开发' },
  { id: 'shangyang', name: '商鞅', emoji: '✍️', role: 'DevOps' },
  { id: 'xiaohe', name: '萧何', emoji: '📦', role: 'QA/测试' },
  { id: 'zhangliang', name: '张良', emoji: '📊', role: '军师/侦察' },
  { id: 'fanli', name: '范蠡', emoji: '💰', role: 'CFO/财务' },
  { id: 'hanxin', name: '韩信', emoji: '📈', role: '增长黑客' },
  { id: 'chenping', name: '陈平', emoji: '🤝', role: '客户成功' }
];

// 检查 Agent 状态
function checkAgentStatus(agentId) {
  const sessionFile = path.join(SESSIONS_DIR, `${agentId}.session`);
  const inboxDir = path.join(INBOX_DIR, agentId);
  
  let status = 'idle';
  let currentTask = null;
  let lastHeartbeat = null;
  
  // 检查会话文件
  if (fs.existsSync(sessionFile)) {
    try {
      const session = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      lastHeartbeat = session.lastHeartbeat;
      currentTask = session.currentTask;
      status = session.status || 'idle';
    } catch (e) {
      // 忽略错误
    }
  }
  
  // 检查 inbox 是否有任务
  if (fs.existsSync(inboxDir)) {
    const tasks = fs.readdirSync(inboxDir);
    if (tasks.length > 0) {
      status = 'busy';
      if (!currentTask) {
        currentTask = tasks[0].replace('.md', '');
      }
    }
  }
  
  return { status, currentTask, lastHeartbeat };
}

// 生成 Office 状态
function generateOfficeState() {
  const now = new Date().toISOString();
  
  const agents = AGENTS.map(agent => {
    const { status, currentTask, lastHeartbeat } = checkAgentStatus(agent.id);
    return {
      id: agent.id,
      name: agent.name,
      emoji: agent.emoji,
      role: agent.role,
      status,
      currentTask,
      lastActivity: lastHeartbeat || now,
      eventsToday: Math.floor(Math.random() * 50) + 10, // 临时数据
      description: `${agent.name} - ${agent.role}`
    };
  });
  
  // 生成活动日志
  const activities = agents
    .filter(a => a.status !== 'idle')
    .map(a => ({
      id: `act_${a.id}_${Date.now()}`,
      agentId: a.id,
      agentName: a.name,
      action: a.status === 'busy' ? 'working' : 'active',
      content: `正在执行 ${a.currentTask || '任务'}`,
      task: a.currentTask,
      timestamp: a.lastActivity
    }));
  
  const state = {
    lastUpdated: now,
    agents,
    activities: activities.slice(0, 20),
    pulse: {
      totalEvents: agents.reduce((sum, a) => sum + a.eventsToday, 0),
      activeAgents: agents.filter(a => a.status !== 'idle').length,
      totalAgents: agents.length,
      lastUpdated: now
    }
  };
  
  // 确保 data 目录存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // 保存状态
  const outputFile = path.join(DATA_DIR, 'office-state.json');
  fs.writeFileSync(outputFile, JSON.stringify(state, null, 2), 'utf8');
  
  console.log(`[${now}] Office state updated: ${agents.length} agents, ${activities.length} activities`);
  
  return state;
}

// 如果是直接运行，生成状态
if (require.main === module) {
  generateOfficeState();
}

module.exports = { generateOfficeState };
