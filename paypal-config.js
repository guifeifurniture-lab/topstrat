// PayPal Configuration
// ⚠️ 安全提示：此文件包含敏感信息，请勿提交到公开仓库

const PAYPAL_CONFIG = {
  // 生产环境 Client ID (替换为实际的 Client ID)
  // 获取方式：登录 https://developer.paypal.com/dashboard/applications
  CLIENT_ID: 'YOUR_PRODUCTION_CLIENT_ID',
  
  // 收款账号
  MERCHANT_EMAIL: 'bjd1129@gmail.com',
  
  // 货币单位
  CURRENCY: 'USD',
  
  // 商品配置
  PRODUCTS: {
    starter: {
      id: 'starter-pack',
      name: '入门锦囊',
      price: '299.00',
      description: '完整的从零到一路径'
    },
    pro: {
      id: 'pro-pack',
      name: '专业锦囊',
      price: '799.00',
      description: '生产环境稳定性、协作和 24/7 部署'
    }
  }
};

// 导出配置（供其他脚本使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PAYPAL_CONFIG;
}
