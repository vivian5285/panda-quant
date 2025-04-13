interface EnvironmentConfig {
  apiBaseUrl: string;
  cdnUrl: string;
  uploadPath: string;
  logPath: string;
  enableAnalytics: boolean;
  enableErrorTracking: boolean;
}

const config: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:3001',
    cdnUrl: 'http://localhost:3000',
    uploadPath: '/uploads',
    logPath: '/logs',
    enableAnalytics: false,
    enableErrorTracking: true
  },
  production: {
    apiBaseUrl: 'https://api.your-domain.com',
    cdnUrl: 'https://cdn.your-domain.com',
    uploadPath: '/data/uploads',
    logPath: '/data/logs',
    enableAnalytics: true,
    enableErrorTracking: true
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment]; 