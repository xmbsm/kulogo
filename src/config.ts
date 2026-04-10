// 项目配置文件
export const config = {
  // 统计功能配置
  analytics: {
    // 百度统计
    baidu: {
      enabled: true, // 是否开启百度统计
      siteId: '8808da6231820f5b8f686703365b6927' // 百度统计站点ID
    },
    // 谷歌分析（预留）
    google: {
      enabled: false,
      trackingId: ''
    }
  },
  // 广告功能配置
  ads: {
    google: {
      enabled: false,
      clientId: '', // 谷歌广告客户端ID
      slotId: '', // 广告单元ID
      format: 'auto', // 广告格式
      responsive: true // 是否响应式
    }
  },
  // 其他配置
  app: {
    name: '酷设计',
    version: '1.0.0'
  }
};
