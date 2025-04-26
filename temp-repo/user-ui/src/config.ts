export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const APP_CONFIG = {
  name: 'Panda Quant',
  version: '1.0.0',
  theme: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#f5f5f5',
    text: '#333333'
  },
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    enableDarkMode: true
  }
};

// 策略配置
export const STRATEGY_CONFIG = {
  // 风险等级配置
  RISK_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },
  // 默认参数
  DEFAULT_PARAMS: {
    INITIAL_CAPITAL: 10000,
    MAX_DRAWDOWN: 0.2,
    MAX_POSITION_SIZE: 0.1,
    STOP_LOSS: 0.05,
    TAKE_PROFIT: 0.1
  },
  // 回测配置
  BACKTEST: {
    DEFAULT_TIME_RANGE: '1m',
    AVAILABLE_TIME_RANGES: ['1d', '1w', '1m', '3m', '6m', '1y', 'all']
  }
};

// 图表配置
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#00FFB8',
    SECONDARY: '#FF6B6B',
    BACKGROUND: '#FFFFFF',
    TEXT: '#333333',
    GRID: 'rgba(0, 0, 0, 0.1)'
  },
  GRADIENT: {
    START: 'rgba(0, 255, 184, 0.2)',
    END: 'rgba(0, 255, 184, 0)'
  }
};

// 本地存储配置
export const STORAGE_CONFIG = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  STRATEGY_CONFIG: 'strategy_config'
};

// 错误消息配置
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查您的网络设置',
  AUTH_ERROR: '认证失败，请重新登录',
  STRATEGY_ERROR: '策略操作失败，请稍后重试',
  BACKTEST_ERROR: '回测失败，请检查参数设置'
};

// 成功消息配置
export const SUCCESS_MESSAGES = {
  STRATEGY_CREATED: '策略创建成功',
  STRATEGY_UPDATED: '策略更新成功',
  STRATEGY_DELETED: '策略删除成功',
  BACKTEST_COMPLETED: '回测完成'
}; 