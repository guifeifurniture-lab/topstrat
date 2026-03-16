# 局域网双开 OpenClaw 配置指南

**版本：** v1.0  
**创建时间：** 2026-03-17 02:58  
**适用场景：** 2 台电脑在同一局域网运行 OpenClaw

---

## 🖥️ 设备规划

| 设备 | 角色 | IP 地址 | 网关端口 | Dashboard 端口 |
|------|------|---------|---------|---------------|
| **PC-A** | 主力机 | 192.168.31.25 | 18789（默认） | 9090（默认） |
| **PC-B** | 备用机 | 待配置 | 18790（自定义） | 9091（自定义） |

---

## 🔧 配置步骤

### 方案一：端口隔离法（推荐）

#### PC-A（主力机）- 保持默认

**当前配置：**
```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback"
  }
}
```

**访问地址：**
- Dashboard: `http://192.168.31.25:9090`
- Gateway: `ws://192.168.31.25:18789`

---

#### PC-B（备用机）- 修改端口

**步骤 1：停止服务**
```bash
openclaw gateway stop
```

**步骤 2：修改配置文件**

编辑 `~/.openclaw/openclaw.json`，找到 `gateway` 部分：

```json
{
  "gateway": {
    "port": 18790,
    "mode": "local",
    "bind": "loopback",
    "controlUi": {
      "allowedOrigins": [
        "http://localhost:18790",
        "http://127.0.0.1:18790",
        "http://192.168.31.XX:18790"
      ]
    },
    "auth": {
      "mode": "token",
      "token": "生成新 token"
    }
  }
}
```

**步骤 3：启动服务**
```bash
openclaw gateway start
```

**访问地址：**
- Dashboard: `http://192.168.31.XX:9091`
- Gateway: `ws://192.168.31.XX:18790`

---

### 方案二：角色分离法（高级）

#### PC-A（只运行 Agent，不暴露）

```json
{
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1"
  }
}
```

#### PC-B（管理控制，SSH 隧道）

```bash
# 在 PC-B 上执行
ssh -L 18789:localhost:18789 user@192.168.31.25

# 然后访问 http://localhost:18789 即可控制 PC-A
```

---

## 🔍 端口冲突排查

### 检查端口占用

**Windows（PowerShell）：**
```powershell
# 检查 18789 端口
netstat -ano | findstr :18789

# 检查 18790 端口
netstat -ano | findstr :18790

# 查看占用端口的进程 ID
Get-NetTCPConnection -LocalPort 18789 | Select-Object OwningProcess
```

**停止占用端口的进程：**
```powershell
# 停止进程（替换 PID）
Stop-Process -Id <PID> -Force
```

---

### 检查 Gateway 状态

```bash
# 查看 Gateway 状态
openclaw gateway status

# 重启 Gateway
openclaw gateway restart

# 查看详细日志
openclaw gateway logs --tail 50
```

---

### 常见冲突场景

#### 场景 1：两台电脑都用默认端口

**症状：** 无法同时访问两台电脑

**解决：**
1. 确认 PC-B 配置已修改为 18790
2. 重启 PC-B 的 Gateway
3. 访问时用不同端口：
   - PC-A: `http://IP:9090`
   - PC-B: `http://IP:9091`

---

#### 场景 2：同一台电脑开了多个 Gateway

**症状：** `port already in use`

**解决：**
```powershell
# 找到所有 node 进程
Get-Process node | Where-Object { $_.Path -like "*openclaw*" }

# 停止所有 OpenClaw 进程
Get-Process node | Where-Object { $_.Path -like "*openclaw*" } | Stop-Process -Force

# 重新启动
openclaw gateway start
```

---

#### 场景 3：防火墙阻止访问

**症状：** 局域网内无法访问另一台电脑

**解决：**
```powershell
# Windows 防火墙添加入站规则
New-NetFirewallRule -DisplayName "OpenClaw Gateway" -Direction Inbound -LocalPort 18789,18790 -Protocol TCP -Action Allow

New-NetFirewallRule -DisplayName "OpenClaw Dashboard" -Direction Inbound -LocalPort 9090,9091 -Protocol TCP -Action Allow
```

---

## 📊 验证配置

### PC-A 验证
```bash
# 检查端口
netstat -ano | findstr :18789

# 访问测试
curl http://localhost:9090

# Gateway 测试
openclaw gateway status
```

### PC-B 验证
```bash
# 检查端口
netstat -ano | findstr :18790

# 访问测试
curl http://localhost:9091

# Gateway 测试
openclaw gateway status
```

---

## 🎯 最佳实践

### 1. 统一配置管理

**创建配置模板：**
```json
// PC-A: openclaw-pc-a.json
{
  "gateway": { "port": 18789, "bind": "0.0.0.0" }
}

// PC-B: openclaw-pc-b.json
{
  "gateway": { "port": 18790, "bind": "0.0.0.0" }
}
```

### 2. 日志集中收集

**PC-B 收集两台电脑日志：**
```powershell
# 创建日志目录
New-Item -ItemType Directory -Force -Path "C:\openclaw-logs"

# 复制 PC-A 日志（需要共享权限）
Copy-Item \\PC-A\c$\Users\JINDA\.openclaw\logs\* -Destination "C:\openclaw-logs\pc-a\"

# PC-B 本地日志
Copy-Item C:\Users\JINDA\.openclaw\logs\* -Destination "C:\openclaw-logs\pc-b\"
```

### 3. 监控脚本

**双机监控脚本（`cron/dual-pc-monitor.js`）：**
```javascript
// 监控两台电脑 Gateway 状态
const CONFIG = {
  pcA: { host: '192.168.31.25', port: 18789 },
  pcB: { host: '192.168.31.XX', port: 18790 }
};

// 每 30 秒检查两台电脑
setInterval(() => {
  checkGateway(CONFIG.pcA);
  checkGateway(CONFIG.pcB);
}, 30000);
```

---

## 📝 配置检查清单

### PC-A（主力机）
- [ ] Gateway 端口：18789
- [ ] Dashboard 端口：9090
- [ ] bind: `loopback` 或 `0.0.0.0`
- [ ] 防火墙已放行
- [ ] 可以正常访问

### PC-B（备用机）
- [ ] Gateway 端口：18790
- [ ] Dashboard 端口：9091
- [ ] bind: `loopback` 或 `0.0.0.0`
- [ ] 防火墙已放行
- [ ] 可以正常访问
- [ ] 与 PC-A 不冲突

---

## 🚨 故障排查流程

```
无法访问 Gateway
   ↓
1. 检查端口是否监听
   netstat -ano | findstr :18789
   ↓
2. 检查进程是否运行
   Get-Process node
   ↓
3. 检查防火墙
   Get-NetFirewallRule | Where-Object DisplayName -like "*OpenClaw*"
   ↓
4. 检查配置文件
   cat ~/.openclaw/openclaw.json
   ↓
5. 重启 Gateway
   openclaw gateway restart
```

---

*最后更新：2026-03-17 02:58*  
*下次审查：配置变更后*
