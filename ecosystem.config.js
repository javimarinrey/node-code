module.exports = {
  apps: [
    {
      name: 'nodejs-mongo-service',
      script: './dist/server.js',
      exec_mode: 'cluster',
      instances: 'max',           // usa todos los núcleos disponibles
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGO_URI: 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/midb?replicaSet=rs0',
      },
      max_memory_restart: '500M',
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 10000,
      merge_logs: true,
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};