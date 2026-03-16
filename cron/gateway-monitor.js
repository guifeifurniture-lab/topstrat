// Gateway Health Monitor - Auto Reconnect
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  checkInterval: 30000,
  maxRetries: 3,
  retryDelay: 5000,
  gatewayPort: 18789,
  logFile: 'C:\\Users\\JINDA\\.openclaw\\logs\\gateway-monitor.log'
};

const logDir = path.dirname(CONFIG.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  fs.appendFileSync(CONFIG.logFile, logLine, 'utf8');
  console.log(logLine.trim());
}

function checkGateway() {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${CONFIG.gatewayPort}`, (error, stdout) => {
      resolve(!error && stdout.trim().length > 0);
    });
  });
}

function restartGateway() {
  return new Promise((resolve) => {
    log('Restarting gateway...');
    exec('openclaw gateway restart', (error, stdout, stderr) => {
      if (error) {
        log(`Gateway restart failed: ${stderr}`, 'ERROR');
        resolve(false);
      } else {
        log('Gateway restarted successfully', 'SUCCESS');
        resolve(true);
      }
    });
  });
}

async function monitorLoop() {
  log('=== Gateway Monitor Started ===');
  let consecutiveFailures = 0;
  
  while (true) {
    try {
      const isRunning = await checkGateway();
      
      if (isRunning) {
        if (consecutiveFailures > 0) {
          log(`Gateway recovered (failed ${consecutiveFailures} times)`, 'SUCCESS');
          consecutiveFailures = 0;
        }
      } else {
        consecutiveFailures++;
        log(`Gateway not running (failure ${consecutiveFailures})`, 'WARNING');
        
        if (consecutiveFailures <= CONFIG.maxRetries) {
          log(`Retrying in ${CONFIG.retryDelay / 1000}s...`);
          await new Promise(r => setTimeout(r, CONFIG.retryDelay));
          const restarted = await restartGateway();
          if (restarted) consecutiveFailures = 0;
        } else {
          log(`Gateway restart failed ${CONFIG.maxRetries} times - ALERT`, 'CRITICAL');
          consecutiveFailures = 0;
        }
      }
    } catch (error) {
      log(`Monitor error: ${error.message}`, 'ERROR');
    }
    
    await new Promise(r => setTimeout(r, CONFIG.checkInterval));
  }
}

monitorLoop().catch(error => {
  log(`Monitor failed: ${error.message}`, 'CRITICAL');
  process.exit(1);
});
