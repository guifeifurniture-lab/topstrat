/**
 * create-checkout.js
 * 创建 Lemon Squeezy 结账会话
 * 
 * 功能：
 * 1. 根据产品计划创建结账链接
 * 2. 预填用户邮箱
 * 3. 设置成功后的回调 URL
 */

const https = require('https');

// 配置
const CONFIG = {
    lemonSqueezy: {
        apiKey: process.env.LEMON_SQUEEZY_API_KEY,
        storeId: process.env.LEMON_SQUEEZY_STORE_ID
    },
    products: {
        starter: {
            variantId: process.env.LEMON_SQUEEZY_STARTER_VARIANT_ID,
            price: 79,
            name: 'Starter'
        },
        pro: {
            variantId: process.env.LEMON_SQUEEZY_PRO_VARIANT_ID,
            price: 199,
            name: 'Pro'
        }
    },
    urls: {
        success: process.env.CHECKOUT_SUCCESS_URL || 'https://voxyz.com/vault?success=true',
        cancel: process.env.CHECKOUT_CANCEL_URL || 'https://voxyz.com/vault?cancelled=true'
    }
};

/**
 * 创建 Lemon Squeezy Checkout
 */
async function createLemonSqueezyCheckout({ variantId, email, customData = {} }) {
    try {
        const requestBody = {
            data: {
                type: 'checkouts',
                attributes: {
                    product_options: {
                        enabled_variants: [variantId],
                        redirect_url: CONFIG.urls.success,
                        receipt_button_text: '访问谋士天团',
                        receipt_link_url: CONFIG.urls.success,
                        receipt_thank_you_note: '感谢购买谋士天团！请检查邮箱获取 GitHub 邀请。'
                    },
                    checkout_options: {
                        embed: false,
                        media: true,
                        logo: true
                    },
                    product_price: {
                        enabled: false
                    },
                    custom_price: null,
                    discount_codes: [],
                    custom_data: {
                        githubUsername: customData.githubUsername || '',
                        plan: customData.plan || 'starter'
                    }
                },
                relationships: {
                    store: {
                        data: {
                            type: 'stores',
                            id: CONFIG.lemonSqueezy.storeId
                        }
                    },
                    variant: {
                        data: {
                            type: 'variants',
                            id: variantId.toString()
                        }
                    }
                }
            }
        };
        
        // 如果有邮箱，添加到预填信息
        if (email) {
            requestBody.data.attributes.checkout_options.prefill = {
                email: email
            };
        }
        
        const response = await makeRequest({
            hostname: 'api.lemonsqueezy.com',
            path: '/v1/checkouts',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.lemonSqueezy.apiKey}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = JSON.parse(response);
        
        if (data.data && data.data.attributes.url) {
            return {
                success: true,
                checkoutUrl: data.data.attributes.url,
                checkoutId: data.data.id,
                expiresAt: data.data.attributes.expires_at
            };
        } else {
            throw new Error('Invalid response from Lemon Squeezy');
        }
    } catch (error) {
        console.error('Create checkout error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 主处理函数 - 创建结账
 */
async function handleCreateCheckout(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { plan, email, githubUsername } = req.body;
    
    // 验证参数
    if (!plan || !['starter', 'pro'].includes(plan)) {
        return res.status(400).json({ 
            error: '无效的计划类型',
            validPlans: ['starter', 'pro']
        });
    }
    
    if (!email) {
        return res.status(400).json({ 
            error: '邮箱是必需的'
        });
    }
    
    // 获取产品配置
    const productConfig = CONFIG.products[plan];
    
    if (!productConfig || !productConfig.variantId) {
        return res.status(500).json({ 
            error: '产品配置错误',
            plan: plan
        });
    }
    
    // 创建结账
    const result = await createLemonSqueezyCheckout({
        variantId: productConfig.variantId,
        email: email,
        customData: {
            githubUsername: githubUsername || '',
            plan: plan
        }
    });
    
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
}

/**
 * 辅助函数 - 发送 HTTPS 请求
 */
function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

// 导出处理函数
module.exports = {
    handleCreateCheckout,
    createLemonSqueezyCheckout
};
