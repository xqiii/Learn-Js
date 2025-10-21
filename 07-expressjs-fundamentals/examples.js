// Express.js 基础示例代码
// 注意：在运行此示例前，请确保安装了 express 包
// npm install express

// 导入必要的模块
const express = require('express');
const path = require('path');
const fs = require('fs');

// 显示示例说明
console.log('===== Express.js 基础示例 =====');
console.log('本文件包含多个 Express.js 示例');
console.log('请根据注释运行不同的示例部分\n');

// ============= 示例 1: 基本服务器 =============
function runBasicServer() {
  console.log('\n[示例 1: 基本服务器]');
  
  const app = express();
  const PORT = 3000;
  
  // 基本路由
  app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`基本服务器运行在 http://localhost:${PORT}`);
    console.log('请在浏览器中访问上述地址查看结果');
    console.log('按 Ctrl+C 停止服务器');
  });
  
  // 防止进程卡住，10秒后自动关闭（仅用于演示）
  setTimeout(() => {
    console.log('\n示例演示结束，关闭基本服务器...');
    server.close(() => {
      console.log('基本服务器已关闭');
    });
  }, 10000);
}

// ============= 示例 2: 路由示例 =============
function runRoutingExamples() {
  console.log('\n[示例 2: 路由示例]');
  
  const app = express();
  const PORT = 3001;
  
  // 基本路由
  app.get('/', (req, res) => {
    res.send('<h1>Express.js 路由示例</h1><p>尝试访问以下路径:</p><ul><li><a href="/about">/about</a></li><li><a href="/users">/users</a></li><li><a href="/api/data">/api/data</a></li></ul>');
  });
  
  // 不同的 HTTP 方法
  app.get('/about', (req, res) => {
    res.send('这是关于页面');
  });
  
  app.post('/submit', (req, res) => {
    res.send('收到 POST 请求');
  });
  
  // 路由参数
  app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`用户 ID: ${userId}`);
  });
  
  // 多个路由参数
  app.get('/users/:userId/posts/:postId', (req, res) => {
    res.json({
      userId: req.params.userId,
      postId: req.params.postId
    });
  });
  
  // 查询参数
  app.get('/search', (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    res.json({
      query: q || '无查询参数',
      page,
      limit,
      message: `正在搜索: ${q || '全部'}，第 ${page} 页，每页 ${limit} 条`
    });
  });
  
  // API 路由
  app.get('/api/data', (req, res) => {
    res.json({
      status: 'success',
      data: [
        { id: 1, name: '示例 1' },
        { id: 2, name: '示例 2' },
        { id: 3, name: '示例 3' }
      ],
      timestamp: new Date().toISOString()
    });
  });
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`路由示例服务器运行在 http://localhost:${PORT}`);
    console.log('尝试访问不同的路径：');
    console.log(`- http://localhost:${PORT}/`);
    console.log(`- http://localhost:${PORT}/about`);
    console.log(`- http://localhost:${PORT}/users/123`);
    console.log(`- http://localhost:${PORT}/users/123/posts/456`);
    console.log(`- http://localhost:${PORT}/search?q=express&page=2&limit=5`);
    console.log(`- http://localhost:${PORT}/api/data`);
  });
  
  // 15秒后自动关闭
  setTimeout(() => {
    console.log('\n路由示例演示结束，关闭服务器...');
    server.close();
  }, 15000);
}

// ============= 示例 3: 响应方法 =============
function runResponseMethodsExample() {
  console.log('\n[示例 3: 响应方法]');
  
  const app = express();
  const PORT = 3002;
  
  // 主页 - 展示所有可用的端点
  app.get('/', (req, res) => {
    res.send(`
      <h1>Express 响应方法示例</h1>
      <ul>
        <li><a href="/text">文本响应</a></li>
        <li><a href="/json">JSON 响应</a></li>
        <li><a href="/html">HTML 响应</a></li>
        <li><a href="/status">状态码</a></li>
        <li><a href="/redirect">重定向</a></li>
      </ul>
    `);
  });
  
  // 文本响应
  app.get('/text', (req, res) => {
    res.send('这是一个文本响应');
  });
  
  // JSON 响应
  app.get('/json', (req, res) => {
    res.json({
      message: 'Hello JSON',
      status: 'success',
      data: {
        items: [1, 2, 3],
        user: { id: 1, name: '测试用户' }
      },
      timestamp: new Date().toISOString()
    });
  });
  
  // HTML 响应
  app.get('/html', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>HTML 响应示例</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <h1>HTML 响应示例</h1>
        <p>这是通过 Express.js 发送的 HTML 响应。</p>
        <p>当前时间: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `);
  });
  
  // 设置状态码
  app.get('/status', (req, res) => {
    // 设置不同的状态码
    const statusCodes = [200, 201, 400, 401, 403, 404, 500];
    const randomCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    
    res.status(randomCode).send(`状态码: ${randomCode}`);
  });
  
  // 重定向
  app.get('/redirect', (req, res) => {
    res.redirect('/');
  });
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`响应方法示例服务器运行在 http://localhost:${PORT}`);
    console.log('请访问主页查看所有响应方法示例');
  });
  
  // 12秒后自动关闭
  setTimeout(() => {
    console.log('\n响应方法示例演示结束，关闭服务器...');
    server.close();
  }, 12000);
}

