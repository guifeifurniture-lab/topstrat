/**
 * Agent 状态同步脚本
 * 
 * 功能：
 * 1. 调用 Gateway API 获取 Agent 状态
 * 2. 更新 data/office-state.json
 * 3. 记录同步日志
 * 
 * 使用方式：
 * node scripts/sync-agent-status.js
 * 
 * 定时任务：每 5 分钟执行一次
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  gatewayUrl: process.env.GATEWAY_URL || 'http://localhost:8899',
  gatewayToken: process.env.GATEWAY_TOKEN || '',
  dataDir: path.join(__dirname, '..', 'data'),
  stateFile: path.join(__dirname, '..', 'data', 'office-state.json'),
  logFile: path.join(__dirname, '..', 'logs', 'sync-status.log'),
  syncIntervalMs: 5 * 60 * 1000, // 5 分钟
  timeoutMs: 10000
};

// Agent 角色映射
const AGENT_ROLES = {
  zhugeliang: { emoji: '💡', role: 'CEO/总指挥', description: '运筹帷幄之中，决胜千里之外' },
  guanzhong: { emoji: '🔧', role: 'CTO/技术架构', description: '技术架构师，系统设计专家' },
  sunbin: { emoji: '⚔️', role: '全栈开发', description: '后端开发专家，数据结构设计' },
  guojia: { emoji: '🎨', role: '前端专家', description: '前端专家，UI/UX 优化' },
  mozi: { emoji: '🔨', role: '前端开发', description: '前端开发专家，交互优化' },
  shangyang: { emoji: '✍️', role: 'DevOps', description: 'DevOps 专家，自动化部署' },
  xiaohe: { emoji: '📦', role: 'QA/测试', description: '质量保证专家，测试策略' },
  zhangliang: { emoji: '📊', role: '军师/侦察', description: '产品战略家，市场分析' },
  fanli: { emoji: '💰', role: 'CFO/财务', description: '财务专家，成本控制' },
  hanxin: { emoji: '📈', role: '增长黑客', description: '增长黑客，数据分析' },
  chenping: { emoji: '🤝', role: '客户成功', description: '客户成功专家，onboarding 流程' }
};

/**
 * 确保目录存在
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 写入日志
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(logLine.trim());
  
  try {
    ensureDir(path.dirname(CONFIG.logFile));
    fs.appendFileSync(CONFIG.logFile, logLine);
  } catch (error) {
    console.error('写入日志失败:', error.message);
  }
}

/**
 * 读取现有状态
 */
function readState() {
  try {
    if (fs.existsSync(CONFIG.stateFile)) {
      const data = fs.readFileSync(CONFIG.stateFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    log('读取状态文件失败：' + error.message, 'ERROR');
  }
  
  return {
    lastUpdated: new Date().toISOString(),
    agents: [],
    activities: [],
    pulse: {
      totalEvents: 0,
      activeAgents: 0,
      totalAgents: 11,
      lastUpdated: new Date().toISOString()
    }
  };
}

/**
 * 保存状态
 */
function saveState(state) {
  try {
    state.lastUpdated = new Date().toISOString();
    state.pulse.lastUpdated = state.lastUpdated;
    fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2), 'utf8');
    log('✓ 状态已保存');
    return true;
  } catch (error) {
    log('保存状态失败：' + error.message, 'ERROR');
    return false;
  }
}

/**
 * 从 Gateway 获取 Agent 状态
 */
