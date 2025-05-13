export enum StrategyType {
  SCALPING = 'scalping',
  TREND = 'trend',
  GRID = 'grid',
  ARBITRAGE = 'arbitrage'
}

export enum StrategyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error'
}

export enum OrderStatus {
  PENDING = 'pending',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  STRATEGIST = 'strategist'
}

export enum NetworkType {
  DATABASE = 'database',
  API = 'api',
  REDIS = 'redis',
  WEBSOCKET = 'websocket'
}

export enum NetworkStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CHECKING = 'checking',
  ERROR = 'error'
}

export enum AlertType {
  PRICE = 'price',
  VOLUME = 'volume',
  TECHNICAL = 'technical'
}

export enum AlertStatus {
  ACTIVE = 'active',
  TRIGGERED = 'triggered',
  DISABLED = 'disabled'
} 