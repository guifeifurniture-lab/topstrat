// PayPal API Routes
// 用于 Express.js 或类似框架

const createOrder = require('./create-order');
const captureOrder = require('./capture-order');
const handleWebhook = require('./webhook');

// 路由配置
const paypalRoutes = {
  // 创建订单
  'POST /api/paypal/create-order': createOrder,
  
  // 捕获订单
  'POST /api/paypal/capture-order': captureOrder,
  
  // Webhook 接收
  'POST /api/paypal/webhook': handleWebhook
};

// 简单路由处理器
function handleRequest(req, res) {
  const route = `${req.method} ${req.url}`;
  const handler = paypalRoutes[route];
  
  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

module.exports = { paypalRoutes, handleRequest };
