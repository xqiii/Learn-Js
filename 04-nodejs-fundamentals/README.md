# Node.js Fundamentals | Node.js 基础

## 学习目标 | Learning Objectives

学习本章节后，你将能够：
- 理解 Node.js 的核心概念和架构
- 掌握 Node.js 模块系统的使用
- 了解 CommonJS 与 ES 模块的区别
- 能够进行文件系统操作
- 掌握路径处理的方法
- 理解 Node.js 进程管理

## Node.js 概述 | Node.js Overview

### 什么是 Node.js | What is Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，使开发者可以使用 JavaScript 编写服务器端代码。它采用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

```javascript
// 在 Node.js 中运行的简单示例
console.log('Hello from Node.js!');
```

### Node.js 的特点 | Features of Node.js

- **事件驱动 | Event-driven**: 使用事件循环来处理异步操作
- **非阻塞 I/O | Non-blocking I/O**: 在执行 I/O 操作时不阻塞线程
- **单线程 | Single-threaded**: 主线程是单线程的，但可以使用工作线程
- **跨平台 | Cross-platform**: 可以在 Windows、Mac 和 Linux 上运行
- **包管理器 | Package Manager**: 内置 npm 包管理器

### 安装和使用 | Installation and Usage

在 [Node.js 官方网站](https://nodejs.org/) 下载并安装适合你操作系统的版本。

验证安装：
```bash
node -v  # 查看 Node.js 版本
npm -v   # 查看 npm 版本
```

## 模块系统 | Module System

### CommonJS 模块 | CommonJS Modules

Node.js 默认使用 CommonJS 模块系统，通过 `require()` 和 `module.exports` 进行模块导入和导出。

#### 导出模块 | Exporting Modules

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// 导出单个函数
module.exports.add = add;

// 导出多个函数
module.exports = {
  add,
  subtract
};
```

#### 导入模块 | Importing Modules

```javascript
// app.js
const math = require('./math');
console.log(math.add(5, 3));  // 输出: 8

// 或者使用解构赋值
const { add, subtract } = require('./math');
console.log(subtract(10, 4));  // 输出: 6
```

### ES 模块 | ES Modules

Node.js 也支持 ES 模块，通过 `.mjs` 文件扩展名或在 `package.json` 中设置 `"type": "module"` 来启用。

#### package.json 配置 | package.json Configuration

```json
{
  "type": "module"
}
```

#### 导出模块 | Exporting Modules

```javascript
// math.mjs
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

// 命名导出
export { multiply, divide };

// 或者导出默认
export default {
  multiply,
  divide
};
```

#### 导入模块 | Importing Modules

```javascript
// app.mjs
// 命名导入
import { multiply, divide } from './math.mjs';
console.log(multiply(4, 5));  // 输出: 20

// 默认导入
import math from './math.mjs';
console.log(math.divide(20, 4));  // 输出: 5
```

### CommonJS 与 ES 模块对比 | CommonJS vs ES Modules

| 特性 | CommonJS | ES Modules |
|------|----------|------------|
| 语法 | `require()`, `module.exports` | `import`, `export` |
| 加载时机 | 运行时加载 | 静态编译时加载 |
| 模块缓存 | 缓存模块的导出值 | 缓存模块的引用 |
| 循环依赖 | 支持循环依赖 | 支持循环依赖但有不同的行为 |
| 适用场景 | Node.js 默认 | 浏览器和现代 Node.js |

## 文件系统操作 | File System Operations

Node.js 的 `fs` 模块提供了与文件系统交互的 API，可以进行文件读取、写入、删除等操作。

### 同步操作 | Synchronous Operations

```javascript
const fs = require('fs');

// 读取文件
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('文件内容:', data);
} catch (error) {
  console.error('读取文件失败:', error.message);
}

// 写入文件
try {
  fs.writeFileSync('output.txt', 'Hello, Node.js!', 'utf8');
  console.log('文件写入成功');
} catch (error) {
  console.error('写入文件失败:', error.message);
}

// 追加内容到文件
try {
  fs.appendFileSync('output.txt', '\n追加的内容', 'utf8');
  console.log('内容追加成功');
} catch (error) {
  console.error('追加内容失败:', error.message);
}

// 删除文件
try {
  fs.unlinkSync('temp.txt');
  console.log('文件删除成功');
} catch (error) {
  console.error('删除文件失败:', error.message);
}
```

### 异步操作 | Asynchronous Operations

```javascript
const fs = require('fs');

// 异步读取文件
fs.readFile('example.txt', 'utf8', (error, data) => {
  if (error) {
    return console.error('异步读取文件失败:', error.message);
  }
  console.log('异步读取的文件内容:', data);
});

// 异步写入文件
fs.writeFile('async-output.txt', '异步写入的内容', 'utf8', (error) => {
  if (error) {
    return console.error('异步写入文件失败:', error.message);
  }
  console.log('异步写入文件成功');
});

// 使用 Promise API (Node.js v10+)
const fsPromises = require('fs').promises;

async function fileOperations() {
  try {
    // 读取文件
    const data = await fsPromises.readFile('example.txt', 'utf8');
    console.log('Promise读取的文件内容:', data);
    
    // 写入文件
    await fsPromises.writeFile('promise-output.txt', data, 'utf8');
    console.log('Promise写入文件成功');
  } catch (error) {
    console.error('Promise文件操作失败:', error.message);
  }
}

fileOperations();
```

### 文件和目录操作 | File and Directory Operations

```javascript
const fs = require('fs');
const path = require('path');

