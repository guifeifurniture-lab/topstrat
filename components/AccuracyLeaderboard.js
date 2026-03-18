/**
 * AccuracyLeaderboard - 准确率排行榜组件
 * 参考 VoxYZ Office 页面设计优化
 * 
 * 功能：
 * - 表格展示
 * - 按准确率/任务数排序
 * - 趋势箭头（↑↓→）
 * - 响应式布局
 */

let currentSort = { field: 'rank', direction: 'asc' };

export function AccuracyLeaderboard({ data, onSortChange = null }) {
    const { entries, resolved, pending } = data || { entries: [], resolved: 0, pending: 0 };

    // 排序数据
    const sortedEntries = sortEntries([...entries], currentSort);

    return `
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <!-- 表头 -->
            <div class="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Accuracy Leaderboard</h2>
                        <p class="text-sm text-gray-500 mt-1">
                            Forecast quality becomes visible once shipped outcomes show up.
                        </p>
                    </div>
                    <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-500">
                            <span class="font-semibold text-gray-900">${resolved}</span> resolved
                        </span>
                        <span class="text-gray-300">|</span>
                        <span class="text-gray-500">
                            <span class="font-semibold text-gray-900">${pending}</span> pending
                        </span>
                    </div>
                </div>
            </div>

            <!-- 表格 -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            ${renderHeaderCell('rank', 'Rank', 'text-center')}
                            ${renderHeaderCell('agent', 'Agent', '')}
                            ${renderHeaderCell('accuracy', 'Overall', '', true)}
                            ${renderHeaderCell('samples', 'Samples', 'text-center')}
                            ${renderHeaderCell('best', 'Best', '')}
                            ${renderHeaderCell('weakest', 'Weakest', '')}
                            ${renderHeaderCell('signal', 'Signal', '')}
                            ${renderHeaderCell('narrative', 'Narrative', '')}
                            ${renderHeaderCell('build', 'Build', '')}
                            ${renderHeaderCell('wtp', 'WTP', '')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sortedEntries.map((entry, index) => renderAccuracyRow(entry, index)).join('')}
                    </tbody>
                </table>
            </div>

            <!-- 表尾 -->
            ${entries.length === 0 ? `
                <div class="px-6 py-12 text-center">
                    <span class="text-4xl mb-4 block">📊</span>
                    <p class="text-gray-500">暂无准确率数据</p>
                    <p class="text-sm text-gray-400 mt-2">
                        Scores show after 3+ shipped outcomes in 90-day window
                    </p>
                </div>
            ` : ''}
        </div>
    `;
}

function renderHeaderCell(field, label, align = '', sortable = false) {
    const isSorted = currentSort.field === field;
    const sortIcon = isSorted 
        ? (currentSort.direction === 'asc' ? '↑' : '↓') 
        : '↕';
    const sortClass = sortable 
        ? 'cursor-pointer hover:bg-gray-100 transition-colors' 
        : '';
    const activeClass = isSorted ? 'bg-gray-100' : '';

    return `
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${align} ${sortClass} ${activeClass}"
            ${sortable ? `onclick="handleSort('${field}')"` : ''}>
            <span class="inline-flex items-center">
                ${label}
                ${sortable ? `<span class="ml-1 text-gray-400">${sortIcon}</span>` : ''}
            </span>
        </th>
    `;
}

function renderAccuracyRow(entry, index) {
    const rank = entry.rank || index + 1;
    const medal = getMedal(rank);
    const accuracyDisplay = entry.accuracy === '—' ? '—' : `${entry.accuracy}%`;
    const accuracyClass = entry.accuracy !== '—' ? 'text-emerald-600 font-semibold' : 'text-gray-400';
    const trendIcon = getTrendIcon(entry.trend);

    return `
        <tr class="hover:bg-gray-50/80 transition-colors group">
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-xl">${medal}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <span class="text-2xl mr-2">${entry.emoji || ''}</span>
                    <span class="font-medium text-gray-900">${entry.agent}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap ${accuracyClass}">
                <div class="flex items-center">
                    ${accuracyDisplay}
                    ${trendIcon ? `<span class="ml-1.5 text-sm">${trendIcon}</span>` : ''}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                ${entry.samples || '—'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${entry.best || '—'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${entry.weakest || '—'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${entry.signal || '—'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${entry.narrative || '—'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${entry.build || '—'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                ${entry.wtp || '—'}
            </td>
        </tr>
    `;
}

function getMedal(rank) {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[rank - 1] || `#${rank}`;
}

function getTrendIcon(trend) {
    if (!trend) return '';
    switch (trend) {
        case 'up': return '↑';
        case 'down': return '↓';
        case 'stable': return '→';
        default: return '';
    }
}

function sortEntries(entries, sort) {
    const { field, direction } = sort;
    const multiplier = direction === 'asc' ? 1 : -1;

    return entries.sort((a, b) => {
        // 处理排名
        if (field === 'rank') {
            return (a.rank || 999) - (b.rank || 999) * multiplier;
        }
        
        // 处理准确率（移除 % 符号）
        if (field === 'accuracy') {
            const aVal = a.accuracy === '—' ? -1 : parseFloat(a.accuracy);
            const bVal = b.accuracy === '—' ? -1 : parseFloat(b.accuracy);
            return (aVal - bVal) * multiplier;
        }
        
        // 处理样本数
        if (field === 'samples') {
            const aVal = a.samples || 0;
            const bVal = b.samples || 0;
            return (aVal - bVal) * multiplier;
        }
        
        // 默认字符串比较
        return String(a[field] || '').localeCompare(String(b[field] || '')) * multiplier;
    });
}

// 全局排序处理函数（注入到 window）
if (typeof window !== 'undefined') {
    window.handleSort = function(field) {
        if (currentSort.field === field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.field = field;
            currentSort.direction = 'desc';
        }
        
        // 触发自定义事件，通知父组件重新渲染
        window.dispatchEvent(new CustomEvent('accuracy-sort-change', { 
            detail: { ...currentSort } 
        }));
        
        if (typeof onSortChange === 'function') {
            onSortChange({ ...currentSort });
        }
    };
}