// ============= 示例 4: 中间件 =============
function runMiddlewareExample() {
  console.log('\n[示例 4: 中间件]');
  
  const app = express();
  const PORT = 3003;
  
  // 1. 应用级中间件 - 所有请求都会执行
  app.use((req, res, next) => {
    console.log('时间:', new Date().toISOString());
    console.log('请求方法:', req.method);
    console.log('请求路径:', req.url);
    next(); // 必须调用 next() 才能继续
  });
  
  // 2. 内置中间件 - 解析 JSON
  app.use(express.json());
  
  // 3. 内置中间件 - 静态文件服务
  // 创建 public 目录用于演示
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    // 创建一个简单的 HTML 文件
    fs.writeFileSync(path.join(publicDir, 'index.html'), `
      <!DOCTYPE html>
      <html>
      <head><title>静态文件示例</title></head>
      <body><h1>这是一个静态 HTML 文件</h1></body>
      </html>
    `);
  }
  app.use(express.static(publicDir));
  
  // 4. 路由级中间件 - 特定路径的中间件
  const userLogger = (req, res, next) => {
    console.log('访问用户相关路由');
    next();
  };
  
  // 应用路由级中间件
  app.use('/users', userLogger);
  
  // 5. 路由处理
  app.get('/', (req, res) => {
    res.send(`
      <h1>中间件示例</h1>
      <ul>
        <li><a href="/users">用户路由 (带中间件)</a></li>
        <li><a href="/api/data">JSON API</a></li>
        <li><a href="/static">静态文件</a></li>
        <li><a href="/error">错误处理</a></li>
      </ul>
    `);
  });
  
  // 用户路由
  app.get('/users', (req, res) => {
    res.send('用户列表');
  });
  
  app.get('/users/:id', (req, res) => {
    res.send(`用户 ID: ${req.params.id}`);
  });
  
  // JSON API 路由
  app.post('/api/data', (req, res) => {
    // 由于我们使用了 express.json() 中间件，可以访问 req.body
    res.json({
      received: true,
      data: req.body,
      timestamp: new Date().toISOString()
    });
  });
  
  // 静态文件访问
  app.get('/static', (req, res) => {
    res.redirect('/index.html');
  });
  
  // 6. 错误处理路由
  app.get('/error', (req, res, next) => {
    // 传递错误给错误处理中间件
    const error = new Error('这是一个测试错误');
    error.status = 400;
    next(error);
  });
  
  // 7. 错误处理中间件（必须放在所有路由之后）
  app.use((err, req, res, next) => {
    console.error('捕获到错误:', err.message);
    
    // 设置默认错误状态和消息
    const status = err.status || 500;
    const message = err.message || '服务器内部错误';
    
    res.status(status).json({
      status: 'error',
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });
  
  // 8. 404 处理中间件（捕获所有未匹配的路由）
  app.use((req, res, next) => {
    res.status(404).send('页面未找到');
  });
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`中间件示例服务器运行在 http://localhost:${PORT}`);
    console.log('查看控制台输出了解中间件执行情况');
    console.log('使用 curl 测试 POST 请求: curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"test\"}" http://localhost:3003/api/data');
  });
  
  // 15秒后自动关闭
  setTimeout(() => {
    console.log('\n中间件示例演示结束，关闭服务器...');
    server.close();
  }, 15000);
}

