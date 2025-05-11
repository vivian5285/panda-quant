module.exports = {
  apps: [
    {
      name: 'admin-api',
      cwd: './admin-api',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'user-api',
      cwd: './user-api',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'strategy-engine',
      cwd: './strategy-engine',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'admin-ui',
      cwd: './admin-ui',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'user-ui',
      cwd: './user-ui',
      script: 'npx',
      args: 'serve dist -s -l 3000',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'server',
      cwd: './server',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}; 