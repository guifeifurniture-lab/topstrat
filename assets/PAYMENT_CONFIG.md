# 支付配置说明

**更新时间：** 2026-03-17 04:35

---

## PayPal 配置

**收款账号：** bjd1129@gmail.com  
**模式：** 沙箱测试

### 环境变量

创建 `.env.paypal` 文件：

```
PAYPAL_CLIENT_ID=你的 PayPal Client ID
PAYPAL_CLIENT_SECRET=你的 PayPal Client Secret
PAYPAL_MODE=sandbox
```

---

## 微信支付配置

**收款账号：** Michael 经营账户  
**模式：** 扫码支付

### 二维码生成

1. 打开微信支付商户平台
2. 下载收款二维码
3. 保存到 `assets/wechat-pay-qr.png`

---

## 支付宝配置

**收款账号：** GuiFei Furn 经营账户  
**模式：** 扫码支付

### 二维码生成

1. 打开支付宝商家服务
2. 生成收款二维码
3. 保存到 `assets/alipay-qr.png`

---

## 测试流程

1. 访问 /vault 页面
2. 选择套餐
3. 点击支付
4. 扫码或跳转 PayPal
5. 完成支付后自动跳转

---

*待完成：上传真实二维码图片*
