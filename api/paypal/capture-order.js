// PayPal Capture Order API
// 捕获已批准的订单

const https = require('https');

const PAYPAL_CONFIG = {
  CLIENT_ID: 'YOUR_PRODUCTION_CLIENT_ID',
  CLIENT_SECRET: 'YOUR_PRODUCTION_CLIENT_SECRET',
  BASE_URL: 'https://api-m.paypal.com'
};

// 获取 Access Token
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${PAYPAL_CONFIG.CLIENT_ID}:${PAYPAL_CONFIG.CLIENT_SECRET}`).toString('base64');
    
    const options = {
      hostname: 'api-m.paypal.com',
      port: 443,
      path: '/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data).access_token);
        } else {
          reject(new Error(`获取 Token 失败：${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write('grant_type=client_credentials');
    req.end();
  });
}

// 捕获订单
async function captureOrder(req, res) {
  try {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { orderID, plan } = JSON.parse(body);
        
        // 获取 Access Token
        const accessToken = await getAccessToken();
        
        // 捕获订单
        const captureResponse = await new Promise((resolve, reject) => {
          const options = {
            hostname: 'api-m.paypal.com',
            port: 443,
            path: `/v2/checkout/orders/${orderID}/capture`,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          };
          
          const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
              if (res.statusCode === 201 || res.statusCode === 200) {
                resolve(JSON.parse(responseData));
              } else {
                reject(new Error(`捕获订单失败：${res.statusCode}`));
              }
            });
          });
          
          req.on('error', reject);
          req.end();
        });
        
        // 记录交易信息（用于后续处理）
        console.log('支付成功:', {
          orderID: orderID,
          plan: plan,
          status: captureResponse.status,
          payerEmail: captureResponse.payer?.email_address,
          amount: captureResponse.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
          timestamp: new Date().toISOString()
        });
        
        // TODO: 在这里添加后续处理逻辑
        // 1. 保存交易记录到数据库
        // 2. 发送邮件通知
        // 3. 添加 GitHub Collaborator
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: captureResponse.status,
          details: captureResponse
        }));
        
      } catch (error) {
        console.error('捕获订单错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '服务器错误' }));
  }
}

module.exports = captureOrder;
