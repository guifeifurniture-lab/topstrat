// PayPal Create Order API
// 此文件需要部署在支持 Node.js 的服务器环境

const https = require('https');

// PayPal API 配置
const PAYPAL_CONFIG = {
  CLIENT_ID: 'YOUR_PRODUCTION_CLIENT_ID',
  CLIENT_SECRET: 'YOUR_PRODUCTION_CLIENT_SECRET',
  BASE_URL: 'https://api-m.paypal.com' // 生产环境
  // 沙盒环境：https://api-m.sandbox.paypal.com
};

// 获取 PayPal Access Token
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

// 创建 PayPal 订单
async function createOrder(req, res) {
  try {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { plan, product } = JSON.parse(body);
        
        // 获取 Access Token
        const accessToken = await getAccessToken();
        
        // 创建订单请求体
        const orderData = {
          intent: 'CAPTURE',
          purchase_units: [{
            description: product.description,
            amount: {
              value: product.price,
              currency_code: 'USD'
            }
          }]
        };
        
        // 调用 PayPal API 创建订单
        const orderResponse = await new Promise((resolve, reject) => {
          const data = JSON.stringify(orderData);
          
          const options = {
            hostname: 'api-m.paypal.com',
            port: 443,
            path: '/v2/checkout/orders',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          };
          
          const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
              if (res.statusCode === 201) {
                resolve(JSON.parse(responseData));
              } else {
                reject(new Error(`创建订单失败：${res.statusCode}`));
              }
            });
          });
          
          req.on('error', reject);
          req.write(data);
          req.end();
        });
        
        // 返回订单 ID 给前端
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ orderID: orderResponse.id }));
        
      } catch (error) {
        console.error('创建订单错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '服务器错误' }));
  }
}

module.exports = createOrder;
