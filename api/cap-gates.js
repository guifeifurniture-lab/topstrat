// Cap Gates - 任务配额限制机制
// 用途：防止任务队列堆积，确保系统资源合理分配

const fs = require('fs');
const path = require('path');

// 配额配置
const CAP_GATE_CONFIG = {
  // 社交媒体发布
  post_tweet: { limit: 10, window: 'daily', resetTime: '00:00' },
  post_weibo: { limit: 8, window: 'daily', resetTime: '00:00' },
  
  // 内容创作
  write_content: { limit: 5, window: 'daily', resetTime: '00:00', cooldown: 30 },
  
  // 部署操作
  deploy: { limit: 3, window: 'daily', resetTime: '00:00', cooldown: 60, requireApproval: true },
  deploy_staging: { limit: 10, window: 'daily', resetTime: '00:00', cooldown: 15 },
  
  // API 调用
  api_call: { limit: 100, window: 'hourly' },
  api_call_external: { limit: 50, window: 'hourly' },
  
  // 数据爬取
  web_scrape: { limit: 20, window: 'hourly', cooldown: 2 },
  
  // 邮件发送
  send_email: { limit: 50, window: 'daily', resetTime: '00:00' },
  
  // AI 模型调用
  llm_call: { limit: 500, window: 'hourly', costPerCall: 0.002, dailyBudget: 10.00 },
  image_gen: { limit: 50, window: 'daily', costPerCall: 0.020, dailyBudget: 5.00 }
};

// 使用记录存储
const USAGE_LOG_PATH = path.join(__dirname, 'data', 'cap-gates-usage.json');

// 加载使用记录
function loadUsageLog() {
  try {
    if (fs.existsSync(USAGE_LOG_PATH)) {
      return JSON.parse(fs.readFileSync(USAGE_LOG_PATH, 'utf8'));
    }
  } catch (error) {
    console.error('Failed to load usage log:', error);
  }
  return { records: [], lastCleanup: Date.now() };
}

// 保存使用记录
function saveUsageLog(log) {
  try {
    fs.writeFileSync(USAGE_LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save usage log:', error);
  }
}

// 计算时间窗口边界
function getWindowBounds(window, resetTime) {
  const now = new Date();
  
  if (window === 'hourly') {
    // 自然小时
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return { start: start.getTime(), end: end.getTime() };
  }
  
  if (window === 'daily') {
    // 按配置的重置时间
    const [hours, minutes] = (resetTime || '00:00').split(':').map(Number);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    
    if (now.getTime() < start.getTime()) {
      start.setDate(start.getDate() - 1);
    }
    
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { start: start.getTime(), end: end.getTime() };
  }
  
  // 默认返回当前小时
  return getWindowBounds('hourly');
}

// 检查配额
function checkGate(stepKind) {
  const config = CAP_GATE_CONFIG[stepKind];
  
  if (!config) {
    // 无配置的任务类型，默认允许
    return { allowed: true, remaining: Infinity, resetAt: 0 };
  }
  
  const log = loadUsageLog();
  const { start, end } = getWindowBounds(config.window, config.resetTime);
  
  // 统计当前窗口内的使用次数
  const currentUsage = log.records.filter(record => 
    record.stepKind === stepKind && 
    record.timestamp >= start && 
    record.timestamp < end
  ).length;
  
  const remaining = config.limit - currentUsage;
  
  // 检查冷却时间
  if (config.cooldown) {
    const lastUsage = log.records
      .filter(r => r.stepKind === stepKind)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (lastUsage) {
      const elapsedMinutes = (Date.now() - lastUsage.timestamp) / (1000 * 60);
      if (elapsedMinutes < config.cooldown) {
        const retryAfter = Math.ceil((config.cooldown - elapsedMinutes) * 60);
        return {
          allowed: false,
          remaining: 0,
          resetAt: lastUsage.timestamp + config.cooldown * 60 * 1000,
          reason: `冷却时间未过，需等待 ${Math.ceil(config.cooldown - elapsedMinutes)} 分钟`,
          retryAfter
        };
      }
    }
  }
  
  if (remaining > 0) {
    return {
      allowed: true,
      remaining,
      resetAt: end,
      config
    };
  }
  
  // 配额耗尽
  const retryAfter = Math.ceil((end - Date.now()) / 1000);
  return {
    allowed: false,
    remaining: 0,
    resetAt: end,
    reason: `配额已用尽 (${config.limit}/${config.window})`,
    retryAfter,
    config
  };
}

// 记录使用
function recordUsage(stepKind, taskId, proposalId) {
  const log = loadUsageLog();
  
  log.records.push({
    stepKind,
    taskId,
    proposalId,
    timestamp: Date.now()
  });
  
  // 清理过期记录（保留最近 7 天）
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  log.records = log.records.filter(r => r.timestamp > sevenDaysAgo);
  log.lastCleanup = Date.now();
  
  saveUsageLog(log);
}

// 获取使用统计
function getUsageStats(stepKind) {
  const config = CAP_GATE_CONFIG[stepKind];
  if (!config) return null;
  
  const log = loadUsageLog();
  const { start, end } = getWindowBounds(config.window, config.resetTime);
  
  const currentUsage = log.records.filter(r => 
    r.stepKind === stepKind && 
    r.timestamp >= start && 
    r.timestamp < end
  ).length;
  
  return {
    stepKind,
    limit: config.limit,
    used: currentUsage,
    remaining: config.limit - currentUsage,
    window: config.window,
    resetAt: end
  };
}

// 导出 API
module.exports = {
  checkGate,
  recordUsage,
  getUsageStats,
  CAP_GATE_CONFIG
};

// 如果是直接运行，显示使用统计
if (require.main === module) {
  console.log('=== Cap Gates 配额状态 ===\n');
  
  Object.keys(CAP_GATE_CONFIG).forEach(stepKind => {
    const stats = getUsageStats(stepKind);
    if (stats) {
      console.log(`${stepKind}: ${stats.used}/${stats.limit} (${stats.remaining} 剩余)`);
    }
  });
}
