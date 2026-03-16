// 需求雷达数据管理
class RadarTracker {
    constructor() {
        this.signals = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    async init() {
        await this.loadData();
        this.render();
        this.updateStats();
    }

    async loadData() {
        try {
            const response = await fetch('/data/radar-state.json');
            const data = await response.json();
            this.signals = data.signals || [];
            document.getElementById('totalSignals').textContent = this.signals.length;
        } catch (error) {
            console.error('加载雷达数据失败:', error);
            // 使用默认数据
            this.signals = [];
            document.getElementById('totalSignals').textContent = '0';
        }
    }

    getStageClass(stage) {
        const classes = {
            watching: 'stage-watching',
            validating: 'stage-validating',
            testing: 'stage-testing',
            building: 'stage-building',
            shipped: 'stage-shipped'
        };
        return classes[stage] || '';
    }

    getStageLabel(stage) {
        const labels = {
            watching: '观察中',
            validating: '验证中',
            testing: '测试需求',
            building: '构建中',
            shipped: '已发布'
        };
        return labels[stage] || stage;
    }

    getSourceBadge(source, sourceType) {
        const colors = {
            internal: 'bg-gray-100 text-gray-600',
            user: 'bg-blue-100 text-blue-600',
            technical: 'bg-purple-100 text-purple-600',
            market: 'bg-green-100 text-green-600'
        };
        const colorClass = colors[sourceType] || colors.internal;
        return `<span class="text-xs ${colorClass} px-2 py-1 rounded font-medium">${source}</span>`;
    }

    getAssigneesBadges(assignees) {
        if (!assignees || assignees.length === 0) return '';
        return assignees.map(name => 
            `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">${name}</span>`
        ).join('');
    }

    render() {
        const container = document.getElementById('radarItems');
        
        // 筛选和搜索
        let filtered = this.currentFilter === 'all' 
            ? this.signals 
            : this.signals.filter(s => s.stage === this.currentFilter);
        
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(s => 
                s.title.toLowerCase().includes(query) ||
                (s.description && s.description.toLowerCase().includes(query)) ||
                (s.source && s.source.toLowerCase().includes(query))
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="bg-white rounded-lg shadow-sm border p-12 text-center md:col-span-2 lg:col-span-3">
                    <p class="text-gray-500 text-lg">暂无需求</p>
                    <p class="text-gray-400 text-sm mt-2">换个筛选条件试试？</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(signal => `
            <div class="radar-item bg-white rounded-lg shadow-sm border p-6">
                <div class="flex justify-between items-start gap-4 flex-wrap">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 class="text-lg font-semibold text-gray-900 truncate">${signal.title}</h3>
                            ${signal.source ? this.getSourceBadge(signal.source, signal.sourceType) : ''}
                        </div>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${signal.description || '暂无描述'}</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            ${this.getAssigneesBadges(signal.assignees)}
                        </div>
                    </div>
                    <div class="flex items-center gap-4 flex-shrink-0">
                        <div class="text-right">
                            <div class="text-xs text-gray-500 mb-1">投票数</div>
                            <div class="text-2xl font-bold text-gray-900">${signal.votes || 0}</div>
                        </div>
                        <span class="${this.getStageClass(signal.stage)} text-white text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                            ${this.getStageLabel(signal.stage)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const stats = {
            watching: this.signals.filter(s => s.stage === 'watching').length,
            validating: this.signals.filter(s => s.stage === 'validating').length,
            testing: this.signals.filter(s => s.stage === 'testing').length,
            building: this.signals.filter(s => s.stage === 'building').length,
            shipped: this.signals.filter(s => s.stage === 'shipped').length
        };

        document.getElementById('stat-watching').textContent = stats.watching;
        document.getElementById('stat-validating').textContent = stats.validating;
        document.getElementById('stat-testing').textContent = stats.testing;
        document.getElementById('stat-building').textContent = stats.building;
        document.getElementById('stat-shipped').textContent = stats.shipped;
    }

    filter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    search(query) {
        this.searchQuery = query;
        this.render();
    }
}

// 全局实例
let radarTracker;

// 筛选功能
function filterRadar(filter, button) {
    // 更新按钮状态 - 使用 Office 风格
    document.querySelectorAll('.stage-filter').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-500', 'text-white');
        btn.classList.add('text-gray-600', 'hover:bg-gray-200');
    });
    
    button.classList.remove('text-gray-600', 'hover:bg-gray-200');
    button.classList.add('active');

    // 应用筛选
    if (radarTracker) {
        radarTracker.filter(filter);
    }
}

// 搜索功能
function searchRadar(query) {
    if (radarTracker) {
        radarTracker.search(query);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    radarTracker = new RadarTracker();
});
