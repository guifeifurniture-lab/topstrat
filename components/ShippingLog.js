/**
 * ShippingLog - 已发布项目日志组件
 * 参考 VoxYZ Office 页面设计优化
 * 
 * 功能：
 * - 卡片式展示
 * - 时间戳 + 部署链接
 * - 状态标签（Shipped/Building）
 * - 贡献者展示
 * - 加载更多
 */

let displayedCount = 6;

export function ShippingLog({ data, initialCount = 6 }) {
    const { entries = [], showAll = false } = data || {};
    
    displayedCount = initialCount;
    const visibleEntries = showAll ? entries : entries.slice(0, displayedCount);

    return `
        <div class="space-y-6">
            <!-- 表头 -->
            <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-900">Shipping Log</h2>
                    <p class="text-sm text-gray-500 mt-1">
                        "What shipped matters more than what merely sounded promising."
                    </p>
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        ${entries.length} recent
                    </span>
                </div>
            </div>

            <!-- 卡片网格 -->
            ${visibleEntries.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${visibleEntries.map(entry => renderShippingCard(entry)).join('')}
                </div>
            ` : `
                <div class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <span class="text-4xl mb-4 block">📦</span>
                    <p class="text-gray-500 font-medium">Nothing shipped yet</p>
                    <p class="text-sm text-gray-400 mt-2">
                        Shipped work will appear here with timestamps and deployment evidence
                    </p>
                </div>
            `}

            <!-- 加载更多 -->
            ${!showAll && entries.length > displayedCount ? `
                <div class="text-center pt-4">
                    <button onclick="handleShowMoreShipping()" 
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <span>Show ${entries.length - displayedCount} more</span>
                        <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function renderShippingCard(entry) {
    const shippedAgo = getTimeAgo(new Date(entry.shippedAt));
    const status = entry.status || 'shipped';
    const statusConfig = getStatusConfig(status);
    const tags = entry.tags || [];
    const contributors = entry.contributors || [];

    return `
        <article class="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
            <!-- 状态 + 时间 -->
            <div class="flex items-center justify-between mb-3">
                <span class="${statusConfig.class} text-white text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center">
                    <span class="w-1.5 h-1.5 bg-white/80 rounded-full mr-1.5"></span>
                    ${statusConfig.label}
                </span>
                <span class="text-xs text-gray-400">${shippedAgo}</span>
            </div>

            <!-- 标题 -->
            <h3 class="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                ${entry.title}
            </h3>

            <!-- 标签 -->
            ${tags.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mb-3">
                    ${tags.map(tag => `
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            ` : ''}

            <!-- 贡献者 -->
            ${contributors.length > 0 ? `
                <div class="flex items-center flex-wrap gap-1.5 mb-4">
                    ${contributors.slice(0, 4).map(name => `
                        <span class="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2 py-1 rounded-md font-medium">
                            ${name}
                        </span>
                    `).join('')}
                    ${contributors.length > 4 ? `
                        <span class="text-xs text-gray-400 px-1">+${contributors.length - 4}</span>
                    ` : ''}
                </div>
            ` : ''}

            <!-- 底部信息 -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center space-x-2">
                    ${entry.confidence ? `
                        <span class="text-xs text-gray-500">${entry.confidence} confidence</span>
                    ` : ''}
                    ${entry.duration ? `
                        <span class="text-xs text-gray-400">·</span>
                        <span class="text-xs text-gray-500">${entry.duration}</span>
                    ` : ''}
                </div>
                
                ${entry.deployUrl ? `
                    <a href="${entry.deployUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        <span>Deploy</span>
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </article>
    `;
}

function getStatusConfig(status) {
    const configs = {
        shipped: { 
            label: 'Shipped', 
            class: 'bg-gradient-to-r from-emerald-500 to-teal-600' 
        },
        building: { 
            label: 'Building', 
            class: 'bg-gradient-to-r from-blue-500 to-indigo-600' 
        },
        queued: { 
            label: 'Queued', 
            class: 'bg-gradient-to-r from-amber-500 to-orange-600' 
        },
        failed: { 
            label: 'Failed', 
            class: 'bg-gradient-to-r from-red-500 to-rose-600' 
        }
    };
    return configs[status] || configs.shipped;
}

// 全局加载更多处理函数
if (typeof window !== 'undefined') {
    window.handleShowMoreShipping = function() {
        displayedCount += 6;
        // 触发自定义事件，通知父组件重新渲染
        window.dispatchEvent(new CustomEvent('shipping-load-more', { 
            detail: { count: displayedCount } 
        }));
    };
}

// 工具函数：相对时间
function getTimeAgo(date) {
    if (!date || isNaN(date.getTime())) return '—';
    
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
