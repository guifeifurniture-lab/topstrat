// PayPal Webhook Handler
// 接收 PayPal 支付事件通知

const crypto = require('crypto');
const https = require('https');

const PAYPAL_CONFIG = {
  WEBHOOK_ID: 'YOUR_WEBHOOK_ID', // 在 PayPal Dashboard 创建 Webhook 后获取
  CLIENT_ID: 'YOUR_PRODUCTION_CLIENT_ID',
  CLIENT_SECRET: 'YOUR_PRODUCTION_CLIENT_SECRET'
};

// 验证 Webhook 签名
function verifyWebhookSignature(req, body, signature) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${PAYPAL_CONFIG.CLIENT_ID}:${PAYPAL_CONFIG.CLIENT_SECRET}`).toString('base64');
    
    const verificationData = {
      auth_algo: signature['PAYPAL-AUTH-ALGO'],
      transmission_id: signature['PAYPAL-TRANSMISSION-ID'],
      cert_url: signature['PAYPAL-CERT-URL'],
      transmission_sig: signature['PAYPAL-TRANSMISSION-SIG'],
      transmission_time: signature['PAYPAL-TRANSMISSION-TIME'],
      webhook_id: PAYPAL_CONFIG.WEBHOOK_ID,
      webhook_event: JSON.parse(body.toString())
    };
    
    const data = JSON.stringify(verificationData);
    
    const options = {
      hostname: 'api-m.paypal.com',
      port: 443,
      path: '/v1/notifications/verify-webhook-signature',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(responseData);
          resolve(result.verification_status === 'SUCCESS');
        } else {
          reject(new Error(`验证失败：${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 处理 Webhook 事件
async function handleWebhook(req, res) {
  try {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        // 获取签名头
        const signature = {
          'PAYPAL-AUTH-ALGO': req.headers['paypal-auth-algo'],
          'PAYPAL-TRANSMISSION-ID': req.headers['paypal-transmission-id'],
          'PAYPAL-CERT-URL': req.headers['paypal-cert-url'],
          'PAYPAL-TRANSMISSION-SIG': req.headers['paypal-transmission-sig'],
          'PAYPAL-TRANSMISSION-TIME': req.headers['paypal-transmission-time']
        };
        
        // 验证签名
        const isValid = await verifyWebhookSignature(req, body, signature);
        
        if (!isValid) {
          console.error('Webhook 签名验证失败');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid signature' }));
          return;
        }
        
        // 解析事件
        const event = JSON.parse(body);
        const eventType = event.event_type;
        
        console.log('收到 PayPal Webhook 事件:', eventType);
        
        // 处理不同类型的事件
        switch (eventType) {
          case 'PAYMENT.CAPTURE.COMPLETED':
            await handlePaymentCompleted(event);
            break;
          case 'PAYMENT.CAPTURE.DENIED':
          case 'PAYMENT.CAPTURE.REFUNDED':
            await handlePaymentIssue(event);
            break;
          case 'CHECKOUT.ORDER.APPROVED':
            await handleOrderApproved(event);
            break;
          default:
            console.log('未处理的事件类型:', eventType);
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
        
      } catch (error) {
        console.error('Webhook 处理错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '服务器错误' }));
  }
}

// 处理支付完成事件
async function handlePaymentCompleted(event) {
  const capture = event.resource;
  
  console.log('✓ 支付完成:', {
    captureID: capture.id,
    amount: capture.amount?.value,
    currency: capture.amount?.currency_code,
    payerEmail: capture.payer?.email_address,
    timestamp: new Date().toISOString()
  });
  
  // TODO: 执行后续操作
  // 1. 更新订单状态
  // 2. 发送确认邮件给买家
  // 3. 通知管理员（诸葛亮）添加 GitHub Collaborator
  // 4. 记录交易日志
  
  // 示例：发送通知邮件
  // await sendConfirmationEmail(capture);
  
  // 示例：通知管理员
  // await notifyAdmin(capture);
}

// 处理支付问题事件
async function handlePaymentIssue(event) {
  console.error('✗ 支付问题:', {
    eventType: event.event_type,
    resource: event.resource
  });
  
  // TODO: 处理退款/拒付情况
  // 1. 更新订单状态
  // 2. 通知管理员
}

// 处理订单批准事件
async function handleOrderApproved(event) {
  console.log('订单已批准:', {
    orderID: event.resource.id
  });
  
  // TODO: 可以在这里开始准备交付流程
}

module.exports = handleWebhook;