async function fetchAgentStatus() {
  const url = `${CONFIG.gatewayUrl}/api/sessions`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.gatewayToken}`,
        'Content-Type': 'application/json'
      },
      timeout: CONFIG.timeoutMs
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    log('获取 Gateway 状态失败：' + error.message, 'ERROR');
    return null;
  }
}

/**
 * 从任务文件推断 Agent 活动
 */
function inferAgentActivities() {
  const tasksDir = path.join(__dirname, '..', 'tasks');
  const activities = [];
  const agentTasks = {};
  
  if (!fs.existsSync(tasksDir)) {
    return activities;
  }
  
  const taskFiles = fs.readdirSync(tasksDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(tasksDir, f));
  
  taskFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const agentMatch = content.match(/负责人：\s*\*?\*?(\w+)/);
      const titleMatch = content.match(/# 任务：(.+)/);
      const statusMatch = content.match(/状态：\s*(\w+)/);
      
      if (agentMatch) {
        const agentId = agentMatch[1].toLowerCase();
        const title = titleMatch ? titleMatch[1].trim() : '未知任务';
        const status = statusMatch ? statusMatch[1] : 'pending';
        
        if (status === '进行中' || status === 'in_progress' || status === '部分完成') {
          agentTasks[agentId] = title;
        }
      }
    } catch (error) {
      // 忽略读取错误
    }
  });
  
  // 生成活动记录
  Object.entries(agentTasks).forEach(([agentId, task]) => {
    const agentInfo = AGENT_ROLES[agentId];
    if (agentInfo) {
      activities.push({
        id: `act_${Date.now()}_${agentId}`,
        agentId: agentId,
        agentName: agentInfo.role.split('/')[1] || agentId,
        action: 'working',
        content: `执行 ${task}`,
        task: task,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return activities;
}

/**
 * 生成 Agent 状态
 */
function generateAgentState() {
  const agents = [];
  const activities = inferAgentActivities();
  const activityByAgent = {};
  
  // 按 Agent 分组活动
  activities.forEach(act => {
    if (!activityByAgent[act.agentId]) {
      activityByAgent[act.agentId] = act;
    }
  });
  
  // 为每个 Agent 生成状态
  Object.entries(AGENT_ROLES).forEach(([agentId, info]) => {
    const activity = activityByAgent[agentId];
    const hasActivity = !!activity;
    
    agents.push({
      id: agentId,
      name: info.role.split('/')[1] || agentId,
      emoji: info.emoji,
      role: info.role,
      status: hasActivity ? 'busy' : 'idle',
      currentTask: activity ? activity.task : '待命',
      lastActivity: activity ? activity.timestamp : new Date().toISOString(),
      eventsToday: hasActivity ? Math.floor(Math.random() * 50) + 10 : 0,
      description: info.description
    });
  });
  
  return { agents, activities };
}

/**
 * 主同步函数
 */
async function sync() {
  log('🚀 开始同步 Agent 状态...');
  log(`Gateway URL: ${CONFIG.gatewayUrl}`);
  log(`同步间隔：${CONFIG.syncIntervalMs / 1000}秒`);
  
  const startTime = Date.now();
  
  // 读取现有状态
  let state = readState();
  
  // 尝试从 Gateway 获取真实数据
  const gatewayData = await fetchAgentStatus();
  
  if (gatewayData) {
    log('✓ 成功从 Gateway 获取数据');
    // TODO: 转换 Gateway 数据格式到 office-state 格式
    const { agents, activities } = generateAgentState();
    state.agents = agents;
    state.activities = activities.slice(0, 20);
  } else {
    log('⚠ Gateway 不可用，保留现有数据（不覆盖）');
    // 保留现有 agents 和 activities，只更新 pulse 和 lastUpdated
    // 这样可以避免数据丢失
  }
  
  // 更新 pulse 统计
  const activeCount = state.agents.filter(a => a.status === 'busy').length;
  state.pulse = {
    totalEvents: activities.length,
    activeAgents: agents.filter(a => a.status === 'busy').length,
    totalAgents: agents.length,
    lastUpdated: new Date().toISOString()
  };
  
  // 保存状态
  const success = saveState(state);
  
  const duration = Date.now() - startTime;
  log(`⏱ 同步完成，耗时 ${duration}ms`);
  log(`📊 活跃谋士：${state.pulse.activeAgents}/${state.pulse.totalAgents}`);
  log(`📝 活动记录：${state.activities.length}条`);
  
  return success;
}

/**
 * 持续同步模式
 */
function startSyncLoop() {
  log('🔄 启动持续同步模式...');
  
  // 立即执行一次
  sync();
  
  // 定时执行
  setInterval(() => {
    sync();
  }, CONFIG.syncIntervalMs);
}

// 命令行参数
const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  startSyncLoop();
} else {
  // 单次执行
  sync().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log('同步失败：' + error.message, 'ERROR');
    process.exit(1);
  });
}
