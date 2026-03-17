"use client";

import { useState } from "react";

export default function VaultPricing() {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | null>(null);

  const starterPrice = 599;
  const proPrice = 1599;
  const savings = proPrice - starterPrice; // ¥1000

  const handlePurchase = (plan: "starter" | "pro") => {
    setSelectedPlan(plan);
    // TODO: 集成支付逻辑
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
              VoxYZ
            </a>
            <div className="flex items-center gap-6">
              <a href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                首页
              </a>
              <a href="/vault" className="text-sm font-medium text-zinc-900 dark:text-white">
                Vault
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Vault 定价
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            选择适合您的谋士智能方案，解锁完整的战略规划能力
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Starter Plan */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 p-8 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Starter 谋士版
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                基础战略规划工具包
              </p>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">¥{starterPrice}</span>
              <span className="text-zinc-500 dark:text-zinc-500 ml-2">/ 一次性</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">谋士模板库</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">工作流剧本</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">Demo 示例</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">社区访问</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchase("starter")}
              className="w-full py-3 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              购买 Starter 版
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-900 dark:border-white p-8">
            <div className="absolute -top-4 right-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-1 rounded-full text-sm font-medium">
              推荐
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Pro 军师版
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                完整战略规划系统
              </p>
            </div>
            
            <div className="mb-2">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">¥{proPrice}</span>
              <span className="text-zinc-500 dark:text-zinc-500 ml-2">/ 一次性</span>
            </div>
            <div className="mb-6">
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                节省 ¥{savings}（相比单独购买）
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong>包含 Starter 版所有内容</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">对抗层系统</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">记忆系统</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">生产工作流</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">运维手册</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">Dashboard 仪表盘</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchase("pro")}
              className="w-full py-3 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              购买 Pro 版
            </button>
          </div>
        </div>

        {/* Upgrade Notice */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-6 text-center">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              已拥有 Starter 版？
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              补差价 <strong className="text-zinc-900 dark:text-white">¥{savings}</strong> 即可升级至 Pro 版，解锁全部功能
            </p>
            <button
              onClick={() => handlePurchase("pro")}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white hover:underline"
            >
              立即升级
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Payment Guide */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-8">
            购买流程
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-white mb-2">选择方案</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                根据需求选择 Starter 或 Pro 版
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-white mb-2">完成支付</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                支持微信、支付宝等多种支付方式
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-white mb-2">获取访问</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                支付成功后立即解锁全部内容
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-8">
            常见问题
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="购买后如何获取访问权限？"
              answer="支付成功后，系统将自动发送访问凭证到您提供的邮箱。同时您也可以在个人账户页面查看已购买的内容。"
            />
            <FAQItem
              question="支持退款吗？"
              answer="我们提供 7 天无理由退款服务。如果您对内容不满意，可在购买后 7 天内联系客服申请全额退款。"
            />
            <FAQItem
              question="Starter 版和 Pro 版有什么区别？"
              answer="Starter 版包含基础的谋士模板库、工作流剧本、Demo 示例和社区访问。Pro 版在 Starter 版基础上增加了抗层系统、记忆系统、生产工作流、运维手册和 Dashboard 仪表盘，适合需要完整战略规划系统的用户。"
            />
            <FAQItem
              question="如何从 Starter 版升级到 Pro 版？"
              answer="已购买 Starter 版的用户只需补差价 ¥1000 即可升级至 Pro 版。点击页面上的"立即升级"按钮，系统将自动计算差价并完成升级。"
            />
            <FAQItem
              question="购买后可以永久使用吗？"
              answer="是的，一次性购买后永久使用。我们会持续更新内容，所有已购买用户均可免费获取后续更新。"
            />
            <FAQItem
              question="支持企业批量采购吗？"
              answer="支持。如需企业批量采购或定制方案，请联系客服获取企业报价。"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2026 VoxYZ. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                服务条款
              </a>
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                隐私政策
              </a>
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                联系客服
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Modal (placeholder) */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              购买 {selectedPlan === "starter" ? "Starter" : "Pro"} 版
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              支付金额：<span className="font-bold text-zinc-900 dark:text-white">
                ¥{selectedPlan === "starter" ? starterPrice : proPrice}
              </span>
            </p>
            <div className="space-y-3 mb-6">
              <button className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.8 15.3c-.2-.1-.3-.3-.3-.5 0-.3.2-.5.5-.5h2.6c.3 0 .5.2.5.5 0 .2-.1.4-.3.5-.4.2-.9.3-1.4.3s-1.1-.1-1.6-.3zm7.7-2.1c0-.3-.2-.5-.5-.5h-2.6c-.3 0-.5.2-.5.5 0 .2.1.4.3.5.5.2 1 .3 1.6.3.5 0 1-.1 1.4-.3.2-.1.3-.3.3-.5z"/>
                </svg>
                微信支付
              </button>
              <button className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.003 2.007c-5.52 0-9.996 4.476-9.996 9.996 0 4.97 3.623 9.093 8.364 9.876.413.083.566-.175.566-.39 0-.194-.007-.708-.01-1.39-2.295.498-2.777-1.108-2.777-1.108-.375-.953-.917-1.207-.917-1.207-.75-.513.056-.503.056-.503.828.058 1.266.85 1.266.85.738 1.264 1.935.898 2.407.685.074-.535.289-.898.525-1.105-1.834-.208-3.762-.916-3.762-.916s-.953-.543.068-.533c0 0 1.05.068 1.608 1.088.93.543 1.58.773 1.843.773.263 0 .913-.23 1.843-.773.558-1.02 1.608-1.088 1.608-1.088 1.02-.01.068.533.068.533s-1.928.708-3.762.916c.236.207.45.57.525 1.105.472.213 1.669.579 2.407-.685 0 0 .438-.792 1.266-.85 0 0 .102-.01.056.503 0 0-.542.254-.917 1.207 0 0-.482 1.606 2.213 1.108-.003.682-.01 1.196-.01 1.39 0 .215.153.473.566.39 4.741-.783 8.364-4.906 8.364-9.876 0-5.52-4.476-9.996-9.996-9.996z"/>
                </svg>
                支付宝
              </button>
            </div>
            <button
              onClick={() => setSelectedPlan(null)}
              className="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-zinc-900 dark:text-white">{question}</span>
        <svg
          className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-zinc-600 dark:text-zinc-400">{answer}</p>
        </div>
      )}
    </div>
  );
}
