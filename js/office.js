// Office 页面前端逻辑 - 实时数据对接版本

let officeData = null;
let previousData = null;
let updateInterval = null;
let websocket = null;
let autoScrollEnabled = true;
let displayedActivityIds = new Set();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Office page initialized');
    loadData();
    updateInterval = setInterval(loadData, 5000); // 5 秒轮询（从 30 秒缩短）
    
    // 尝试连接 WebSocket（如果可用）
    tryWebSocket();
});

// 尝试 WebSocket 连接
function tryWebSocket() {
    if ('WebSocket' in window) {
        const wsUrl = `ws://${window.location.host}/ws/office`;
        try {
            websocket = new WebSocket(wsUrl);
            
            websocket.onopen = function() {
                console.log('WebSocket connected');
                updateConnectionStatus('connected');
            };
            
            websocket.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    officeData = data;
                    renderAll();
                    updateLastUpdated();
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };
            
            websocket.onclose = function() {
                console.log('WebSocket disconnected, falling back to polling');
                updateConnectionStatus('polling');
            };
            
            websocket.onerror = function(error) {
                console.error('WebSocket error:', error);
                websocket.close();
            };
        } catch (error) {
            console.log('WebSocket not available, using polling');
            updateConnectionStatus('polling');
        }
    } else {
        updateConnectionStatus('polling');
    }
}

// 加载数据
async function loadData() {
    try {
        // 使用真实 API 端点
        const response = await fetch('/api/office/state');
        const newData = await response.json();
        
        // 检测数据变化
        const hasChanges = checkDataChanges(officeData, newData);
        
        previousData = officeData;
        officeData = newData;
        
        renderAll();
        updateLastUpdated();
        
        if (hasChanges) {
            console.log('Data updated at', new Date().toISOString());
        }
        
        // 更新连接状态
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            updateConnectionStatus('connected');
        } else {
            updateConnectionStatus('polling');
        }
        
    } catch (error) {
        console.error('Failed to load office data:', error);
        updateConnectionStatus('error');
    }
}

// 检查数据是否有变化
function checkDataChanges(oldData, newData) {
    if (!oldData) return true;
    
    // 检查时间戳
    if (oldData.lastUpdated !== newData.lastUpdated) return true;
    
    // 检查 agent 数量
    if (!oldData.agents || !newData.agents || oldData.agents.length !== newData.agents.length) return true;
    
    // 检查活动数量
    if (!oldData.activities || !newData.activities || oldData.activities.length !== newData.activities.length) return true;
    
    return false;
}

// 渲染所有内容
function renderAll() {
    if (!officeData) return;
    
    renderAgents();
    renderActivities();
    renderShipping();
    renderAccuracy();
    renderPulse();
    renderGraveyard();
}

