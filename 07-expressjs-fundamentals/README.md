# Express.js Fundamentals | Express.js 基础

## 学习目标 | Learning Objectives

学习本章节后，你将能够：
- 理解 Express.js 的核心概念和优势
- 安装和配置 Express.js 项目
- 创建基本的 Express.js 服务器和路由
- 使用中间件处理请求和响应
- 实现静态文件服务
- 处理表单数据和 JSON 数据
- 实现错误处理机制
- 组织 Express.js 应用程序的结构

## Express.js 简介 | Introduction to Express.js

Express.js 是一个轻量级、灵活的 Node.js Web 应用框架，提供了丰富的功能来构建 Web 和移动应用程序的 API。

### Express.js 的特点 | Features of Express.js

- **极简且灵活**：Express 提供了最小化的核心功能，但允许通过插件扩展
- **路由系统**：强大的路由系统，可以处理不同的 HTTP 请求和路径
- **中间件架构**：中间件模式允许在请求和响应周期中执行各种操作
- **模板引擎**：支持多种模板引擎，如 Pug、EJS 等
- **静态文件服务**：内置静态文件服务功能
- **内容协商**：支持内容协商和多种响应格式

### 为什么选择 Express.js | Why Choose Express.js

- 高性能：Express 是最快速的 Node.js Web 框架之一
- 成熟稳定：拥有庞大的社区支持和丰富的文档
- 生态系统：大量可用的中间件和扩展
- 学习曲线平缓：对于有 JavaScript 基础的开发者来说容易上手
- 适用于各种应用：从小型 API 到大型 Web 应用程序

## 安装 Express.js | Installing Express.js

在开始之前，确保你已经安装了 Node.js 和 npm。

### 创建新项目 | Creating a New Project

```bash
# 创建项目目录
mkdir express-app
cd express-app

# 初始化 npm 项目
npm init -y

# 安装 Express
npm install express
```

### 安装开发依赖 | Installing Development Dependencies

```bash
# 安装 nodemon（自动重启服务器）
npm install --save-dev nodemon

# 在 package.json 中添加启动脚本
```

修改 `package.json` 文件：

```json
{
  "name": "express-app",
  "version": "1.0.0",
  "description": "Express.js 应用示例",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## 创建第一个 Express 应用 | Creating Your First Express App

### 基本服务器设置 | Basic Server Setup

创建一个名为 `app.js` 的文件：

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

### 运行应用程序 | Running the Application

```bash
# 使用开发模式运行
npm run dev

# 或者使用生产模式运行
npm start
```

访问 http://localhost:3000 查看结果。

## 路由基础 | Routing Basics

路由确定应用程序如何响应客户端对特定端点的请求，该端点由 URI（或路径）和 HTTP 请求方法（GET、POST 等）定义。

### 基本路由示例 | Basic Routing Examples

```javascript
// GET 路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST 路由
app.post('/', (req, res) => {
  res.send('收到 POST 请求');
});

// PUT 路由
app.put('/user', (req, res) => {
  res.send('收到 PUT 请求到 /user');
});

// DELETE 路由
app.delete('/user', (req, res) => {
  res.send('收到 DELETE 请求到 /user');
});
```

### 路由方法 | Routing Methods

Express 支持所有 HTTP 请求方法，如 GET、POST、PUT、DELETE 等：

```javascript
// 处理所有 HTTP 方法
app.all('/secret', (req, res, next) => {
  console.log('访问了 secret 路径');
  next(); // 传递控制权给下一个处理程序
});
```

### 路由路径 | Route Paths

路由路径可以是字符串、字符串模式或正则表达式：

```javascript
// 匹配根路径 /
app.get('/', (req, res) => {
  res.send('根路径');
});

// 匹配 /about 路径
app.get('/about', (req, res) => {
  res.send('关于页面');
});

// 使用字符串模式匹配 - 匹配 /acd 和 /abcd
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd');
});

// 匹配 /ab 之后的任何内容
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd');
});

// 使用正则表达式 - 匹配任何包含 a 的路径
app.get(/a/, (req, res) => {
  res.send('/a/');
});
```

### 路由参数 | Route Parameters

路由参数是 URL 中命名的段，用于捕获 URL 中指定位置的值：

```javascript
// 路由参数示例
app.get('/users/:userId/books/:bookId', (req, res) => {
  // 访问路由参数
  res.send(req.params);
});

// 访问 http://localhost:3000/users/34/books/8989 将返回：
// { "userId": "34", "bookId": "8989" }
```

### 查询参数 | Query Parameters

查询参数是 URL 中 `?` 后面的键值对：

```javascript
app.get('/search', (req, res) => {
  // 访问查询参数
  const { q, page, limit } = req.query;
  res.send({ query: q, page, limit });
});

