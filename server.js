// Office Status Server - 实时 Agent 状态服务器
// 提供 Office 页面的实时数据 API
// 运行：node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// 导入 Office Status API
const officeStatus = require('./api/office-status');

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

// CORS 头
function setCORSHeaders(res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  });
}

// 处理 API 请求
function handleApiRequest(req, res) {
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    res.end();
    return;
  }
  
  // GET 请求处理
  if (req.method === 'GET') {
    try {
      let response = {};
      
      // Office Status API 端点
      if (req.url === '/api/office/agents' || req.url === '/api/office/agents/') {
        response = officeStatus.getAgentStates();
      } else if (req.url === '/api/office/activity' || req.url === '/api/office/activity/') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const limit = parseInt(url.searchParams.get('limit')) || 20;
        response = officeStatus.getActivityFeed(limit);
      } else if (req.url === '/api/office/shipping' || req.url === '/api/office/shipping/') {
        response = officeStatus.getShippingLog();
      } else if (req.url === '/api/office/accuracy' || req.url === '/api/office/accuracy/') {
        response = officeStatus.getAccuracyLeaderboard();
      } else if (req.url === '/api/office/pulse' || req.url === '/api/office/pulse/') {
        response = officeStatus.getPulseMetrics();
      } else if (req.url === '/api/office/graveyard' || req.url === '/api/office/graveyard/') {
        response = officeStatus.getIdeaGraveyard();
      } else if (req.url === '/api/office/state' || req.url === '/api/office/state/') {
        // 完整状态（用于兼容旧的 office-state.json）
        response = officeStatus.updateOfficeState();
      } else if (req.url === '/api/paypal/create-order') {
        response = { 
          orderID: 'TEST-ORDER-' + Date.now(),
          message: '测试模式'
        };
      } else if (req.url === '/api/paypal/capture-order') {
        response = { 
          status: 'COMPLETED',
          message: '测试模式'
        };
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
      }
      
      setCORSHeaders(res);
      res.end(JSON.stringify(response));
      
    } catch (error) {
      console.error('API Error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  
  // POST 请求处理
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('POST /api:', req.url, data);
        
        // 处理 Agent 状态上报
        if (req.url === '/api/office/report' || req.url === '/api/office/report/') {
          // 记录 Agent 活动
          const activityLogPath = path.join(__dirname, 'data/activity-log.json');
          let activityLog = [];
          
          if (fs.existsSync(activityLogPath)) {
            activityLog = JSON.parse(fs.readFileSync(activityLogPath, 'utf8'));
          }
          
          // 添加新活动记录
          const newActivity = {
            id: 'act_' + Date.now(),
            agentId: data.agentId,
            agentName: data.agentName,
            action: data.action || 'working',
            content: data.content,
            task: data.task,
            timestamp: new Date().toISOString()
          };
          
          activityLog.unshift(newActivity);
          
          // 保留最近 1000 条记录
          if (activityLog.length > 1000) {
            activityLog = activityLog.slice(0, 1000);
          }
          
          fs.writeFileSync(activityLogPath, JSON.stringify(activityLog, null, 2), 'utf8');
          
          // 更新 Office 状态
          officeStatus.updateOfficeState();
          
          setCORSHeaders(res);
          res.end(JSON.stringify({ success: true, activity: newActivity }));
          return;
        }
        
        setCORSHeaders(res);
        res.end(JSON.stringify({ status: 'received' }));
        
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }
  
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

// WebSocket 支持（简单实现）
const websockets = [];

function handleWebSocketUpgrade(req, socket, head) {
  if (req.url === '/ws/office') {
    console.log('WebSocket connection requested');
    
    // 简单的 WebSocket 协议握手
    const key = req.headers['sec-websocket-key'];
    const crypto = require('crypto');
    const acceptKey = crypto.createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
      .digest('base64');
    
    socket.write('HTTP/1.1 101 Switching Protocols\r\n');
    socket.write('Upgrade: websocket\r\n');
    socket.write('Connection: Upgrade\r\n');
    socket.write(`Sec-WebSocket-Accept: ${acceptKey}\r\n`);
    socket.write('\r\n');
    
    websockets.push(socket);
    console.log(`WebSocket connected. Total: ${websockets.length}`);
    
    socket.on('data', (data) => {
      // 处理 WebSocket 消息
      console.log('WebSocket message:', data.toString());
    });
    
    socket.on('close', () => {
      const index = websockets.indexOf(socket);
      if (index > -1) {
        websockets.splice(index, 1);
      }
      console.log(`WebSocket disconnected. Total: ${websockets.length}`);
    });
    
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      const index = websockets.indexOf(socket);
      if (index > -1) {
        websockets.splice(index, 1);
      }
    });
  }
}

// 广播更新到所有 WebSocket 客户端
function broadcastUpdate(data) {
  const message = JSON.stringify(data);
  websockets.forEach(ws => {
    try {
      // 简单的 WebSocket 帧（文本）
      const frame = Buffer.from([0x81]); // FIN + 文本帧
      const length = Buffer.byteLength(message);
      
      if (length < 126) {
        ws.write(Buffer.concat([frame, Buffer.from([length]), Buffer.from(message)]));
      } else if (length < 65536) {
        ws.write(Buffer.concat([
          frame,
          Buffer.from([126, (length >> 8) & 0xFF, length & 0xFF]),
          Buffer.from(message)
        ]));
      }
    } catch (error) {
      console.error('Broadcast error:', error);
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
  let filePath = req.url === '/' ? '/index.html' : req.url;
  // 移除查询参数
  filePath = filePath.split('?')[0];
  filePath = path.join(__dirname, filePath);
  
  serveStaticFile(res, filePath);
});

// 监听 WebSocket 升级
server.on('upgrade', handleWebSocketUpgrade);

// 定时更新 Office 状态（每 30 秒）
setInterval(() => {
  console.log('Auto-updating office state...');
  const state = officeStatus.updateOfficeState();
  broadcastUpdate({ type: 'update', data: state });
  console.log(`Office state updated. Agents: ${state.agents.length}, Activities: ${state.activities.length}`);
}, 30000);

// 初始更新
console.log('Initializing office state...');
officeStatus.updateOfficeState();

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Office Status Server 已启动                            ║
╠════════════════════════════════════════════════════════╣
║  本地访问：http://localhost:${PORT}/office.html          ║
║  API: http://localhost:${PORT}/api/office/state          ║
║  WebSocket: ws://localhost:${PORT}/ws/office             ║
╠════════════════════════════════════════════════════════╣
║  状态更新：每 30 秒自动刷新                               ║
║  按 Ctrl+C 停止服务器                                  ║
╚════════════════════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  websockets.forEach(ws => ws.end());
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
