// Office Status API - 实时 Agent 状态接口
// 此文件提供 Agent 状态数据的真实来源

const fs = require('fs');
const path = require('path');

// Agent 配置文件路径
const AGENTS_CONFIG_PATH = path.join(__dirname, '../config/agents.json');
const OFFICE_STATE_PATH = path.join(__dirname, '../data/office-state.json');
const ACTIVITY_LOG_PATH = path.join(__dirname, '../data/activity-log.json');
const SHIPPING_LOG_PATH = path.join(__dirname, '../data/shipping-log.json');

/**
 * 获取所有 Agent 的实时状态
 */
function getAgentStates() {
    try {
        // 读取 Agent 配置文件
        const configData = JSON.parse(fs.readFileSync(AGENTS_CONFIG_PATH, 'utf8'));
        // agents.json 格式是 { lastUpdated, agents: [] }，需要提取 agents 数组
        const agentsConfig = configData.agents || configData;
        
        // 读取活动日志获取最后活动时间
        const activityLog = JSON.parse(fs.readFileSync(ACTIVITY_LOG_PATH, 'utf8'));
        
        // 计算每个 Agent 的状态
        return agentsConfig.map(agent => {
            const lastActivity = activityLog
                .filter(log => log.agentId === agent.id)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
            
            const now = new Date();
            const lastActiveTime = lastActivity ? new Date(lastActivity.timestamp) : new Date(0);
            const minutesSinceActive = (now - lastActiveTime) / 1000 / 60;
            
            // 根据活动时间判断状态
            let status = 'idle';
            if (minutesSinceActive < 5) {
                status = lastActivity?.action === 'coffee' ? 'coffee' : 'working';
            } else if (minutesSinceActive < 30) {
                status = 'idle';
            } else {
                status = 'offline';
            }
            
            // 计算今日事件数
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const eventsToday = activityLog.filter(log => 
                log.agentId === agent.id && 
                new Date(log.timestamp) >= todayStart
            ).length;
            
            return {
                id: agent.id,
                name: agent.name,
                emoji: agent.emoji,
                role: agent.role,
                status: status,
                lastActivity: lastActivity ? lastActivity.timestamp : null,
                eventsToday: eventsToday,
                currentTask: lastActivity?.task || null,
                description: agent.description
            };
        });
    } catch (error) {
        console.error('Error getting agent states:', error);
        return [];
    }
}

/**
 * 获取团队活动流
 */
function getActivityFeed(limit = 20) {
    try {
        const activityLog = JSON.parse(fs.readFileSync(ACTIVITY_LOG_PATH, 'utf8'));
        
        // 按时间倒序排序，取最新的 N 条
        return activityLog
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
            .map(log => ({
                id: log.id,
                agent: log.agentName,
                agentId: log.agentId,
                action: log.action, // talking, working, coffee, handoff
                content: log.content,
                task: log.task,
                timestamp: log.timestamp
            }));
    } catch (error) {
        console.error('Error getting activity feed:', error);
        return [];
    }
}

/**
 * 获取 Shipping Log
 */
function getShippingLog() {
    try {
        const shippingLog = JSON.parse(fs.readFileSync(SHIPPING_LOG_PATH, 'utf8'));
        
        return shippingLog
            .sort((a, b) => new Date(b.shippedAt) - new Date(a.shippedAt))
            .map(item => ({
                id: item.id,
                title: item.title,
                shippedAt: item.shippedAt,
                contributors: item.contributors,
                deployUrl: item.deployUrl,
                status: item.status,
                confidence: item.confidence || '80%',
                duration: item.duration || 'TBD'
            }));
    } catch (error) {
        console.error('Error getting shipping log:', error);
        return [];
    }
}

/**
 * 获取准确率排行榜
 */
function getAccuracyLeaderboard() {
    try {
        const accuracyData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/accuracy.json'), 'utf8'));
        
        return accuracyData
            .sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy))
            .map((item, index) => ({
                agent: item.agent,
                agentId: item.agentId,
                rank: index + 1,
                accuracy: item.accuracy,
                samples: item.samples,
                best: item.best || '—',
                weakest: item.weakest || '—',
                signal: item.signal || '—',
                narrative: item.narrative || '—',
                build: item.build || '—',
                wtp: item.wtp || '—'
            }));
    } catch (error) {
        console.error('Error getting accuracy leaderboard:', error);
        return [];
    }
}

/**
 * 获取系统健康指标（Pulse）
 */
function getPulseMetrics() {
    const agents = getAgentStates();
    const shipping = getShippingLog();
    const activities = getActivityFeed();
    
    const totalEvents = agents.reduce((sum, agent) => sum + agent.eventsToday, 0);
    const activeAgents = agents.filter(agent => agent.status === 'working').length;
    const shippedCount = shipping.filter(s => s.status === 'shipped').length;
    
    // 计算其他指标
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const handoffsToday = activities.filter(a => 
        a.action === 'handoff' && new Date(a.timestamp) >= todayStart
    ).length;
    
    return {
        totalEvents,
        activeAgents,
        shippedCount,
        handoffsToday,
        totalAgents: agents.length,
        lastUpdated: new Date().toISOString()
    };
}

/**
 * 获取 Idea Graveyard（被拒绝的想法）
 */
function getIdeaGraveyard() {
    try {
        const graveyardPath = path.join(__dirname, '../data/idea-graveyard.json');
        if (!fs.existsSync(graveyardPath)) {
            return [];
        }
        
        const graveyard = JSON.parse(fs.readFileSync(graveyardPath, 'utf8'));
        return graveyard
            .sort((a, b) => new Date(b.rejectedAt) - new Date(a.rejectedAt))
            .map(item => ({
                id: item.id,
                idea: item.idea,
                proposer: item.proposer,
                rejectedBy: item.rejectedBy,
                rejectedAt: item.rejectedAt,
                reason: item.reason,
                revivalTrigger: item.revivalTrigger || null
            }));
    } catch (error) {
        console.error('Error getting idea graveyard:', error);
        return [];
    }
}

/**
 * 更新 Office 状态文件
 */
function updateOfficeState() {
    const state = {
        lastUpdated: new Date().toISOString(),
        agents: getAgentStates(),
        activities: getActivityFeed(10),
        shipping: getShippingLog(),
        accuracy: getAccuracyLeaderboard(),
        pulse: getPulseMetrics(),
        graveyard: getIdeaGraveyard()
    };
    
    fs.writeFileSync(OFFICE_STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
    return state;
}

// 导出 API 函数
module.exports = {
    getAgentStates,
    getActivityFeed,
    getShippingLog,
    getAccuracyLeaderboard,
    getPulseMetrics,
    getIdeaGraveyard,
    updateOfficeState
};

// 如果是直接运行此文件，则更新状态
if (require.main === module) {
    console.log('Updating office state...');
    const state = updateOfficeState();
    console.log('Office state updated at', state.lastUpdated);
    console.log(`Agents: ${state.agents.length}, Activities: ${state.activities.length}, Shipping: ${state.shipping.length}`);
}