// ============= 示例 5: 模块化路由结构 =============
function runModularRoutingExample() {
  console.log('\n[示例 5: 模块化路由结构]');
  
  const app = express();
  const PORT = 3004;
  
  // 中间件
  app.use(express.json());
  
  // 模拟控制器函数
  const userController = {
    getAllUsers: (req, res) => {
      res.json({
        status: 'success',
        results: 3,
        data: {
          users: [
            { id: 1, name: '用户 1', email: 'user1@example.com' },
            { id: 2, name: '用户 2', email: 'user2@example.com' },
            { id: 3, name: '用户 3', email: 'user3@example.com' }
          ]
        }
      });
    },
    
    getUser: (req, res) => {
      res.json({
        status: 'success',
        data: {
          user: { id: req.params.id, name: `用户 ${req.params.id}` }
        }
      });
    },
    
    createUser: (req, res) => {
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: Date.now(), // 模拟 ID
            ...req.body
          }
        }
      });
    }
  };
  
  // 模拟产品控制器
  const productController = {
    getAllProducts: (req, res) => {
      res.json({
        status: 'success',
        results: 2,
        data: {
          products: [
            { id: 101, name: '产品 A', price: 99.99 },
            { id: 102, name: '产品 B', price: 199.99 }
          ]
        }
      });
    }
  };
  
  // 创建模块化路由
  const userRoutes = express.Router();
  const productRoutes = express.Router();
  
  // 配置用户路由
  userRoutes
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
  
  userRoutes
    .route('/:id')
    .get(userController.getUser);
  
  // 配置产品路由
  productRoutes
    .route('/')
    .get(productController.getAllProducts);
  
  // 挂载路由到主应用
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/products', productRoutes);
  
  // 主页
  app.get('/', (req, res) => {
    res.send(`
      <h1>模块化路由示例</h1>
      <p>这是一个展示如何组织 Express 路由的示例</p>
      <ul>
        <li><a href="/api/v1/users">获取所有用户</a></li>
        <li><a href="/api/v1/users/123">获取单个用户</a></li>
        <li><a href="/api/v1/products">获取所有产品</a></li>
      </ul>
      <p>使用 POST 请求到 /api/v1/users 创建新用户</p>
    `);
  });
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`模块化路由示例服务器运行在 http://localhost:${PORT}`);
    console.log('API 端点:');
    console.log(`- GET  http://localhost:${PORT}/api/v1/users`);
    console.log(`- GET  http://localhost:${PORT}/api/v1/users/:id`);
    console.log(`- POST http://localhost:${PORT}/api/v1/users`);
    console.log(`- GET  http://localhost:${PORT}/api/v1/products`);
  });
  
  // 10秒后自动关闭
  setTimeout(() => {
    console.log('\n模块化路由示例演示结束，关闭服务器...');
    server.close();
  }, 10000);
}

// ============= 运行示例 =============

// 提示如何使用
console.log('使用说明:');
console.log('1. 确保已安装 express: npm install express');
console.log('2. 取消下面要运行的示例的注释');
console.log('3. 每个示例都会在指定端口启动一个 Express 服务器');
console.log('4. 服务器会在演示完成后自动关闭\n');

// 运行单个示例
// 取消注释想要运行的示例

// 运行基本服务器示例
// runBasicServer();

// 运行路由示例
// runRoutingExamples();

// 运行响应方法示例
// runResponseMethodsExample();

// 运行中间件示例
// runMiddlewareExample();

// 运行模块化路由示例
// runModularRoutingExample();

// 要运行多个示例，请取消注释下面的代码并按顺序执行

// 依次运行所有示例
console.log('依次运行所有示例...');

// 1秒后启动第一个示例
setTimeout(() => {
  runBasicServer();
  
  // 12秒后启动第二个示例
  setTimeout(() => {
    runRoutingExamples();
    
    // 18秒后启动第三个示例
    setTimeout(() => {
      runResponseMethodsExample();
      
      // 15秒后启动第四个示例
      setTimeout(() => {
        runMiddlewareExample();
        
        // 18秒后启动第五个示例
        setTimeout(() => {
          runModularRoutingExample();
          
          // 所有示例结束后的消息
          setTimeout(() => {
            console.log('\n===== 所有示例已完成 =====');
            console.log('您可以通过单独取消注释特定示例函数来运行它们');
            console.log('例如: // runBasicServer(); 取消注释后只运行基本服务器示例');
          }, 12000);
        }, 18000);
      }, 15000);
    }, 18000);
  }, 12000);
}, 1000);

/*
执行说明：

1. 安装依赖：
   npm install express

2. 运行示例：
   node examples.js

3. 访问服务器：
   打开浏览器，访问控制台输出中显示的 URL

4. 单独运行示例：
   取消注释您想运行的特定示例函数
   例如：取消注释 // runBasicServer();

5. 测试 POST 请求：
   使用 curl 或 Postman 发送 POST 请求
   例如：
   curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"John\",\"age\":30}" http://localhost:3003/api/data

6. 多端口使用：
   每个示例使用不同的端口，请确保这些端口没有被占用

7. 自动关闭：
   示例服务器会在演示完成后自动关闭，无需手动停止
*/