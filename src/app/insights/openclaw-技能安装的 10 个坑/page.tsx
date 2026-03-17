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
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">OpenClaw</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">实战</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">经验</span>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            《OpenClaw 技能安装的 10 个坑》
          </h1>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            实战经验总结，盘点 OpenClaw 技能安装过程中最容易踩的 10 个坑及其解决方案。
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">前言</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            在搭建谋士天团的过程中，我们安装了数十个 OpenClaw 技能。这个过程踩了不少坑，也积累了宝贵经验。本文总结了最常见的 10 个问题，希望能帮你少走弯路。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 1：权限配置错误</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能安装后无法访问 Feishu API，报错"permission denied"。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>OpenClaw 的权限配置在 feishu_app_scopes 中定义，但很多技能文档没有明确说明需要哪些权限。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>安装技能前，先用 <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-900">feishu_app_scopes</code> 查看当前权限，对照技能的 SKILL.md 检查是否缺失。如有缺失，需要在 Feishu 开发者后台申请对应权限。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 2：工作目录混淆</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能文件创建到了错误的位置，导致 Agent 无法加载。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>OpenClaw 有全局 workspace 和本地项目目录之分。技能应该安装在全局 workspace（~/.openclaw/workspace-xxx），而不是具体项目目录。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>始终确认当前工作目录。可以用 <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-900">session_status</code> 查看当前 workspace 路径。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 3：SKILL.md 格式错误</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能安装后不生效，没有报错但也不执行。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>SKILL.md 的 description 字段描述不准确，导致 Agent 无法正确匹配触发条件。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>description 要具体明确，包含触发关键词。例如"Feishu document read/write operations"比"Feishu 操作"更好。参考官方技能的描述格式。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 4：工具调用冲突</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>多个技能都定义了相似功能，Agent 不知道该用哪个。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>技能之间的职责边界不清晰，导致功能重叠。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>安装技能前先检查已有技能的 description，避免功能重复。如有冲突，优先保留更具体、维护更活跃的技能。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 5：依赖缺失</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能执行时报错，提示缺少某个 CLI 工具或 API。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>某些技能依赖外部工具（如 gh CLI、claude CLI），但这些工具没有预先安装。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>仔细阅读 SKILL.md 的 prerequisites 部分，提前安装所有依赖。在 TOOLS.md 中记录已安装的工具及其路径。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 6：认证过期</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能之前能用，突然不能用了，报认证错误。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>Feishu API Token 或其他认证凭证过期。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>定期检查认证状态，设置到期提醒。建议在心跳机制中加入认证检查，过期前自动续期。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 7：技能版本不兼容</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>从 clawhub 安装的技能与当前 OpenClaw 版本不兼容。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>技能是为旧版本或新版本 OpenClaw 编写的，API 有变化。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>优先安装标注了"latest"或与你版本匹配的技能。如遇问题，检查技能的更新时间，必要时联系作者或自行修改适配。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 8：路径解析错误</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能中引用的文件路径不存在，尤其是在 Windows 系统上。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>路径分隔符问题（/ vs \）或相对路径解析错误。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>技能中使用绝对路径或正确解析的相对路径。Windows 系统注意转义反斜杠。参考 SKILL.md 中关于路径处理的说明。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 9：并发限制</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>批量操作时遇到 API 限流，部分请求失败。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>Feishu API 有速率限制，短时间内大量请求会被限流。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>技能设计时考虑限流，实现重试机制和请求间隔。批量操作时优先用"少次大批量"而非"多次小批量"。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">坑 10：调试困难</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>问题：</strong>技能执行失败，但错误信息不清晰，难以定位问题。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>原因：</strong>错误被多层封装，原始错误信息丢失。
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            <strong>解决方案：</strong>在技能中添加详细的日志输出。调试时临时增加 verbose 模式，打印中间状态。善用 exec 工具直接调用底层 API 验证。
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">最佳实践总结</h2>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• 安装前：检查依赖、权限、兼容性</li>
            <li>• 安装时：确认工作目录、路径格式</li>
            <li>• 安装后：测试基本功能、记录配置</li>
            <li>• 维护中：定期检查认证、更新技能、监控错误</li>
          </ul>

          <div className="mt-12 rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              关键收获：
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• 权限配置是首要检查项</li>
              <li>• 工作目录要清晰，全局 vs 本地别混淆</li>
              <li>• SKILL.md 描述要具体，便于 Agent 匹配</li>
              <li>• 提前安装依赖，避免执行时报错</li>
              <li>• 批量操作考虑限流，实现重试机制</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
