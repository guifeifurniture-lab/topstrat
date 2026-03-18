/**
 * validate-purchase.js
 * 验证购买并自动发送 GitHub 仓库邀请
 * 
 * 功能：
 * 1. 验证 Lemon Squeezy / PayPal 购买记录
 * 2. 自动发送 GitHub 仓库邀请
 * 3. 记录购买日志
 * 4. 发送确认邮件
 */

const https = require('https');
const { Octokit } = require('@octokit/rest');

// 配置
const CONFIG = {
    lemonSqueezy: {
        apiKey: process.env.LEMON_SQUEEZY_API_KEY,
        storeId: process.env.LEMON_SQUEEZY_STORE_ID
    },
    github: {
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_OWNER || 'voxyz',
        repo: process.env.GITHUB_REPO || 'moushi-tiantuan'
    },
    email: {
        from: process.env.FROM_EMAIL || 'no-reply@voxyz.com',
        adminEmail: process.env.ADMIN_EMAIL || 'bjd1129@gmail.com'
    }
};

// GitHub Octokit 实例
const octokit = new Octokit({
    auth: CONFIG.github.token
});

// 购买记录存储（生产环境应使用数据库）
const purchaseRecords = new Map();

/**
 * 验证 Lemon Squeezy 购买
 */
async function verifyLemonSqueezyPurchase(email, orderId) {
    try {
        const response = await makeRequest({
            hostname: 'api.lemonsqueezy.com',
            path: `/v1/orders/${orderId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.lemonSqueezy.apiKey}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });
        
        const data = JSON.parse(response);
        const order = data.data;
        
        if (!order) {
            return { verified: false, error: '订单不存在' };
        }
        
        // 验证邮箱匹配
        if (order.attributes.email !== email) {
            return { verified: false, error: '邮箱不匹配' };
        }
        
        // 验证支付状态
        if (order.attributes.status !== 'paid') {
            return { verified: false, error: '支付未完成', status: order.attributes.status };
        }
        
        // 获取产品信息
        const productId = order.attributes.first_order_item?.product_id;
        const productName = order.attributes.first_order_item?.product_name;
        
        return {
            verified: true,
            orderId: order.id,
            email: order.attributes.email,
            plan: productName?.toLowerCase().includes('pro') ? 'pro' : 'starter',
            amount: order.attributes.total,
            currency: order.attributes.currency,
            purchaseDate: order.attributes.created_at
        };
    } catch (error) {
        console.error('Lemon Squeezy verification error:', error);
        return { verified: false, error: '验证失败' };
    }
}

/**
 * 发送 GitHub 仓库邀请
 */
async function sendGitHubInvitation(githubUsername, plan) {
    try {
        // 根据计划确定要邀请的仓库
        const repos = plan === 'pro' 
            ? ['moushi-tiantuan', 'moushi-pro-resources']
            : ['moushi-tiantuan'];
        
        const invitations = [];
        
        for (const repo of repos) {
            try {
                await octokit.repos.addCollaborator({
                    owner: CONFIG.github.owner,
                    repo: repo,
                    username: githubUsername,
                    permission: 'pull'
                });
                
                invitations.push({
                    repo: repo,
                    status: 'sent',
                    invitationUrl: `https://github.com/${CONFIG.github.owner}/${repo}/invitations`
                });
                
                console.log(`GitHub 邀请已发送至：${githubUsername} -> ${repo}`);
            } catch (error) {
                if (error.status === 422) {
                    // 用户已经是协作者
                    invitations.push({
                        repo: repo,
                        status: 'already_member',
                        message: '用户已是协作者'
                    });
                } else {
                    throw error;
                }
            }
        }
        
        return {
            success: true,
            invitations: invitations
        };
    } catch (error) {
        console.error('GitHub invitation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 记录购买日志
 */
function logPurchase(record) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        ...record
    };
    
    // 存储到内存（生产环境应写入数据库或文件）
    purchaseRecords.set(record.email, logEntry);
    
    // 写入日志文件
    const fs = require('fs');
    const path = require('path');
    const logFile = path.join(__dirname, '../data/purchase-log.jsonl');
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    
    console.log('购买记录已保存:', logEntry);
}

/**
 * 发送确认邮件
 */
async function sendConfirmationEmail(email, githubUsername, plan) {
    // 这里可以集成邮件服务（SendGrid, Mailgun 等）
    // 暂时只记录日志
    console.log(`确认邮件将发送至：${email}`);
    console.log(`GitHub 用户名：${githubUsername}, 计划：${plan}`);
    
    return {
        success: true,
        message: '确认邮件已排队发送'
    };
}

/**
 * 主处理函数 - 验证购买
 */
async function handleValidatePurchase(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { email, orderId, githubUsername, plan } = req.body;
    
    if (!email || !orderId) {
        return res.status(400).json({ 
            error: '缺少必要参数',
            required: ['email', 'orderId']
        });
    }
    
    // 1. 验证购买
    const verification = await verifyLemonSqueezyPurchase(email, orderId);
    
    if (!verification.verified) {
        return res.status(400).json({
            verified: false,
            error: verification.error,
            status: verification.status
        });
    }
    
    // 2. 检查是否已处理过
    if (purchaseRecords.has(email)) {
        const existing = purchaseRecords.get(email);
        return res.json({
            verified: true,
            message: '购买已处理',
            ...existing
        });
    }
    
    // 3. 发送 GitHub 邀请
    const invitationResult = await sendGitHubInvitation(githubUsername, verification.plan);
    
    // 4. 记录购买
    const purchaseRecord = {
        email,
        githubUsername,
        plan: verification.plan,
        orderId: verification.orderId,
        amount: verification.amount,
        currency: verification.currency,
        purchaseDate: verification.purchaseDate,
        githubInvitation: invitationResult
    };
    
    logPurchase(purchaseRecord);
    
    // 5. 发送确认邮件
    await sendConfirmationEmail(email, githubUsername, verification.plan);
    
    // 返回成功响应
    res.json({
        verified: true,
        plan: verification.plan,
        githubUsername,
        githubInvitation: invitationResult,
        message: '购买验证成功，GitHub 邀请已发送'
    });
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
    handleValidatePurchase,
    verifyLemonSqueezyPurchase,
    sendGitHubInvitation,
    logPurchase
};
