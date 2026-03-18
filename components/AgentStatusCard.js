/**
 * AgentStatusCard - 谋士状态卡片组件
 * 参考 VoxYZ Office 页面设计优化
 * 
 * Props:
 * - agent: { id, name, emoji, role, status, description, lastActivity, currentTask, eventsToday }
 * - statusConfig: 状态配置对象
 */

export function AgentStatusCard({ agent, statusConfig = {} }) {
    const defaultStatusConfig = {
        working: { 
            label: 'Working', 
            class: 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30',
            dotClass: 'bg-emerald-300'
        },
        talking: { 
            label: 'Talking', 
            class: 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30',
            dotClass: 'bg-blue-300'
        },
        coffee: { 
            label: 'Coffee', 
            class: 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-amber-500/30',
            dotClass: 'bg-amber-300'
        },
        idle: { 
            label: 'Idle', 
            class: 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-md shadow-gray-400/20',
            dotClass: 'bg-gray-300'
        },
        offline: { 
            label: 'Offline', 
            class: 'bg-gradient-to-r from-slate-400 to-slate-500 shadow-md shadow-slate-400/20',
            dotClass: 'bg-slate-300'
        }
    };

    const config = { ...defaultStatusConfig, ...statusConfig };
    const status = config[agent.status] || config.idle;
    const timeAgo = getTimeAgo(new Date(agent.lastActivity));

    return `
        <div class="group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 ease-out">
            <!-- 状态指示器 -->
            <div class="absolute top-4 right-4 z-10">
                <span class="${status.class} text-white text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center group-hover:scale-105 transition-transform duration-300">
                    <span class="w-1.5 h-1.5 ${status.dotClass} rounded-full mr-1.5 animate-pulse"></span>
                    ${status.label}
                </span>
            </div>

            <!-- 头像 + 基本信息 -->
            <div class="flex items-start space-x-3 mb-4 pr-20">
                <span class="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">${agent.emoji}</span>
                <div>
                    <h3 class="font-semibold text-gray-900 text-lg group-hover:text-gray-700 transition-colors duration-300">${agent.name}</h3>
                    <p class="text-sm text-gray-500">${agent.role}</p>
                </div>
            </div>

            <!-- 当前活动描述 -->
            <div class="mb-4">
                <p class="text-sm text-gray-600 leading-relaxed min-h-[40px]">
                    ${agent.description || '—'}
                </p>
            </div>

            <!-- 当前任务 -->
            ${agent.currentTask ? `
                <div class="mb-3 p-2.5 bg-blue-50 border border-blue-100 rounded-lg group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors duration-300">
                    <p class="text-xs text-blue-700 font-medium">
                        <span class="mr-1">🔨</span>
                        ${agent.currentTask}
                    </p>
                </div>
            ` : ''}

            <!-- 底部信息 -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-300">⚡</span>
                    <span class="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">今日 ${agent.eventsToday || 0} 事件</span>
                </div>
                <span class="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-300">${timeAgo}</span>
            </div>

            <!-- 悬停效果装饰 - 光晕 -->
            <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/0 group-hover:ring-gray-900/10 group-hover:shadow-2xl transition-all duration-300 pointer-events-none"></div>
        </div>
    `;
}

/**
 * AgentGrid - 谋士卡片网格布局
 */
export function AgentGrid({ agents, statusConfig = {} }) {
    if (!agents || agents.length === 0) {
        return `
            <div class="text-center py-12">
                <span class="text-4xl mb-4 block">👻</span>
                <p class="text-gray-500">暂无谋士在线</p>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${agents.map(agent => AgentStatusCard({ agent, statusConfig })).join('')}
        </div>
    `;
}

// 工具函数：相对时间
function getTimeAgo(date) {
    if (!date || isNaN(date.getTime())) return '—';
    
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