// 检查文件是否存在
const fileExists = fs.existsSync('example.txt');
console.log('文件是否存在:', fileExists);

// 获取文件信息
fs.stat('example.txt', (error, stats) => {
  if (error) {
    return console.error('获取文件信息失败:', error.message);
  }
  console.log('是否是文件:', stats.isFile());
  console.log('是否是目录:', stats.isDirectory());
  console.log('文件大小:', stats.size, '字节');
  console.log('创建时间:', stats.birthtime);
});

// 创建目录
fs.mkdirSync('new-directory', { recursive: true });
console.log('目录创建成功');

// 读取目录
fs.readdir('./', (error, files) => {
  if (error) {
    return console.error('读取目录失败:', error.message);
  }
  console.log('目录内容:', files);
  
  // 遍历目录内容
  files.forEach(file => {
    const filePath = path.join('./', file);
    const stats = fs.statSync(filePath);
    console.log(`${file}: ${stats.isDirectory() ? '目录' : '文件'}`);
  });
});
```

## 路径处理 | Path Handling

Node.js 的 `path` 模块提供了处理文件路径的工具函数。

```javascript
const path = require('path');

// 路径拼接
const filePath = path.join(__dirname, 'folder', 'file.txt');
console.log('拼接后的路径:', filePath);

// 获取路径的目录名
const dirName = path.dirname(filePath);
console.log('目录名:', dirName);

// 获取路径的文件名
const fileName = path.basename(filePath);
console.log('文件名:', fileName);

// 获取路径的扩展名
const extName = path.extname(filePath);
console.log('扩展名:', extName);

// 获取路径的文件名（不包含扩展名）
const fileNameWithoutExt = path.basename(filePath, extName);
console.log('不含扩展名的文件名:', fileNameWithoutExt);

// 解析路径
const parsedPath = path.parse(filePath);
console.log('解析后的路径:', parsedPath);

// 规范化路径
const normalizedPath = path.normalize('/folder/../file.txt');
console.log('规范化后的路径:', normalizedPath);

// 判断是否是绝对路径
const isAbsolute = path.isAbsolute(filePath);
console.log('是否是绝对路径:', isAbsolute);

// 获取相对路径
const relativePath = path.relative('/home/user', '/home/user/folder/file.txt');
console.log('相对路径:', relativePath);
```

## 进程管理 | Process Management

Node.js 的 `process` 对象提供了有关当前 Node.js 进程的信息并对其进行控制。

```javascript
// 访问进程信息
console.log('进程 ID:', process.pid);
console.log('父进程 ID:', process.ppid);
console.log('Node.js 版本:', process.version);
console.log('操作系统平台:', process.platform);
console.log('CPU 架构:', process.arch);
console.log('当前工作目录:', process.cwd());

// 访问环境变量
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PATH:', process.env.PATH);

// 命令行参数
console.log('命令行参数:', process.argv);

// 设置退出码
process.exitCode = 0;  // 成功退出

// 监听退出事件
process.on('exit', (code) => {
  console.log(`进程即将退出，退出码: ${code}`);
});

// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  // 这里应该进行清理操作
  process.exit(1);  // 非零退出码表示出错
});

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

// 发送信号
process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭...');
  process.exit(0);
});

// 内存使用情况
console.log('内存使用情况:', process.memoryUsage());

// 运行时间
console.log('进程运行时间（秒）:', process.uptime());
```

## 子进程 | Child Processes

Node.js 的 `child_process` 模块允许创建子进程以执行外部命令。

### 创建子进程 | Creating Child Processes

```javascript
const { exec, spawn, fork } = require('child_process');

// exec - 执行命令并缓冲输出
console.log('使用 exec 执行命令:');
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error('exec 错误:', error);
    return;
  }
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
});

// spawn - 执行命令并流式处理输出
console.log('\n使用 spawn 执行命令:');
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码: ${code}`);
});

// fork - 创建新的 Node.js 进程
// 注意: 需要一个 worker.js 文件
/*
console.log('\n使用 fork 创建子进程:');
const worker = fork('./worker.js');

worker.on('message', (message) => {
  console.log('从子进程收到消息:', message);
});

worker.send({ hello: 'world' });
*/
```

### 管道通信 | Piping

```javascript
const { spawn } = require('child_process');

// 创建管道连接两个进程
const grep = spawn('grep', ['hello']);
const ls = spawn('ls', ['-la']);

// 将 ls 的输出作为 grep 的输入
ls.stdout.pipe(grep.stdin);

// 打印 grep 的输出
grep.stdout.on('data', (data) => {
  console.log(`找到匹配: ${data}`);
});

// 错误处理
ls.stderr.on('data', (data) => {
  console.error(`ls stderr: ${data}`);
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});
```

## 示例 worker.js 文件 | Example worker.js File

```javascript
// worker.js - 用于 fork 示例

// 监听来自父进程的消息
process.on('message', (message) => {
  console.log('子进程收到消息:', message);
  
  // 执行一些计算
  const result = message.hello + ' ' + 'processed';
  
  // 向父进程发送结果
  process.send({ result });
});

// 模拟一些工作
setInterval(() => {
  // 可以在这里进行一些后台处理
}, 1000);
```

## 执行方式 | Execution Methods

在本章节中，所有 JavaScript 示例都可以通过 Node.js 运行：

```bash
# 运行 CommonJS 模块
node filename.js

# 运行 ES 模块
node --experimental-modules filename.mjs
# 或者在 package.json 中设置 "type": "module" 后
node filename.js
```

请查看 `examples.js` 文件获取更多可执行的示例代码。