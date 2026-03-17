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
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">协调机制</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">多 Agent</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">通信</span>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            《诸葛亮的群聊广播模式》
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            深度解析多 Agent 协调机制，如何通过群聊广播实现高效的信息同步和任务分发。
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">问题背景</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            在多 Agent 系统中，协调是一个核心挑战。想象一下：诸葛亮需要同时管理商鞅、孔子等多个谋士，每个谋士有自己的专长和任务。如何确保信息及时同步、任务正确分发、状态实时可见？
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            最初的方案是点对点通信：诸葛亮单独给每个谋士发消息。但很快发现问题：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 信息不同步——A 知道的消息 B 不知道</li>
            <li>• 重复劳动——多个谋士在做相同的事</li>
            <li>• 状态不一致——对任务进度的理解不同</li>
            <li>• 通信开销大——N 个谋士需要 N 条消息</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">群聊广播的设计</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            解决方案借鉴了古代"朝会"制度：重要事情在朝会上公开讨论，所有大臣同时听到，信息天然同步。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            我们实现了一个群聊广播机制：
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-50">核心设计</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• <strong>单一信息源：</strong>所有重要信息通过群聊发送，避免私聊导致的信息孤岛</li>
              <li>• <strong>@提及机制：</strong>特定任务@特定谋士，其他人可选择性关注</li>
              <li>• <strong>线程回复：</strong>相关讨论在同一个线程内，保持上下文完整</li>
              <li>• <strong>状态广播：</strong>任务状态变更自动广播给所有相关方</li>
              <li>• <strong>归档可查：</strong>所有通信记录自动归档，便于追溯</li>
            </ul>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">消息类型</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            我们定义了 5 种标准消息类型，每种有固定格式：
          </p>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">1. 任务派发</h3>
          <div className="mt-3 rounded-lg bg-zinc-100 p-4 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>[任务派发] @商鞅</p>
            <p>任务：检查系统状态</p>
            <p>优先级：P1</p>
            <p>截止时间：30 分钟</p>
            <p>背景：例行巡查</p>
          </div>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">2. 状态更新</h3>
          <div className="mt-3 rounded-lg bg-zinc-100 p-4 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>[状态更新] 任务#123</p>
            <p>进度：75%</p>
            <p>状态：进行中</p>
            <p>预计完成：10 分钟</p>
            <p>备注：API 响应稍慢</p>
          </div>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">3. 异常告警</h3>
          <div className="mt-3 rounded-lg bg-zinc-100 p-4 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>[异常告警] P0 级</p>
            <p>问题：Gateway 无响应</p>
            <p>影响：所有任务暂停</p>
            <p>处理：正在重启</p>
            <p>通知：@诸葛亮</p>
          </div>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">4. 知识共享</h3>
          <div className="mt-3 rounded-lg bg-zinc-100 p-4 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>[知识共享]</p>
            <p>主题：Feishu API 限流处理</p>
            <p>发现：Retry-After 头包含等待时间</p>
            <p>建议：所有 API 调用增加重试逻辑</p>
            <p>文档：comms/memory/global_mission.md</p>
          </div>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">5. 决策公告</h3>
          <div className="mt-3 rounded-lg bg-zinc-100 p-4 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>[决策公告]</p>
            <p>议题：是否启用新技能</p>
            <p>讨论：已征求商鞅、孔子意见</p>
            <p>决定：启用，但限制权限</p>
            <p>生效：立即</p>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">实现细节</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            群聊广播基于 Feishu 的群聊 API 实现。关键技术点：
          </p>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">消息队列</h3>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            为避免消息风暴，我们实现了简单的消息队列：
          </p>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 同类消息合并（如多个状态更新合并为一条）</li>
            <li>• 低优先级消息延迟发送（等非紧急消息积累后批量发送）</li>
            <li>• 紧急消息插队（P0 级告警立即发送）</li>
          </ul>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">订阅机制</h3>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            不是所有消息都需要所有人关注。谋士可以订阅感兴趣的消息类型：
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">谋士</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">订阅类型</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                <tr>
                  <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">商鞅</td>
                  <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">任务派发、异常告警</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">孔子</td>
                  <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">知识共享、决策公告</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">诸葛亮</td>
                  <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">全部（协调需要）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">上下文保持</h3>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            群聊消息容易碎片化。我们用线程（Thread）保持上下文：
          </p>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 每个任务有独立线程，所有相关讨论在线程内</li>
            <li>• 线程标题包含任务 ID 和简要描述</li>
            <li>• 任务完成后线程归档，便于后续查阅</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">效果对比</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            使用群聊广播前后，关键指标对比：
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">指标</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">点对点</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">群聊广播</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">改进</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                <tr>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">消息数量/天</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">~200</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">~80</td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">-60%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">信息同步延迟</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">5-30 分钟</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">&lt;1 分钟</td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">显著提升</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">重复任务</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">每周 2-3 次</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">几乎为零</td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">大幅减少</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">任务追溯时间</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">10-20 分钟</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">&lt;2 分钟</td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">快速定位</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">最佳实践</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            基于实践经验，我们总结了以下最佳实践：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• <strong>消息格式标准化：</strong>固定格式便于解析和归档</li>
            <li>• <strong>适度@提及：</strong>避免滥用@导致通知疲劳</li>
            <li>• <strong>线程内讨论：</strong>保持主群聊简洁，细节在线程中</li>
            <li>• <strong>定期摘要：</strong>每天/每周发送摘要，帮助快速了解全局</li>
            <li>• <strong>归档策略：</strong>完成任务的线程定期归档，保持群聊清爽</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">局限性与改进</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            群聊广播不是银弹，也有局限性：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• <strong>信息过载：</strong>所有消息都广播会导致噪音。解决方案：订阅机制 + 消息合并</li>
            <li>• <strong>隐私问题：</strong>敏感信息不适合群聊。解决方案：敏感话题用加密私聊</li>
            <li>• <strong>响应压力：</strong>公开消息可能给谋士造成压力。解决方案：允许"已读不回"，只要求关键消息确认</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            未来改进方向：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 智能消息优先级排序</li>
            <li>• 基于内容的自动分类和标签</li>
            <li>• 可视化任务关系图</li>
            <li>• 自然语言摘要生成</li>
          </ul>

          <div className="mt-12 rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              关键收获：
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 群聊广播比点对点通信更高效</li>
              <li>• 消息格式标准化便于处理和归档</li>
              <li>• 订阅机制避免信息过载</li>
              <li>• 线程保持上下文完整</li>
              <li>• 适度使用@提及，避免通知疲劳</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
