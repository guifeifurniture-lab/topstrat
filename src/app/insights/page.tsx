import Link from "next/link";

const articles = [
  {
    slug: "谋士天团 7 天诞生记",
    title: "《谋士天团 7 天诞生记》",
    excerpt: "从 0 到 1 组建 AI 谋士团队的完整过程，包括技术选型、架构设计和团队协作机制的建立。",
    date: "2026-03-18",
    tags: ["团队", "AI Agent", "创业"],
  },
  {
    slug: "为什么我们放弃家具复刻转向 AI Agent",
    title: "《为什么我们放弃家具复刻转向 AI Agent》",
    excerpt: "一次战略转型的深度复盘，讲述我们如何从硬件复刻转向 AI Agent 开发的决策过程。",
    date: "2026-03-18",
    tags: ["战略", "转型", "AI Agent"],
  },
  {
    slug: "openclaw-技能安装的 10 个坑",
    title: "《OpenClaw 技能安装的 10 个坑》",
    excerpt: "实战经验总结，盘点 OpenClaw 技能安装过程中最容易踩的 10 个坑及其解决方案。",
    date: "2026-03-18",
    tags: ["OpenClaw", "实战", "经验"],
  },
  {
    slug: "商鞅的 30 分钟巡查机制设计",
    title: "《商鞅的 30 分钟巡查机制设计》",
    excerpt: "揭秘我们如何设计高效的自动巡查工作流，确保系统稳定运行的核心机制。",
    date: "2026-03-18",
    tags: ["工作流", "自动化", "机制设计"],
  },
  {
    slug: "诸葛亮的群聊广播模式",
    title: "《诸葛亮的群聊广播模式》",
    excerpt: "深度解析多 Agent 协调机制，如何通过群聊广播实现高效的信息同步和任务分发。",
    date: "2026-03-18",
    tags: ["协调机制", "多 Agent", "通信"],
  },
];

export default function Insights() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Insights
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            深度文章、技术分享和团队思考
          </p>
        </header>

        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <Link href={`/insights/${article.slug}`} className="absolute inset-0 z-10" />
              <div className="relative z-20">
                <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <time dateTime={article.date}>{article.date}</time>
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                  {article.title}
                </h2>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  阅读全文
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