// 访问 http://localhost:3000/search?q=nodejs&page=1&limit=10 将返回：
// { "query": "nodejs", "page": "1", "limit": "10" }
```

## 响应方法 | Response Methods

下表列出了 `res` 对象上的方法，这些方法可以向客户端发送响应，并终止请求-响应周期。

| 方法 | 描述 |
|------|------|
| res.download() | 提示客户端下载文件 |
| res.end() | 结束响应过程 |
| res.json() | 发送 JSON 响应 |
| res.jsonp() | 使用 JSONP 支持发送 JSON 响应 |
| res.redirect() | 重定向请求 |
| res.render() | 渲染视图模板 |
| res.send() | 发送各种类型的响应 |
| res.sendFile() | 发送文件 |
| res.sendStatus() | 设置响应状态码并发送其字符串表示 |

### 常用响应方法示例 | Examples of Common Response Methods

```javascript
// 发送文本响应
app.get('/text', (req, res) => {
  res.send('这是文本响应');
});

// 发送 JSON 响应
app.get('/json', (req, res) => {
  res.json({
    message: 'Hello',
    status: 'success',
    data: [1, 2, 3]
  });
});

// 发送 HTML 响应
app.get('/html', (req, res) => {
  res.send('<h1>这是 HTML 响应</h1><p>Express.js 真酷！</p>');
});

// 设置状态码
app.get('/status', (req, res) => {
  res.status(201).send('已创建');
});

// 重定向
app.get('/redirect', (req, res) => {
  res.redirect('/');
});

// 下载文件
app.get('/download', (req, res) => {
  res.download('./public/example.pdf');
});
```

## 中间件 | Middleware

中间件函数是可以访问请求对象 (req)、响应对象 (res) 以及 next 函数的函数。next 函数是 Express 路由中的一个函数，当被调用时，执行管道中的下一个中间件函数。

### 中间件类型 | Types of Middleware

1. **应用级别中间件** | Application-level middleware
2. **路由级别中间件** | Router-level middleware
3. **错误处理中间件** | Error-handling middleware
4. **内置中间件** | Built-in middleware
5. **第三方中间件** | Third-party middleware

### 应用级别中间件 | Application-level Middleware

```javascript
// 不挂载路径的中间件函数，应用程序的每个请求都会执行它
app.use((req, res, next) => {
  console.log('时间:', Date.now());
  next(); // 调用 next() 使请求进入下一个中间件
});

// 挂载在 /user/:id 路径上的中间件
app.use('/user/:id', (req, res, next) => {
  console.log('请求 URL:', req.originalUrl);
  next();
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('发生错误！');
});
```

### 路由级别中间件 | Router-level Middleware

路由级别中间件的工作方式与应用级别中间件基本相同，但它绑定到 `express.Router()` 的实例。

```javascript
const router = express.Router();

