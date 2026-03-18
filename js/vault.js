// Vault.js - 支付集成和购买流程
// 支持 Lemon Squeezy 和 PayPal 支付

// Lemon Squeezy 配置
const LEMON_SQUEEZY_CONFIG = {
    starterProductId: 'starter-79',  // $79 Starter
    proProductId: 'pro-199',         // $199 Pro
    storeId: 'your-store-id',        // 替换为实际 store ID
    apiKey: 'your-api-key'           // 替换为实际 API key
};

// 初始化 Lemon Squeezy
function initLemonSqueezy() {
    const script = document.createElement('script');
    script.src = 'https://assets.lemonsqueezy.com/lemon.js';
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => {
        console.log('Lemon Squeezy loaded');
        setupCheckoutButtons();
    };
}

// 设置结账按钮
function setupCheckoutButtons() {
    const starterBtn = document.querySelector('button[data-plan="starter"]');
    const proBtn = document.querySelector('button[data-plan="pro"]');
    
    if (starterBtn) {
        starterBtn.addEventListener('click', () => {
            initiateCheckout('starter');
        });
    }
    
    if (proBtn) {
        proBtn.addEventListener('click', () => {
            initiateCheckout('pro');
        });
    }
}

// 发起结账流程
async function initiateCheckout(plan) {
    const email = prompt('请输入你的邮箱地址（用于接收购买确认和 GitHub 邀请）:');
    if (!email || !validateEmail(email)) {
        alert('请输入有效的邮箱地址');
        return;
    }
    
    const githubUsername = prompt('请输入你的 GitHub 用户名（用于自动发送仓库邀请）:');
    if (!githubUsername) {
        alert('GitHub 用户名是必需的');
        return;
    }
    
    try {
        // 创建结账会话
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plan: plan,
                email: email,
                githubUsername: githubUsername
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.checkoutUrl) {
            // 打开 Lemon Squeezy 结账页面
            window.LemonSqueezy.Url.Open(data.checkoutUrl);
            
            // 存储用户信息以便结账后验证
            sessionStorage.setItem('pendingPurchase', JSON.stringify({
                plan: plan,
                email: email,
                githubUsername: githubUsername,
                timestamp: Date.now()
            }));
        } else {
            throw new Error(data.error || '创建结账失败');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('支付系统暂时不可用，请稍后重试或联系 support@voxyz.com');
    }
}

// 验证邮箱格式
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 检查支付状态（页面加载时）
async function checkPaymentStatus() {
    const pendingPurchase = sessionStorage.getItem('pendingPurchase');
    if (!pendingPurchase) return;
    
    try {
        const purchaseData = JSON.parse(pendingPurchase);
        
        // 如果超过 30 分钟，清除待处理记录
        if (Date.now() - purchaseData.timestamp > 30 * 60 * 1000) {
            sessionStorage.removeItem('pendingPurchase');
            return;
        }
        
        // 验证购买状态
        const response = await fetch('/api/validate-purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: purchaseData.email,
                plan: purchaseData.plan
            })
        });
        
        const data = await response.json();
        
        if (data.verified) {
            // 购买成功
            sessionStorage.removeItem('pendingPurchase');
            showSuccessMessage(data);
        }
    } catch (error) {
        console.error('Payment status check error:', error);
    }
}

// 显示成功消息
function showSuccessMessage(data) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">购买成功！</h2>
            <p class="text-gray-600 mb-4">感谢购买 ${data.plan.toUpperCase()} 计划</p>
            <p class="text-sm text-gray-500 mb-6">
                GitHub 仓库邀请已发送至：<br>
                <span class="font-medium">${data.githubUsername}</span>
            </p>
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                好的
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// PayPal 备用支付（如果需要）
function initPayPal() {
    // PayPal 已集成在 api/paypal/ 目录
    // 这里可以添加 PayPal 按钮的初始化逻辑
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    initLemonSqueezy();
    checkPaymentStatus();
});

// 导出函数供外部使用
window.VaultCheckout = {
    initiateCheckout,
    checkPaymentStatus
};
