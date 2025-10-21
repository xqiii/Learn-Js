// Deployment and DevOps Examples | 部署和运维示例
// 运行方式: node examples.js

console.log('===== Deployment and DevOps Examples =====\n');

// 1. Environment Configuration | 环境配置示例
console.log('1. Environment Configuration Example');
console.log('-------------------------------------');

// 模拟环境变量
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';
process.env.DB_URL = 'mongodb://localhost:27017/testdb';
process.env.JWT_SECRET = 'your-secret-key';

function configureApp() {
  // 检查环境
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Current environment: ${process.env.NODE_ENV}`);
  
  // 配置应用设置
  const config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/default',
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    logLevel: isProduction ? 'info' : 'debug',
    enableCors: !isProduction
  };
  
  return config;
}

const appConfig = configureApp();
console.log('Application configuration:', appConfig);
console.log();

// 2. Docker and Containerization | Docker和容器化示例代码
console.log('2. Docker Configuration Examples (展示配置文件内容)');
console.log('------------------------------------------------');

function showDockerConfig() {
  const dockerfile = `# Dockerfile 示例
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]`;
  
  const dockerCompose = `# docker-compose.yml 示例
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_URL=mongodb://mongo:27017/app
    depends_on:
      - mongo
  
  mongo:
    image: mongo:4.4
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:`;
  
  console.log('Dockerfile:\n' + dockerfile);
  console.log('\ndocker-compose.yml:\n' + dockerCompose);
}

showDockerConfig();
console.log();

// 3. Logging with Winston | 使用Winston进行日志记录
console.log('3. Logging with Winston Example');
console.log('-------------------------------');

// 注意: 实际使用时需要安装 winston: npm install winston
function simulateLogging() {
  // 模拟Winston日志记录器
  const logger = {
    info: (message, meta) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] INFO: ${message} ${meta ? JSON.stringify(meta) : ''}`);
    },
    error: (message, meta) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR: ${message} ${meta ? JSON.stringify(meta) : ''}`);
    },
    debug: (message, meta) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] DEBUG: ${message} ${meta ? JSON.stringify(meta) : ''}`);
    }
  };
  
  // 使用日志记录器
  logger.info('Application started');
  logger.info('User logged in', { userId: 'user123', role: 'admin' });
  logger.error('Failed to connect to database', { error: 'Connection refused' });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('This is a debug message only shown in development');
  }
  
  return logger;
}

simulateLogging();
console.log();

// 4. Graceful Shutdown | 优雅关闭示例
console.log('4. Graceful Shutdown Example');
console.log('---------------------------');

function simulateGracefulShutdown() {
  console.log('Setting up graceful shutdown handlers...');
  
  // 模拟服务器
  const server = {
    connections: 5,
    close: (callback) => {
      console.log(`Closing server with ${server.connections} active connections...`);
      setTimeout(() => {
        console.log('All connections closed');
        callback();
      }, 1000);
    }
  };
  
  // 模拟数据库连接
  const db = {
    close: (callback) => {
      console.log('Closing database connections...');
      setTimeout(() => {
        console.log('Database connections closed');
        callback();
      }, 500);
    }
  };
  
  // 模拟SIGTERM信号处理
  function handleShutdown(signal) {
    console.log(`\nReceived ${signal} signal. Initiating graceful shutdown...`);
    
    // 设置超时强制关闭
    const timeout = setTimeout(() => {
      console.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 5000);
    
    // 关闭服务器
    server.close(() => {
      // 关闭数据库连接
      db.close(() => {
        clearTimeout(timeout);
        console.log('Graceful shutdown completed');
        // 在实际环境中这里会调用 process.exit(0)
      });
    });
  }
  
  // 模拟信号
  handleShutdown('SIGTERM (simulated)');
  
  return {
    server,
    db,
    handleShutdown
  };
}

simulateGracefulShutdown();
console.log();

// 5. Load Balancing Configuration | 负载均衡配置示例
console.log('5. Load Balancing Configuration Example');
console.log('---------------------------------------');

function showLoadBalancingConfig() {
  const nginxConfig = `# Nginx 负载均衡配置示例
upstream node_app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://node_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;
  
  console.log('Nginx Configuration:\n' + nginxConfig);
  
  // 模拟多实例启动命令
  console.log('\nPM2 集群模式启动命令:');
  console.log('pm2 start server.js -i max');
}

showLoadBalancingConfig();
console.log();

// 6. PM2 Process Manager Configuration | PM2进程管理器配置
console.log('6. PM2 Process Manager Example');
console.log('------------------------------');

function showPM2Config() {
  const ecosystemConfig = `# ecosystem.config.js 示例
module.exports = {
  apps : [{
    name: "node-app",
    script: "./server.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
    },
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: "./logs/error.log",
    out_file: "./logs/output.log"
  }]
};`;
  
  console.log('PM2 Ecosystem Configuration:\n' + ecosystemConfig);
  
  console.log('\nPM2 常用命令:');
  console.log('- 启动应用: pm2 start ecosystem.config.js --env production');
  console.log('- 列出应用: pm2 list');
  console.log('- 监控应用: pm2 monit');
  console.log('- 重启应用: pm2 restart node-app');
  console.log('- 设置开机自启: pm2 startup');
  console.log('- 保存进程列表: pm2 save');
}

showPM2Config();
console.log();

// 7. CI/CD Pipeline Configuration | CI/CD流水线配置示例
console.log('7. CI/CD Pipeline Configuration Examples');
console.log('----------------------------------------');

function showCICDConfig() {
  const githubActions = `# GitHub Actions Workflow 示例 (.github/workflows/node.js.yml)
name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
  
  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # 这里可以添加实际的部署命令`;
  
  console.log('GitHub Actions Configuration:\n' + githubActions);
}

showCICDConfig();
console.log();

// 8. Production Security Headers | 生产环境安全头配置
console.log('8. Production Security Headers Example');
console.log('-------------------------------------');

function showSecurityHeaders() {
  // 模拟Express.js安全头设置
  console.log('Express.js 安全头中间件示例:');
  
  const expressSecurityCode = `// 使用 helmet 中间件添加安全头
const helmet = require('helmet');

// 在Express应用中使用
app.use(helmet());

// 或者自定义安全头
app.use((req, res, next) => {
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content-Security-Policy
  res.setHeader(
    'Content-Security-Policy', 
    "default-src 'self'; script-src 'self' https://trusted-cdn.com"
  );
  
  // Strict-Transport-Security
  res.setHeader(
    'Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains'
  );
  
  next();
});`;
  
  console.log(expressSecurityCode);
}

showSecurityHeaders();
console.log();

console.log('===== All Examples Completed =====');
console.log('注意: 要运行实际的日志记录和安全头示例，需要安装相应的包:');
console.log('- npm install winston helmet dotenv');