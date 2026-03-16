// Simple PayPal Test Server
// 用于本地测试 PayPal 集成
// 运行：node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

// 简单的请求日志
function logRequest(req) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
}

// 处理静态文件
function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// 处理 API 请求
function handleApiRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }
  
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('API 请求:', req.url, data);
      
      // 模拟 API 响应（实际部署时替换为真实 PayPal API 调用）
      if (req.url === '/api/paypal/create-order') {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
          orderID: 'TEST-ORDER-' + Date.now(),
          message: '这是测试响应，实际部署时请连接真实 PayPal API'
        }));
      } else if (req.url === '/api/paypal/capture-order') {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
          status: 'COMPLETED',
          message: '这是测试响应，实际部署时请连接真实 PayPal API'
        }));
      } else if (req.url === '/api/paypal/notify') {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        console.log('✓ 收到支付通知:', data);
        res.end(JSON.stringify({ status: 'received' }));
      } else if (req.url === '/api/paypal/webhook') {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        console.log('✓ 收到 Webhook 事件:', data);
        res.end(JSON.stringify({ status: 'success' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}

// 创建服务器
const server = http.createServer((req, res) => {
  logRequest(req);
  
  // 处理 API 请求
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }
  
  // 处理静态文件
  let filePath = req.url === '/' ? '/vault.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  PayPal 测试服务器已启动                                ║
╠════════════════════════════════════════════════════════╣
║  本地访问：http://localhost:${PORT}/vault.html          ║
║  按 Ctrl+C 停止服务器                                  ║
║                                                        ║
║  注意：这是测试服务器，API 返回模拟响应                ║
║  实际部署时请使用真实的 PayPal API                     ║
╚════════════════════════════════════════════════════════╝
  `);
});