// 路由级别中间件
router.use((req, res, next) => {
  console.log('时间:', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.send('路由主页');
});

// 将路由器挂载到应用程序
app.use('/api', router);
```

### 内置中间件 | Built-in Middleware

Express 4.x 具有以下内置中间件：

- `express.static`：提供静态文件服务
- `express.json`：解析 JSON 格式的请求体
- `express.urlencoded`：解析 URL 编码的请求体

```javascript
// 提供静态文件服务
app.use(express.static('public'));

// 解析 JSON 请求体
app.use(express.json());

// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));
```

### 第三方中间件 | Third-party Middleware

安装和使用第三方中间件：

```bash
# 安装 cors 中间件（处理跨域请求）
npm install cors

# 安装 helmet 中间件（安全相关）
npm install helmet
```

```javascript
const cors = require('cors');
const helmet = require('helmet');

// 使用第三方中间件
app.use(cors()); // 允许跨域请求
app.use(helmet()); // 设置各种 HTTP 头以增强安全性
```

## 处理请求数据 | Handling Request Data

### 解析 JSON 数据 | Parsing JSON Data

```javascript
// 启用 JSON 解析
app.use(express.json());

// 处理 JSON POST 请求
app.post('/api/data', (req, res) => {
  // req.body 包含解析后的 JSON 数据
  console.log('接收到的数据:', req.body);
  res.json({ received: true, data: req.body });
});
```

### 处理表单数据 | Handling Form Data

```javascript
// 解析 URL 编码的表单数据
app.use(express.urlencoded({ extended: true }));

// 处理表单 POST 请求
app.post('/submit-form', (req, res) => {
  // req.body 包含表单数据
  console.log('表单数据:', req.body);
  res.send(`感谢提交，${req.body.name}!`);
});
```

### 文件上传处理 | Handling File Uploads

使用 `multer` 中间件处理文件上传：

```bash
# 安装 multer
npm install multer
```

```javascript
const multer = require('multer');

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 创建上传实例
const upload = multer({ storage: storage });

// 确保上传目录存在
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 处理单个文件上传
app.post('/upload/single', upload.single('file'), (req, res) => {
  res.json({
    file: req.file,
    message: '文件上传成功'
  });
});

// 处理多个文件上传
app.post('/upload/multiple', upload.array('files', 5), (req, res) => {
  res.json({
    files: req.files,
    message: '多文件上传成功'
  });
});
```

## 错误处理 | Error Handling

Express 提供了一种机制来捕获和处理同步和异步发生的错误。

### 基本错误处理中间件 | Basic Error-handling Middleware

```javascript
// 错误处理中间件必须接受四个参数
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器内部错误！');
});
```

### 自定义错误处理 | Custom Error Handling

```javascript
// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用自定义错误
app.get('/error', (req, res, next) => {
  // 传递错误给错误处理中间件
  next(new AppError('这是一个自定义错误', 400));
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
```

## 组织 Express 应用结构 | Organizing Express Application Structure

对于较大的应用程序，良好的文件结构组织非常重要。

### 推荐的应用结构 | Recommended Application Structure

```
myapp/
  ├── app.js                 # 应用程序入口
  ├── package.json
  ├── routes/                # 路由
  │   ├── index.js
  │   ├── users.js
  │   └── products.js
  ├── controllers/           # 控制器
  │   ├── userController.js
  │   └── productController.js
  ├── models/                # 数据模型
  │   ├── userModel.js
  │   └── productModel.js
  ├── middleware/            # 中间件
  │   ├── auth.js
  │   └── errorHandler.js
  ├── utils/                 # 工具函数
  │   └── apiFeatures.js
  ├── config/                # 配置
  │   └── config.js
  └── public/                # 静态文件
      ├── css/
      ├── js/
      └── images/
```

### 模块化路由示例 | Modular Routing Example

**routes/users.js**

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
```

**controllers/userController.js**

```javascript
// 获取所有用户
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      users: [{ id: 1, name: 'John Doe' }]
    }
  });
};

// 获取单个用户
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: { id: req.params.id, name: 'John Doe' }
    }
  });
};

// 创建用户
exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      user: req.body
    }
  });
};

// 更新用户
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: { id: req.params.id, ...req.body }
    }
  });
};

// 删除用户
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
```

**app.js**

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 导入路由
const userRoutes = require('./routes/users');

// 挂载路由
app.use('/api/v1/users', userRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

## 部署 Express 应用 | Deploying Express Applications

### 生产环境最佳实践 | Production Best Practices

1. **环境变量**：使用环境变量存储敏感信息和配置
2. **错误处理**：实现全面的错误处理机制
3. **安全措施**：使用安全相关的中间件，如 helmet
4. **日志记录**：实现日志记录，使用如 winston 或 morgan 等库
5. **性能优化**：使用压缩中间件，如 compression

### 部署前的准备 | Pre-deployment Checklist

```bash
# 安装生产依赖
npm install helmet compression morgan winston dotenv
```

```javascript
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// 生产环境中间件
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // 增强安全性
  app.use(compression()); // 压缩响应体
}

// 日志记录
app.use(morgan('combined'));

// 其他中间件和路由...

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

## 常见问题与解决方案 | Common Issues and Solutions

### 1. 端口已被占用 | Port Already in Use

```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>
```

### 2. 跨域请求问题 | CORS Issues

使用 `cors` 中间件解决跨域问题：

```javascript
const cors = require('cors');
app.use(cors());
```

### 3. 404 错误 | 404 Errors

添加一个 404 处理中间件，捕获所有未匹配的路由：

```javascript
// 404 处理中间件（放在所有路由之后）
app.all('*', (req, res, next) => {
  next(new AppError(`无法找到 ${req.originalUrl} 路径`, 404));
});
```

## 执行方式 | Execution Methods

本章节中的所有 Express.js 示例都可以通过以下步骤执行：

1. 创建一个新的 Express.js 项目目录
2. 安装必要的依赖
3. 创建相应的文件（app.js, routes/, controllers/ 等）
4. 运行应用程序

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产模式运行
npm start
```

请查看 `examples.js` 文件获取更多可执行的示例代码。