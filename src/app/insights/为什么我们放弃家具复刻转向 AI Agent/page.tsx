import Link from "next/link";

export default function Article() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <Link
            href="/insights"
            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回 Insights
          </Link>
          <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime="2026-03-18">2026-03-18</time>
            <span>·</span>
            <div className="flex gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">战略</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">转型</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">AI Agent</span>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            《为什么我们放弃家具复刻转向 AI Agent》
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            一次战略转型的深度复盘，讲述我们如何从硬件复刻转向 AI Agent 开发的决策过程。
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">最初的想法</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            项目开始时，我们的方向是"家具复刻"——用现代工艺和材料重现经典家具设计。这个想法很有吸引力：经典设计经过时间检验，市场需求稳定，工艺本身也有文化价值。我们甚至已经联系了几家工厂，开始打样。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            但深入调研后，问题逐渐浮现：供应链复杂、库存压力大、物流成本高、利润空间被不断压缩。更重要的是，这个行业的创新速度太慢，一个产品从设计到上市需要数月甚至数年。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">转折点</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            转折点出现在一次偶然的对话中。团队成员提到，他们花了很多时间研究供应链管理、成本核算、市场分析——这些工作本质上都是信息处理和决策支持。如果有一个 AI 助手能帮忙，效率会大幅提升。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            这句话让我们意识到：真正有价值的不是家具本身，而是背后的决策能力。如果能打造一个 AI 系统，帮助人们更好地做决策，这个价值可能远超卖几件家具。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">转型分析</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            我们花了一周时间做详细的对比分析：
          </p>
          
          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">维度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">家具复刻</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">AI Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">启动成本</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">高（设备、库存）</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">低（主要是人力）</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">迭代速度</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">慢（月/年）</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">快（天/周）</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">边际成本</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">高（每件都有成本）</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">近乎零</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">可扩展性</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">受限于产能</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">理论上无限</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">核心洞察</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            分析结果很清晰：AI Agent 在几乎所有关键维度上都优于家具复刻。但更重要的是，我们看到了一个更大的趋势——AI 正在重塑工作方式，早期进入者将占据有利位置。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            另一个洞察是：我们团队的核心能力不是木工或供应链管理，而是系统思考和快速学习。这些能力在 AI 领域能发挥更大价值。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">转型过程</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            决定转型后，我们立即行动：
          </p>
          <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
            <li>• <strong>第一周：</strong> 技术栈调研，确定 Next.js + OpenClaw + Feishu 的组合</li>
            <li>• <strong>第二周：</strong> 搭建基础架构，实现三层记忆系统</li>
            <li>• <strong>第三周：</strong> 创建第一批谋士角色，测试协作机制</li>
            <li>• <strong>第四周：</strong> 开始真实场景应用，迭代优化</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">反思</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            回头看，这次转型有几个关键教训：
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>1. 早转型比晚转型好</strong>。如果等到家具业务出现问题再转型，代价会大得多。在还有选择权的时候做选择，是最优策略。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>2. 核心能力比具体产品重要</strong>。我们卖的不是家具或 AI，而是"辅助决策"的能力。这个定位可以适配多种载体。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>3. 速度是创业公司的护城河</strong>。从决定转型到推出 MVP，我们只用了 7 天。这种速度是大公司难以复制的。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">未来方向</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            转型不是终点，而是新起点。接下来我们会：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 扩展谋士角色库，覆盖更多专业领域</li>
            <li>• 优化协作机制，提升多 Agent 协同效率</li>
            <li>• 探索商业化路径，找到可持续的盈利模式</li>
            <li>• 建立社区，吸引更多开发者和用户参与</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            家具复刻的想法我们没有完全放弃。未来可能会以某种形式回归——比如用 AI 辅助家具设计，或者为家具行业提供决策支持工具。但那是后话了。
          </p>

          <div className="mt-12 rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              关键收获：
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 转型要趁早，在还有选择权时做选择</li>
              <li>• 聚焦核心能力，而非具体产品形态</li>
              <li>• 速度是创业公司的关键优势</li>
              <li>• 数据分析支撑决策，但不要等"完美数据"</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
