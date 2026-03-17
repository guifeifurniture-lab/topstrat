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
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">团队</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">AI Agent</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">创业</span>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            《谋士天团 7 天诞生记》
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            从 0 到 1 组建 AI 谋士团队的完整过程，包括技术选型、架构设计和团队协作机制的建立。
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">第一天：灵光一闪</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            一切始于一个简单的问题：如果古代谋士能活在现代，他们会用什么工具？诸葛亮会用 AI 分析战局，商鞅会用自动化系统执行变法，孔子会用群聊管理弟子——这个想法让我们兴奋不已。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            当晚，我们确定了技术栈：Next.js 15 作为前端框架，OpenClaw 作为 Agent 运行时，Feishu 作为协作平台。目标很明确：打造一个能够真正辅助决策的 AI 谋士团队。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">第二至三天：架构设计</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            我们采用了"三层记忆系统"：全局共享层存储项目总目标和技术约束，角色私有层让每个 Agent 有自己的技能和经验，任务暂存层处理执行中的临时状态。这个设计灵感来自人类的记忆机制——短期记忆、长期记忆和工作记忆。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            技术选型上，我们坚持"简单优先"原则。能用文件系统解决的不用数据库，能用 Markdown 的不用复杂格式。这不仅降低了开发成本，更重要的是让 Agent 能够直接读写和理解所有数据。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">第四至五天：角色创建</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            第一批谋士角色包括：诸葛亮（总 strategist）、商鞅（执行与变法）、孔子（教育与协调）。每个角色都有独特的 SKILL.md 文件定义其行为模式和专业领域。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            诸葛亮的技能是全局协调和战略规划，商鞅专注于自动化工作流和制度设计，孔子负责知识沉淀和团队沟通。这种分工让团队能够覆盖从战略到执行的完整链条。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">第六天：通信机制</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            最关键的挑战是如何让多个 Agent 高效协作。我们设计了"心跳机制"——每个 Agent 定期报告状态，诸葛亮作为中枢负责协调和任务分发。同时，群聊广播模式确保重要信息能够同步给所有相关成员。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            通信协议基于 Feishu 的 API，支持文本、文件、任务等多种形式。我们还实现了"子代理"机制，复杂任务可以拆解并派发给专门的子代理处理。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">第七天：首次实战</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            第七天，我们进行了第一次真实任务测试：分析一个开源项目的 Issue 并生成修复方案。诸葛亮负责整体规划，商鞅执行代码审查，孔子整理文档。整个过程耗时 2 小时，完成了原本需要半天的工作。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            这次测试验证了架构的可行性，也暴露了一些问题：任务拆解不够精细、通信偶尔延迟、记忆同步机制需要优化。但最重要的是，我们证明了这个方向是值得继续投入的。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">后续迭代</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            7 天诞生只是开始。接下来我们会持续优化：增加更多谋士角色（如孙子兵法专家、现代管理顾问）、完善记忆系统、提升通信效率、扩展应用场景。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            这个项目的核心理念是：AI 不是替代人类，而是增强人类。谋士天团的目标是成为每个人的"外脑"，帮助处理信息、分析问题、提供建议，最终决策权始终在人类手中。
          </p>

          <div className="mt-12 rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              关键收获：
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 简单架构胜过复杂设计——文件系统 + Markdown 足够强大</li>
              <li>• 角色分工要明确，每个 Agent 有清晰的专业领域</li>
              <li>• 通信机制是协作的核心，需要精心设计</li>
              <li>• 快速验证比完美规划更重要——7 天出 MVP</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
