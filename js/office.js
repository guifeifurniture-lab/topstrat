// Office 页面前端逻辑

let officeData = null;
let updateInterval = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateInterval = setInterval(loadData, 30000); // 30 秒轮询
});

// 加载数据
async function loadData() {
    try {
        const response = await fetch('/data/office-state.json');
        officeData = await response.json();
        renderAll();
        console.log('Office data loaded at', new Date().toISOString());
    } catch (error) {
        console.error('Failed to load office data:', error);
    }
}

// 渲染所有内容
function renderAll() {
    if (!officeData) return;
    
    renderAgents();
    renderActivities();
    renderShipping();
    renderAccuracy();
    renderPulse();
}

// 渲染谋士状态卡片
function renderAgents() {
    const grid = document.getElementById('agents-grid');
    if (!grid || !officeData.agents) return;
    
    grid.innerHTML = officeData.agents.map(agent => {
        const statusClass = `status-${agent.status}`;
        const statusText = agent.status === 'working' ? '工作中' : agent.status === 'coffee' ? '☕ 咖啡' : '待机';
        const timeAgo = getTimeAgo(new Date(agent.lastActivity));
        
        return `
            <div class="agent-card bg-white rounded-lg shadow-sm border p-4">
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
                <div class="text-sm text-gray-600 mb-2">
                    <p class="line-clamp-2">${agent.description}</p>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>今日事件：${agent.eventsToday}</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染活动流
function renderActivities() {
    const list = document.getElementById('activities-list');
    if (!list || !officeData.activities) return;
    
    list.innerHTML = `
        <div class="space-y-4">
            ${officeData.activities.map(activity => {
                const actionIcon = activity.action === 'talking' ? '💬' : activity.action === 'coffee' ? '☕' : '🔨';
                const actionText = activity.action === 'talking' ? '讨论' : activity.action === 'coffee' ? '休息' : '工作';
                const timeAgo = getTimeAgo(new Date(activity.timestamp));
                
                return `
                    <div class="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                        <span class="text-2xl">${actionIcon}</span>
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="font-medium text-gray-900">${activity.agent}</span>
                                <span class="text-xs text-gray-500">${actionText}</span>
                            </div>
                            <p class="text-gray-600 text-sm">${activity.content}</p>
                            <span class="text-xs text-gray-400 mt-1 block">${timeAgo}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 渲染 Shipping Log
function renderShipping() {
    const list = document.getElementById('shipping-list');
    if (!list || !officeData.shipping) return;
    
    list.innerHTML = officeData.shipping.map(item => {
        const shippedAgo = getTimeAgo(new Date(item.shippedAt));
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Shipped</span>
                    <span class="text-xs text-gray-400">${shippedAgo}</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">${item.title}</h3>
                <div class="flex items-center space-x-2 mb-3">
                    ${item.contributors.map(name => `
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${name}</span>
                    `).join('')}
                </div>
                <a href="${item.deployUrl}" target="_blank" rel="noopener noreferrer" 
                   class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    查看部署 
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                </a>
            </div>
        `;
    }).join('');
}

// 渲染准确率排行榜
function renderAccuracy() {
    const table = document.getElementById('accuracy-table');
    if (!table || !officeData.accuracy) return;
    
    const medals = ['🥇', '🥈', '🥉'];
    
    table.innerHTML = officeData.accuracy.map((item, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xl">${medals[index] || `#${index + 1}`}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-medium text-gray-900">${item.agent}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-green-600 font-semibold">${item.accuracy}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${item.samples}
            </td>
        </tr>
    `).join('');
}

// 渲染 Pulse 视图
function renderPulse() {
    if (!officeData) return;
    
    const totalEvents = officeData.agents.reduce((sum, agent) => sum + agent.eventsToday, 0);
    const activeAgents = officeData.agents.filter(agent => agent.status === 'working').length;
    const shippedCount = officeData.shipping.length;
    
    document.getElementById('pulse-events').textContent = totalEvents;
    document.getElementById('pulse-active').textContent = activeAgents;
    document.getElementById('pulse-shipped').textContent = shippedCount;
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
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('text-gray-600', 'hover:bg-gray-100');
    });
    
    // 显示选中内容
    document.getElementById(`view-${viewName}-content`).classList.remove('hidden');
    
    // 激活按钮样式
    const activeBtn = document.getElementById(`view-${viewName}`);
    activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-100');
    activeBtn.classList.add('bg-blue-500', 'text-white');
}

// 时间格式化（相对时间）
function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    return `${Math.floor(seconds / 86400)}天前`;
}
