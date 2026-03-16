// 微信支付确认 API
// 用于接收用户扫码支付后的确认通知

const express = require('express');
const router = express.Router();

// 存储支付记录（生产环境应使用数据库）
const paymentRecords = [];

// 配置
const CONFIG = {
  MERCHANT_NAME: 'Michael 经营账户',
  CONTACT_EMAIL: 'voxyz.developer@gmail.com',
  ADMIN_EMAIL: 'bjd1129@gmail.com'
};

/**
 * POST /api/wechat/confirm
 * 用户确认已完成微信支付
 */
router.post('/confirm', async (req, res) => {
  try {
    const { plan, product, amount, currency, paymentMethod, timestamp } = req.body;
    
    // 创建支付记录
    const record = {
      id: `wechat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      plan,
      product,
      amount,
      currency,
      paymentMethod,
      status: 'pending_verification', // 待验证
      timestamp,
      createdAt: new Date().toISOString()
    };
    
    paymentRecords.push(record);
    
    console.log('收到微信支付确认:', record);
    
    // TODO: 发送邮件通知管理员
    // await sendAdminNotification(record);
    
    // TODO: 发送确认邮件给用户
    // await sendConfirmationEmail(userEmail, record);
    
    res.json({
      success: true,
      orderId: record.id,
      message: '支付确认已收到，正在验证中'
    });
  } catch (error) {
    console.error('微信支付确认失败:', error);
    res.status(500).json({
      success: false,
      message: '处理失败，请联系管理员'
    });
  }
});

/**
 * GET /api/wechat/records
 * 获取支付记录（管理员专用）
 */
router.get('/records', async (req, res) => {
  // TODO: 添加管理员认证
  res.json({
    success: true,
    records: paymentRecords
  });
});

/**
 * 发送邮件通知管理员
 */
async function sendAdminNotification(record) {
  // TODO: 实现邮件发送逻辑
  console.log('发送邮件通知管理员:', {
    to: CONFIG.ADMIN_EMAIL,
    subject: `新微信支付订单 - ${record.product.name}`,
    body: `
      新微信支付订单详情：
      - 订单 ID: ${record.id}
      - 产品：${record.product.name}
      - 金额：¥${record.amount}
      - 时间：${record.timestamp}
      
      请验证收款后添加 GitHub Collaborator 权限。
    `
  });
}

/**
 * 发送确认邮件给用户
 */
async function sendConfirmationEmail(userEmail, record) {
  // TODO: 实现邮件发送逻辑
  console.log('发送确认邮件给用户:', {
    to: userEmail,
    subject: '支付确认 - 谋士天团',
    body: `
      感谢您的支付！
      
      订单详情：
      - 订单 ID: ${record.id}
      - 产品：${record.product.name}
      - 金额：¥${record.amount}
      
      我们将在验证收款后为您添加 GitHub Collaborator 权限。
      如有问题，请联系 ${CONFIG.CONTACT_EMAIL}
    `
  });
}

module.exports = router;
