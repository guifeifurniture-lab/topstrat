# PayPal 收款集成配置指南

## 📋 配置清单

### Phase 1：PayPal 账户配置

#### 1. 确认 PayPal 账户状态
- 收款账号：`bjd1129@gmail.com`
- 登录 https://www.paypal.com 确认账户状态正常
- 确保账户已验证（邮箱、银行卡/信用卡）
- 确认可以接收国际付款（美元）

#### 2. 获取 PayPal API 凭证

**步骤：**
1. 登录 https://developer.paypal.com/dashboard/
2. 点击 "Apps & Credentials"
3. 选择 "Live"（生产环境）
4. 点击 "Create App"
5. 填写应用名称（例如：Vault Checkout）
6. 记录生成的 **Client ID** 和 **Client Secret**

**凭证存储位置：**
```
C:\Users\JINDA\.openclaw\workspace-market\website\.env.paypal
```

**环境变量格式：**
```env
PAYPAL_CLIENT_ID=your_production_client_id_here
PAYPAL_CLIENT_SECRET=your_production_client_secret_here
PAYPAL_WEBHOOK_ID=your_webhook_id_here
```

#### 3. 配置 Webhook URL

**步骤：**
1. 在 PayPal Dashboard 进入刚才创建的应用
2. 点击 "Webhooks" → "Add Webhook"
3. 填写 Webhook URL：
   - 本地测试：`https://your-ngrok-url.ngrok.io/api/paypal/webhook`
   - 生产环境：`https://yourdomain.com/api/paypal/webhook`
4. 选择事件类型：
   - ✅ Payment capture completed
   - ✅ Payment capture denied
   - ✅ Payment capture refunded
   - ✅ Checkout order approved
5. 保存后记录 **Webhook ID**

#### 4. 更新前端配置

**文件：** `vault.html`

找到以下行并替换 Client ID：
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PRODUCTION_CLIENT_ID&currency=USD&intent=capture"></script>
```

替换为：
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_ACTUAL_CLIENT_ID&currency=USD&intent=capture"></script>
```

#### 5. 更新后端配置

**文件：** 
- `api/paypal/create-order.js`
- `api/paypal/capture-order.js`
- `api/paypal/webhook.js`

替换所有配置项：
```javascript
const PAYPAL_CONFIG = {
  CLIENT_ID: 'YOUR_ACTUAL_CLIENT_ID',
  CLIENT_SECRET: 'YOUR_ACTUAL_CLIENT_SECRET',
  WEBHOOK_ID: 'YOUR_ACTUAL_WEBHOOK_ID',
  BASE_URL: 'https://api-m.paypal.com'
};
```

---

## 🧪 测试流程

### 沙盒测试（推荐先测试）

1. 在 PayPal Dashboard 创建沙盒账户
2. 使用沙盒 Client ID 替换生产 Client ID
3. 使用沙盒买家账户测试支付流程
4. 确认支付成功后再切换到生产环境

### 生产环境测试

1. 使用真实 PayPal 账户进行小额测试（例如 $1）
2. 确认收款到账
3. 确认 Webhook 通知正常接收
4. 确认邮件通知发送成功

---

## 📦 交付流程（Phase 3）

### 收到支付后的操作清单

1. **确认收款**
   - 检查 PayPal 邮箱（bjd1129@gmail.com）
   - 登录 PayPal 确认款项到账
   - 记录订单号和付款人信息

2. **添加 GitHub Collaborator**
   - 访问项目仓库 Settings → Collaborators
   - 添加付款人的 GitHub 用户名
   - 发送邀请

3. **发送确认邮件**
   - 主题：✓ 支付确认 - 谋士天团锦囊
   - 内容包括：
     - 订单号
     - 购买的锦囊类型
     - GitHub 访问说明
     - 联系方式

---

## 🔧 故障排查

### PayPal 按钮不显示
- 检查 Client ID 是否正确
- 检查网络连接
- 查看浏览器控制台错误

### 支付成功但没收到通知
- 检查 Webhook URL 是否可访问
- 查看服务器日志
- 在 PayPal Dashboard 查看 Webhook 事件历史

### 无法创建订单
- 检查 API 凭证是否正确
- 确认服务器可以访问 PayPal API
- 检查防火墙/代理设置

---

## 📞 联系支持

- 收款账号：bjd1129@gmail.com
- PayPal 开发者文档：https://developer.paypal.com/docs/
