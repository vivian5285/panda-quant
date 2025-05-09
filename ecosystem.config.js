module.exports = {
  apps: [
    {
      name: 'admin-api',
      cwd: './admin-api',
      script: 'dist/index.js',
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
      name: 'user-api',
      cwd: './user-api',
      script: 'dist/index.js',
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
      name: 'strategy-engine',
      cwd: './strategy-engine',
      script: 'dist/index.js',
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
      name: 'admin-ui',
      cwd: './admin-ui',
      script: 'npm',
      args: 'start',
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
      name: 'user-ui',
      cwd: './user-ui',
      script: 'serve',
      args: 'dist -s -l 3004',
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
        NODE_ENV: 'production'
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}; 