# 国内支付集成说明文档

## 概述

Vault 页面已集成三种支付方式：
- **PayPal** - 国际用户（信用卡/借记卡/PayPal 账户）
- **微信支付** - 国内用户（微信零钱/信用卡/借记卡）
- **支付宝** - 国内用户（支付宝余额/信用卡/花呗/借记卡）

## 文件结构

```
website/
├── vault.html                          # 主页面（已集成支付功能）
└── assets/
    ├── alipay-qr.png                   # 支付宝二维码（需添加）
    ├── wechat-pay-qr.png               # 微信支付二维码（需添加）
    ├── alipay-qr-placeholder.txt       # 支付宝配置说明
    ├── wechat-pay-qr.png.txt           # 微信支付配置说明
    ├── payment-qr-instructions.md      # 二维码配置详细说明
    └── PAYMENT_FLOW.md                 # 本文件
```

## 配置步骤

### 1. 添加二维码图片

#### 支付宝二维码
1. 打开支付宝 App → 我的 → 收付款 → 二维码收款
2. 保存收款码图片或截图
3. 重命名为 `alipay-qr.png`
4. 放置到 `website/assets/` 目录
5. 收款账户：GuiFei Furn 经营账户

#### 微信支付二维码
1. 打开微信 App → 我 → 服务 → 收付款 → 二维码收款
2. 保存收款码图片或截图
3. 重命名为 `wechat-pay-qr.png`
4. 放置到 `website/assets/` 目录
5. 收款账户：Michael 经营账户

### 2. 验证配置

1. 打开 `vault.html` 页面
2. 滚动到「选择你的路径」部分
3. 点击任意价格卡片下方的「微信支付」或「支付宝」按钮
4. 确认二维码正常显示
5. 使用手机扫描测试（应显示正确的收款账户信息）

## 用户支付流程

### 选择产品
- **入门锦囊** - ¥299（原价 ¥499）
- **专业锦囊** - ¥799（原价 ¥1,299）

### 支付方式选择
1. 点击价格卡片下方的支付方式按钮
   - PayPal（默认）
   - 微信支付
   - 支付宝

### 完成支付

#### PayPal 支付
1. 点击 PayPal 按钮
2. 登录 PayPal 账户或使用信用卡支付
3. 支付成功后自动显示确认页面
4. 系统自动记录订单

#### 微信支付 / 支付宝
1. 选择微信支付或支付宝
2. 打开手机 App 扫描二维码
3. 确认金额并支付
4. 返回页面点击「我已支付」按钮
5. 显示确认页面，提示发送邮件

### 支付后流程
1. 用户发送支付凭证截图至 `voxyz.developer@gmail.com`
2. 管理员核实收款账户到账情况
3. 添加用户为 GitHub Collaborator
4. 发送确认邮件给用户
5. 整个过程在 24 小时内完成

## 管理员流程

### 收款确认
1. 监控支付确认通知（邮件 / 系统）
2. 检查支付宝/微信收款账户
3. 核实支付金额和付款人信息

### 权限授予
1. 访问 GitHub 仓库设置
2. 添加用户为 Collaborator
3. 发送确认邮件，包含：
   - 感谢信息
   - GitHub 仓库链接
   - 访问指南
   - 联系方式

### 记录管理
建议维护一个支付记录表格（如 Feishu Bitable 或 Google Sheets）：
- 订单号
- 产品名称
- 支付金额
- 支付方式
- 支付时间
- 用户邮箱
- GitHub 用户名
- 确认状态
- 确认时间

## 技术实现

### 前端功能
- 支付方式切换（PayPal / 微信支付 / 支付宝）
- 二维码展示（256x256px）
- 支付确认按钮
- 成功/失败状态显示

### 后端 API（待实现）
- `POST /api/domestic-pay/confirm` - 接收支付确认
- `POST /api/paypal/create-order` - 创建 PayPal 订单
- `POST /api/paypal/capture-order` - 捕获 PayPal 支付
- `POST /api/paypal/notify` - PayPal 支付通知

### 配置文件
在 `vault.html` 中修改以下配置：

```javascript
// 微信支付配置
const WECHAT_PAY_CONFIG = {
  MERCHANT_NAME: 'Michael 经营账户',
  QR_CODE_PATH: 'assets/wechat-pay-qr.png',
  CONTACT_EMAIL: 'voxyz.developer@gmail.com',
  SUPPORTED_METHODS: '零钱、信用卡、借记卡'
};

// 支付宝支付配置
const ALIPAY_PAY_CONFIG = {
  MERCHANT_NAME: 'GuiFei Furn 经营账户',
  QR_CODE_PATH: 'assets/alipay-qr.png',
  CONTACT_EMAIL: 'voxyz.developer@gmail.com',
  SUPPORTED_METHODS: '信用卡、花呗、支付宝余额、借记卡'
};
```

## 测试清单

- [ ] 支付宝二维码图片已放置到正确位置
- [ ] 微信支付二维码图片已放置到正确位置
- [ ] 二维码清晰可扫描
- [ ] 支付方式切换功能正常
- [ ] 支付说明文字正确显示
- [ ] 「我已支付」按钮功能正常
- [ ] 确认页面显示正确
- [ ] 移动端显示正常

## 常见问题

### Q: 二维码无法显示？
A: 检查图片路径是否正确，文件名是否匹配（区分大小写）。

### Q: 扫码后显示错误的收款账户？
A: 重新生成二维码，确保使用的是正确的经营账户收款码。

### Q: 用户支付后未收到确认？
A: 检查邮箱 `voxyz.developer@gmail.com`，手动核实收款账户。

### Q: 如何区分不同产品的支付？
A: 用户在支付时应备注产品名称，或在邮件中说明购买的产品。

## 联系支持

如有问题或需要帮助，请联系：
- 邮箱：voxyz.developer@gmail.com
- GitHub: https://github.com/voxyz

---

**文档版本：** 1.0  
**更新日期：** 2026-03-16  
**负责人：** 孙膑（前端集成）
