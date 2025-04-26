module.exports = {
  apps: [
    {
      name: 'panda-quant-api',
      script: '../user-api/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      time: true
    },
    {
      name: 'panda-quant-ui',
      script: '../user-ui/node_modules/.bin/next',
      args: 'start',
      cwd: '../user-ui',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/ui-error.log',
      out_file: './logs/ui-out.log',
      time: true
    }
  ]
}; 