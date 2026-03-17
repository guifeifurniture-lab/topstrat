import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              每个人都教你安装。
              <span className="block mt-2 text-gray-600 dark:text-gray-400">
                这是安装之后发生的事。
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              六个月后，当模型变得两倍聪明时，它们不需要重新认识你。
              从今天开始，构建属于你的 AI 公司。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#get-started"
                className="rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                开始构建
              </a>
              <a
                href="#demo"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              >
                查看演示 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                老庄的 7 天 AI 公司实验
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                "我只是想看看，一个普通人能不能在 7 天内用 AI 创建一家公司。"
              </p>
              <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-400">
                <p>
                  第一天，我安装了工具。第二天，我训练了第一个模型。第三天，它开始理解我的工作方式。
                </p>
                <p>
                  第五天，我有了第一个客户。第七天，公司开始盈利。
                </p>
                <p>
                  这不是魔法，这是可复制的过程。现在，你也可以做到。
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800">
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <span className="text-sm">创始人照片占位符</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              从安装到盈利的全过程
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              每一步都清晰可见，每一个里程碑都可达成
            </p>
          </div>
          <div className="mt-16">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-800" />
              
              {/* Timeline items */}
              <div className="space-y-12">
                {/* Day 1 */}
                <div className="relative flex items-center justify-between">
                  <div className="hidden w-5/12 text-right md:block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 1 天：安装</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      一键部署，5 分钟内完成环境配置
                    </p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                    <div className="h-3 w-3 rounded-full bg-white dark:bg-gray-900" />
                  </div>
                  <div className="w-5/12 md:hidden">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 1 天：安装</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      一键部署，5 分钟内完成环境配置
                    </p>
                  </div>
                </div>

                {/* Day 2-3 */}
                <div className="relative flex items-center justify-between">
                  <div className="hidden w-5/12 md:block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 2-3 天：训练</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      导入你的数据，让模型理解你的业务
                    </p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                    <div className="h-3 w-3 rounded-full bg-white dark:bg-gray-900" />
                  </div>
                  <div className="w-5/12 md:hidden">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 2-3 天：训练</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      导入你的数据，让模型理解你的业务
                    </p>
                  </div>
                </div>

                {/* Day 4-5 */}
                <div className="relative flex items-center justify-between">
                  <div className="hidden w-5/12 text-right md:block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 4-5 天：测试</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      与真实用户互动，收集反馈并迭代
                    </p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                    <div className="h-3 w-3 rounded-full bg-white dark:bg-gray-900" />
                  </div>
                  <div className="w-5/12 md:hidden">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 4-5 天：测试</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      与真实用户互动，收集反馈并迭代
                    </p>
                  </div>
                </div>

                {/* Day 6-7 */}
                <div className="relative flex items-center justify-between">
                  <div className="hidden w-5/12 md:block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 6-7 天：盈利</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      获得第一个付费客户，开始产生收入
                    </p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                    <div className="h-3 w-3 rounded-full bg-white" />
                  </div>
                  <div className="w-5/12 md:hidden">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">第 6-7 天：盈利</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      获得第一个付费客户，开始产生收入
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              加入我们的社区
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              数百名创业者已经开始了他们的 AI 公司之旅
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-3xl bg-white dark:bg-gray-800 px-8 py-10 text-center shadow-sm">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="mt-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">活跃用户</div>
            </div>
            <div className="rounded-3xl bg-white dark:bg-gray-800 px-8 py-10 text-center shadow-sm">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">1,200+</div>
              <div className="mt-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">AI 项目</div>
            </div>
            <div className="rounded-3xl bg-white dark:bg-gray-800 px-8 py-10 text-center shadow-sm">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">98%</div>
              <div className="mt-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-gray-900 px-8 py-16 text-center dark:bg-white">
            <h2 className="text-3xl font-bold tracking-tight text-white dark:text-gray-900">
              准备好开始了吗？
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-300 dark:text-gray-600">
              今天就开始构建你的 AI 公司。7 天后，你会感谢现在的自己。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#get-started"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                开始构建
              </a>
              <a
                href="#demo"
                className="text-sm font-semibold leading-6 text-white dark:text-gray-900 hover:text-gray-200 dark:hover:text-gray-700"
              >
                查看演示 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-between">
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              © 2026 TopStrat. All rights reserved.
            </p>
            <div className="flex gap-x-6">
              <a href="#" className="text-sm leading-6 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                隐私政策
              </a>
              <a href="#" className="text-sm leading-6 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                条款
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
