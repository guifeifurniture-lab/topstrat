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
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">工作流</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">自动化</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">机制设计</span>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            《商鞅的 30 分钟巡查机制设计》
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            揭秘我们如何设计高效的自动巡查工作流，确保系统稳定运行的核心机制。
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">设计背景</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            商鞅变法的核心是"法必明、令必行"。在现代团队管理中，这意味着制度不仅要设计得好，更要执行到位。我们面临的问题是：如何确保各项自动化任务按时执行、系统状态持续健康、异常情况及时发现？
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            人工检查不可靠——人会忘记、会疲惫、会犯错。所以我们设计了"30 分钟巡查机制"，由商鞅 Agent 自动执行。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">核心设计原则</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>1. 自动化优先</strong>：能自动检查的绝不人工，减少人为疏漏。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>2. 分层检查</strong>：不同层级关注不同指标，避免信息过载。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>3. 异常驱动</strong>：正常状态静默，异常情况立即告警。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>4. 可追溯</strong>：所有检查结果记录在案，便于复盘分析。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">巡查内容</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            每 30 分钟，商鞅 Agent 会执行以下检查：
          </p>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">系统层检查</h3>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• OpenClaw Gateway 状态（运行中/停止/异常）</li>
            <li>• 节点连接状态（在线/离线/延迟）</li>
            <li>• 磁盘空间使用率（预警阈值 80%）</li>
            <li>• 内存使用情况</li>
          </ul>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">任务层检查</h3>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 进行中的子代理任务状态</li>
            <li>• 超时任务检测（超过预期时间 50%）</li>
            <li>• 失败任务统计与分类</li>
            <li>• 待处理任务队列长度</li>
          </ul>

          <h3 className="mt-6 text-xl font-medium text-zinc-900 dark:text-zinc-50">通信层检查</h3>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• Feishu API 可用性</li>
            <li>• 消息发送成功率</li>
            <li>• 未读消息数量（预警阈值 10）</li>
            <li>• 心跳响应状态</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">实现细节</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            巡查机制基于 cron 定时任务实现，每 30 分钟触发一次。核心流程如下：
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <ol className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">1</span>
                <span><strong>触发：</strong>Cron 定时任务唤醒商鞅 Agent</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">2</span>
                <span><strong>执行检查：</strong>按优先级依次执行各项检查</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">3</span>
                <span><strong>结果记录：</strong>将检查结果写入 comms/tasks/archive/inspection_{timestamp}.md</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">4</span>
                <span><strong>异常处理：</strong>如发现异常，立即通知诸葛亮并尝试自动修复</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">5</span>
                <span><strong>状态更新：</strong>更新全局状态文件，供其他 Agent 参考</span>
              </li>
            </ol>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">异常分级</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            不是所有异常都需要立即处理。我们设计了三级异常响应机制：
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">级别</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">响应时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">示例</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">处理方式</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400">P0 - 紧急</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">立即</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">Gateway 宕机、API 完全不可用</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">自动重启 + 人工通知</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-yellow-600 dark:text-yellow-400">P1 - 重要</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">&lt;1 小时</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">节点离线、任务失败率上升</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">记录 + 下次心跳处理</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">P2 - 一般</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">&lt;24 小时</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">磁盘空间预警、日志积累</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">记录 + 定期清理</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">自动修复策略</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            对于常见异常，商鞅会尝试自动修复：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• <strong>Gateway 无响应：</strong>尝试重启 Gateway 服务</li>
            <li>• <strong>节点离线：</strong>尝试重新连接，3 次失败后告警</li>
            <li>• <strong>API 限流：</strong>等待 Retry-After 后重试</li>
            <li>• <strong>任务超时：</strong>终止超时任务，记录失败原因</li>
            <li>• <strong>磁盘空间不足：</strong>清理临时文件和旧日志</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            自动修复有严格限制：只执行预定义的安全操作，不涉及数据删除、配置修改等高风险动作。所有自动修复操作都会记录日志。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">效果与迭代</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            运行一个月后，我们统计了巡查机制的效果：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 共执行巡查 1,440 次（30 分钟 × 48 次/天 × 30 天）</li>
            <li>• 发现异常 47 次，其中 P0 级 2 次，P1 级 12 次，P2 级 33 次</li>
            <li>• 自动修复成功 39 次，成功率 83%</li>
            <li>• 平均故障发现时间从小时级降至分钟级</li>
          </ul>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            基于这些数据，我们做了以下迭代：
          </p>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 调整了部分检查项的阈值，减少误报</li>
            <li>• 增加了新的检查项（如 API 响应时间）</li>
            <li>• 优化了自动修复策略，提高成功率</li>
            <li>• 添加了周报功能，汇总每周巡查结果</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">经验总结</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>1. 30 分钟是平衡点</strong>。太频繁会增加系统负担，太稀疏会漏掉问题。30 分钟对于大多数场景是合理的。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>2. 异常分级很重要</strong>。不是所有问题都需要立即处理，分级可以避免"狼来了"效应。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>3. 自动修复要谨慎</strong>。只做安全、可逆的操作，高风险动作必须人工确认。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>4. 记录是为了改进</strong>。巡查日志不仅是审计依据，更是优化系统的输入。
          </p>

          <div className="mt-12 rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              关键收获：
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 自动化巡查比人工检查更可靠</li>
              <li>• 异常分级避免告警疲劳</li>
              <li>• 自动修复要限制在安全范围内</li>
              <li>• 巡查日志是系统优化的宝贵输入</li>
              <li>• 30 分钟间隔适合大多数场景</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