// 渲染谋士状态卡片
function renderAgents() {
    const grid = document.getElementById('agents-grid');
    const countLabel = document.getElementById('agent-count');
    if (!grid || !officeData.agents) return;
    
    countLabel.textContent = `${officeData.agents.length} 位谋士`;
    
    grid.innerHTML = officeData.agents.map(agent => {
        const statusClass = `status-${agent.status}`;
        const statusText = getStatusText(agent.status);
        const timeAgo = getTimeAgo(new Date(agent.lastActivity));
        
        // 检测状态变化动画
        const previousAgent = previousData?.agents?.find(a => a.id === agent.id);
        const statusChanged = previousAgent && previousAgent.status !== agent.status;
        const animationClass = statusChanged ? 'status-changed' : '';
        
        return `
            <div class="agent-card bg-white rounded-lg shadow-sm border p-4 ${animationClass}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${agent.emoji}</span>
                        <div>
                            <h3 class="font-semibold text-gray-900">${agent.name}</h3>
                            <p class="text-sm text-gray-500">${agent.role}</p>
                        </div>
                    </div>
                    <span class="${statusClass} text-white text-xs px-2 py-1 rounded-full font-medium">
                        <span class="pulse-dot inline-block w-2 h-2 bg-white rounded-full mr-1"></span>
                        ${statusText}
                    </span>
                </div>
                <div class="text-sm text-gray-600 mb-2 min-h-[40px]">
                    <p class="line-clamp-2">${agent.description || '—'}</p>
                </div>
                ${agent.currentTask ? `
                    <div class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2">
                        🔨 ${agent.currentTask}
                    </div>
                ` : ''}
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>今日事件：${agent.eventsToday}</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 获取状态文本
function getStatusText(status) {
    switch(status) {
        case 'working': return '工作中';
        case 'coffee': return '☕ 咖啡';
        case 'idle': return '待机';
        case 'offline': return '离线';
        default: return status;
    }
}

// 渲染活动流
function renderActivities() {
    const list = document.getElementById('activities-list');
    if (!list || !officeData.activities) return;
    
    // 过滤出新的活动
    const newActivities = officeData.activities.filter(activity => 
        !displayedActivityIds.has(activity.id)
    );
    
    // 添加新活动的 ID
    newActivities.forEach(activity => displayedActivityIds.add(activity.id));
    
    list.innerHTML = `
        <div class="space-y-4">
            ${officeData.activities.map((activity, index) => {
                const actionIcon = getActionIcon(activity.action);
                const actionText = getActionText(activity.action);
                const timeAgo = getTimeAgo(new Date(activity.timestamp));
                const isNew = newActivities.find(a => a.id === activity.id);
                const animationClass = isNew ? 'activity-enter' : '';
                
                return `
                    <div class="flex items-start space-x-3 pb-4 border-b last:border-b-0 ${animationClass}">
                        <span class="text-2xl flex-shrink-0">${actionIcon}</span>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="font-medium text-gray-900">${activity.agent}</span>
                                <span class="text-xs text-gray-500">${actionText}</span>
                                ${activity.task ? `
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        ${activity.task}
                                    </span>
                                ` : ''}
                            </div>
                            <p class="text-gray-600 text-sm truncate">${activity.content}</p>
                            <span class="text-xs text-gray-400 mt-1 block">${timeAgo}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // 自动滚动到底部
    if (autoScrollEnabled && newActivities.length > 0) {
        setTimeout(() => scrollToBottom(), 100);
    }
}

// 获取活动图标
function getActionIcon(action) {
    switch(action) {
        case 'talking': return '💬';
        case 'working': return '🔨';
        case 'coffee': return '☕';
        case 'handoff': return '🔄';
        default: return '•';
    }
}

// 获取活动文本
function getActionText(action) {
    switch(action) {
        case 'talking': return '讨论';
        case 'working': return '工作';
        case 'coffee': return '休息';
        case 'handoff': return '交接';
        default: return action;
    }
}

// 滚动到底部
function scrollToBottom() {
    const container = document.getElementById('activities-list');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// 渲染 Shipping Log
let displayedShippingCount = 6;

function renderShipping() {
    const list = document.getElementById('shipping-list');
    if (!list || !officeData.shipping) return;
    
    const shippingToShow = officeData.shipping.slice(0, displayedShippingCount);
    
    list.innerHTML = shippingToShow.map(item => {
        const shippedAgo = getTimeAgo(new Date(item.shippedAt));
        const tags = item.tags || [];
        
        return `
            <div class="shipping-card bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Shipped</span>
                    <span class="text-xs text-gray-400">${shippedAgo}</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">${item.title}</h3>
                <div class="flex flex-wrap gap-1 mb-2">
                    ${tags.map(tag => `
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${tag}</span>
                    `).join('')}
                </div>
                <div class="flex items-center space-x-2 mb-3">
                    ${item.contributors.slice(0, 3).map(name => `
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${name}</span>
                    `).join('')}
                    ${item.contributors.length > 3 ? `
                        <span class="text-xs text-gray-400">+${item.contributors.length - 3}</span>
                    ` : ''}
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">${item.confidence}</span>
                    <a href="${item.deployUrl}" target="_blank" rel="noopener noreferrer" 
                       class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        查看部署 
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// 加载更多 Shipping
function loadMoreShipping() {
    displayedShippingCount += 6;
    renderShipping();
}

// 渲染准确率排行榜
function renderAccuracy() {
    const table = document.getElementById('accuracy-table');
    const resolvedLabel = document.getElementById('accuracy-resolved');
    const pendingLabel = document.getElementById('accuracy-pending');
    
    if (!table || !officeData.accuracy) return;
    
    // 更新统计
    if (officeData.accuracy.resolved !== undefined) {
        resolvedLabel.textContent = `${officeData.accuracy.resolved} resolved`;
    }
    if (officeData.accuracy.pending !== undefined) {
        pendingLabel.textContent = `${officeData.accuracy.pending} pending`;
    }
    
    const medals = ['🥇', '🥈', '🥉'];
    
    table.innerHTML = officeData.accuracy.map((item, index) => {
        const rank = item.rank || index + 1;
        const medal = medals[index] || `#${rank}`;
        const accuracyDisplay = item.accuracy === '—' ? '—' : `${item.accuracy}%`;
        const accuracyClass = item.accuracy !== '—' ? 'text-green-600 font-semibold' : 'text-gray-400';
        
        return `
            <tr class="accuracy-row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-xl">${medal}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-medium text-gray-900">${item.agent}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap ${accuracyClass}">
                    ${accuracyDisplay}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.samples}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.best || '—'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.weakest || '—'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.signal || '—'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.narrative || '—'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.build || '—'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${item.wtp || '—'}
                </td>
            </tr>
        `;
    }).join('');
}

// 渲染 Pulse 视图
function renderPulse() {
    if (!officeData || !officeData.pulse) return;
    
    const pulse = officeData.pulse;
    
    document.getElementById('pulse-events').textContent = pulse.totalEvents || 0;
    document.getElementById('pulse-active').textContent = pulse.activeAgents || 0;
    document.getElementById('pulse-shipped').textContent = pulse.shippedCount || 0;
    
    // 更新状态分布
    renderPulseDistribution();
    
    // 更新交接信息
    renderPulseHandoffs();
}

// 渲染状态分布
function renderPulseDistribution() {
    const container = document.getElementById('pulse-distribution');
    if (!container || !officeData.agents) return;
    
    const statusCounts = {
        working: 0,
        coffee: 0,
        idle: 0,
        offline: 0
    };
    
    officeData.agents.forEach(agent => {
        statusCounts[agent.status] = (statusCounts[agent.status] || 0) + 1;
    });
    
    const total = officeData.agents.length;
    const statusLabels = {
        working: '工作中',
        coffee: '☕ 咖啡',
        idle: '待机',
        offline: '离线'
    };
    const statusColors = {
        working: 'bg-green-500',
        coffee: 'bg-yellow-500',
        idle: 'bg-gray-500',
        offline: 'bg-gray-300'
    };
    
    container.innerHTML = Object.entries(statusCounts).map(([status, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full ${statusColors[status]}"></span>
                    <span class="text-sm text-gray-600">${statusLabels[status]}</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                        <div class="${statusColors[status]} h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">${count}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染交接信息
function renderPulseHandoffs() {
    const container = document.getElementById('pulse-handoffs');
    if (!container || !officeData.activities) return;
    
    const handoffs = officeData.activities.filter(a => a.action === 'handoff');
    
    if (handoffs.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500">今日暂无交接</p>';
        return;
    }
    
    container.innerHTML = handoffs.slice(0, 5).map(handoff => {
        const timeAgo = getTimeAgo(new Date(handoff.timestamp));
        return `
            <div class="flex items-start space-x-2 text-sm">
                <span class="text-blue-500">🔄</span>
                <div class="flex-1">
                    <p class="text-gray-600">${handoff.content}</p>
                    <span class="text-xs text-gray-400">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染 Idea Graveyard
function renderGraveyard() {
    const list = document.getElementById('graveyard-list');
    const countLabel = document.getElementById('graveyard-count');
    
    if (!list || !officeData.graveyard) return;
    
    countLabel.textContent = `${officeData.graveyard.length} buried`;
    
    if (officeData.graveyard.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">Nothing is buried yet. Once WAR ROOM or Nexus reject an idea, it should land here with a revival trigger.</p>';
        return;
    }
    
    list.innerHTML = officeData.graveyard.map(item => {
        const rejectedAgo = getTimeAgo(new Date(item.rejectedAt));
        return `
            <div class="border-b last:border-b-0 py-4">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-medium text-gray-900">${item.idea}</h4>
                    <span class="text-xs text-gray-400">${rejectedAgo}</span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    <p>提出者：${item.proposer}</p>
                    <p>拒绝者：${item.rejectedBy}</p>
                </div>
                <div class="text-sm text-red-600 bg-red-50 p-2 rounded mb-2">
                    <strong>原因：</strong> ${item.reason}
                </div>
                ${item.revivalTrigger ? `
                    <div class="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        <strong>复活条件：</strong> ${item.revivalTrigger}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// 视图切换
function switchView(viewName) {
    // 隐藏所有内容
    document.getElementById('view-output-content').classList.add('hidden');
    document.getElementById('view-pulse-content').classList.add('hidden');
    document.getElementById('view-lab-content').classList.add('hidden');
    
    // 重置按钮样式
    ['output', 'pulse', 'lab'].forEach(view => {
        const btn = document.getElementById(`view-${view}`);
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
    });
    
    // 显示选中内容
    document.getElementById(`view-${viewName}-content`).classList.remove('hidden');
    
    // 激活按钮样式
    const activeBtn = document.getElementById(`view-${viewName}`);
    activeBtn.classList.remove('tab-inactive');
    activeBtn.classList.add('tab-active');
}

// 更新最后更新时间
function updateLastUpdated() {
    const label = document.getElementById('last-update');
    if (label && officeData && officeData.lastUpdated) {
        const time = new Date(officeData.lastUpdated);
        label.textContent = `最后更新：${time.toLocaleTimeString('zh-CN')}`;
    }
}

// 更新连接状态
function updateConnectionStatus(status) {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    const statusConfig = {
        connected: { color: 'green', text: 'WebSocket' },
        polling: { color: 'blue', text: '轮询' },
        error: { color: 'red', text: '错误' }
    };
    
    const config = statusConfig[status] || statusConfig.polling;
    const colorClasses = {
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800'
    };
    const dotClasses = {
        green: 'bg-green-400',
        blue: 'bg-blue-400',
        red: 'bg-red-400'
    };
    
    statusEl.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[config.color]}`;
    statusEl.innerHTML = `
        <span class="w-2 h-2 mr-1.5 ${dotClasses[config.color]} rounded-full pulse-dot"></span>
        ${config.text}
    `;
}

// 切换 WebSocket
function toggleWebSocket() {
    const toggle = document.getElementById('websocket-toggle');
    const statusLabel = document.getElementById('websocket-status');
    
    if (toggle.checked) {
        tryWebSocket();
        statusLabel.textContent = 'Connecting...';
    } else {
        if (websocket) {
            websocket.close();
            websocket = null;
        }
        statusLabel.textContent = 'Disabled';
    }
}

// 切换自动滚动
function toggleAutoScroll() {
    const toggle = document.getElementById('autoscroll-toggle');
    const statusLabel = document.getElementById('autoscroll-status');
    
    autoScrollEnabled = toggle.checked;
    statusLabel.textContent = autoScrollEnabled ? 'Enabled' : 'Disabled';
}

// 时间格式化（相对时间）
function getTimeAgo(date) {
    if (!date || isNaN(date.getTime())) return '—';
    
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    return `${Math.floor(seconds / 86400)}天前`;
}
