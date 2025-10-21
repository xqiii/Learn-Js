# Node.js Core Modules | Node.js 核心模块

## 学习目标 | Learning Objectives

学习本章节后，你将能够：
- 熟练使用 Node.js 的核心模块进行开发
- 创建 HTTP 和 HTTPS 服务器
- 处理 URL 和查询字符串
- 实现基本的加密功能
- 获取操作系统信息
- 处理文件路径和文件系统操作
- 理解和使用事件触发器

## HTTP 模块 | HTTP Module

HTTP 模块是 Node.js 最常用的核心模块之一，用于创建 HTTP 服务器和客户端。

### 创建 HTTP 服务器 | Creating an HTTP Server

```javascript
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // 发送响应体
  res.end('Hello, World!\n');
});

// 监听端口
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
});
```

### 处理不同的请求方法和路径 | Handling Different Request Methods and Paths

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // 获取请求方法和路径
  const { method, url } = req;
  
  console.log(`${method} ${url}`);
  
  // 根据路径和方法处理请求
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('欢迎访问首页!\n');
  } else if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('关于我们页面\n');
  } else if (url === '/data' && method === 'POST') {
    // 处理 POST 请求数据
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true, data: body }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 未找到\n');
  }
});

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000/');
});
```

### 创建 HTTP 客户端 | Creating an HTTP Client

```javascript
const http = require('http');

// 发送 GET 请求
const options = {
  hostname: 'api.example.com',
  port: 80,
  path: '/data',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log('响应头:', res.headers);
  
  let data = '';
  
  // 接收数据
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // 数据接收完成
  res.on('end', () => {
    console.log('响应数据:', data);
  });
});

// 错误处理
req.on('error', (error) => {
  console.error('请求错误:', error);
});

// 结束请求
req.end();

// 简单的 GET 请求快捷方法
http.get('http://api.example.com/data', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('GET 响应:', data);
  });
}).on('error', (error) => {
  console.error('GET 请求错误:', error);
});
```

## HTTPS 模块 | HTTPS Module

HTTPS 模块提供了创建安全的 HTTPS 服务器和客户端的功能。

### 创建 HTTPS 服务器 | Creating an HTTPS Server

```javascript
const https = require('https');
const fs = require('fs');

// 读取 SSL 证书和密钥
const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

// 创建 HTTPS 服务器
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('安全的 HTTPS 服务器\n');
});

const PORT = 443;
server.listen(PORT, () => {
  console.log(`HTTPS 服务器运行在 https://localhost:${PORT}/`);
});
```

### 创建 HTTPS 客户端 | Creating an HTTPS Client

```javascript
const https = require('https');

// 发送 HTTPS 请求
https.get('https://api.example.com/secure-data', (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log('响应头:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('HTTPS 响应:', data);
  });
}).on('error', (error) => {
  console.error('HTTPS 请求错误:', error);
});
```

## URL 模块 | URL Module

URL 模块提供了解析和格式化 URL 的功能。

```javascript
const url = require('url');

// 解析 URL
const myUrl = new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');

console.log('协议:', myUrl.protocol);  // 输出: https:
console.log('主机名:', myUrl.hostname); // 输出: sub.example.com
console.log('主机:', myUrl.host);       // 输出: sub.example.com:8080
console.log('端口:', myUrl.port);       // 输出: 8080
console.log('路径名:', myUrl.pathname); // 输出: /p/a/t/h
console.log('搜索:', myUrl.search);     // 输出: ?query=string
console.log('查询对象:', myUrl.searchParams); // 输出: URLSearchParams { 'query' => 'string' }
console.log('哈希:', myUrl.hash);       // 输出: #hash
console.log('用户名:', myUrl.username); // 输出: user
console.log('密码:', myUrl.password);   // 输出: pass

// 旧版 API
const parsedUrl = url.parse('https://example.com/path?query=string');
console.log('解析的 URL:', parsedUrl);

// 格式化 URL
const formattedUrl = url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/path',
  query: { key: 'value' }
});
console.log('格式化的 URL:', formattedUrl);  // 输出: https://example.com/path?key=value

// 处理请求 URL
function handleRequest(req) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  console.log('请求路径:', parsedUrl.pathname);
  console.log('查询参数:', parsedUrl.searchParams.get('name'));
}
```

## Query String 模块 | Query String Module

Query String 模块用于解析和格式化 URL 查询字符串。

```javascript
const querystring = require('querystring');

// 解析查询字符串
const query = querystring.parse('name=John&age=30&city=New%20York');
console.log('解析的查询对象:', query);
// 输出: { name: 'John', age: '30', city: 'New York' }

// 格式化对象为查询字符串
const obj = { name: 'Jane', age: '25', city: 'Boston' };
const queryStr = querystring.stringify(obj);
console.log('格式化的查询字符串:', queryStr);
// 输出: name=Jane&age=25&city=Boston

// 自定义分隔符和赋值符
const customQueryStr = querystring.stringify(obj, ';', ':');
console.log('自定义格式的查询字符串:', customQueryStr);
// 输出: name:Jane;age:25;city:Boston

// 编码和解码
const encoded = querystring.escape('Hello World!');
console.log('编码:', encoded);  // 输出: Hello%20World%21

const decoded = querystring.unescape(encoded);
console.log('解码:', decoded);  // 输出: Hello World!
```

## Crypto 模块 | Crypto Module

Crypto 模块提供了加密功能，包括创建哈希值、HMAC、加密和解密等。

### 创建哈希值 | Creating Hashes

```javascript
const crypto = require('crypto');

// 创建 MD5 哈希
const md5Hash = crypto.createHash('md5')
  .update('Hello World')
  .digest('hex');
console.log('MD5 哈希:', md5Hash);

// 创建 SHA256 哈希
const sha256Hash = crypto.createHash('sha256')
  .update('Hello World')
  .digest('hex');
console.log('SHA256 哈希:', sha256Hash);

// 创建 SHA512 哈希
const sha512Hash = crypto.createHash('sha512')
  .update('Hello World')
  .digest('hex');
console.log('SHA512 哈希:', sha512Hash);
```

### HMAC (基于哈希的消息认证码) | HMAC (Hash-based Message Authentication Code)

```javascript
const crypto = require('crypto');

const secretKey = 'mySecretKey';
const message = 'Hello World';

// 创建 HMAC
const hmac = crypto.createHmac('sha256', secretKey)
  .update(message)
  .digest('hex');

console.log('HMAC:', hmac);

// 验证 HMAC
function verifyHMAC(message, receivedHMAC, secretKey) {
  const calculatedHMAC = crypto.createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');
  
  // 安全比较（避免时序攻击）
  return crypto.timingSafeEqual(
    Buffer.from(receivedHMAC, 'hex'),
    Buffer.from(calculatedHMAC, 'hex')
  );
}

console.log('HMAC 验证结果:', verifyHMAC(message, hmac, secretKey));
```

### 加密和解密 | Encryption and Decryption

```javascript
const crypto = require('crypto');

// 加密数据
function encrypt(text, secretKey) {
  // 创建加密算法实例
  const algorithm = 'aes-256-cbc';
  // 生成随机初始化向量
  const iv = crypto.randomBytes(16);
  // 创建加密器
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  // 执行加密
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // 返回初始化向量和加密数据
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  };
}

// 解密数据
function decrypt(encryptedData, secretKey, iv) {
  const algorithm = 'aes-256-cbc';
  // 创建解密器
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  // 执行解密
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  // 返回解密后的明文
  return decrypted.toString();
}

// 生成256位密钥
const secretKey = crypto.randomBytes(32).toString('hex');
const originalText = '这是一段需要加密的敏感信息';

// 加密
const encrypted = encrypt(originalText, secretKey);
console.log('加密结果:');
console.log('IV:', encrypted.iv);
console.log('加密数据:', encrypted.encryptedData);

// 解密
const decryptedText = decrypt(encrypted.encryptedData, secretKey, encrypted.iv);
console.log('解密结果:', decryptedText);
console.log('解密结果与原文一致:', decryptedText === originalText);
```

## OS 模块 | OS Module

OS 模块提供了与操作系统交互的方法，可以获取操作系统的信息。

```javascript
const os = require('os');

// 操作系统相关信息
console.log('操作系统类型:', os.type());
console.log('操作系统平台:', os.platform());
console.log('操作系统版本:', os.release());
console.log('操作系统架构:', os.arch());

// CPU 相关信息
console.log('\nCPU 信息:');
console.log('CPU 核心数:', os.cpus().length);
console.log('CPU 型号:', os.cpus()[0].model);
console.log('CPU 速度 (MHz):', os.cpus()[0].speed);

// 内存相关信息
console.log('\n内存信息:');
console.log('总内存 (GB):', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
console.log('空闲内存 (GB):', (os.freemem() / 1024 / 1024 / 1024).toFixed(2));
console.log('使用中内存 (GB):', ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2));

// 主机名和网络接口
console.log('\n网络信息:');
console.log('主机名:', os.hostname());
console.log('网络接口:');
const networkInterfaces = os.networkInterfaces();
Object.keys(networkInterfaces).forEach(interfaceName => {
  console.log(`\n${interfaceName}:`);
  networkInterfaces[interfaceName].forEach(iface => {
    console.log(`  IP地址: ${iface.address}`);
    console.log(`  子网掩码: ${iface.netmask}`);
    console.log(`  内部: ${iface.internal}`);
  });
});

// 系统目录
console.log('\n系统目录:');
console.log('临时目录:', os.tmpdir());
console.log('主目录:', os.homedir());

// 运行时间
console.log('\n系统运行时间:');
const uptime = os.uptime();
const days = Math.floor(uptime / (24 * 60 * 60));
const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
const minutes = Math.floor((uptime % (60 * 60)) / 60);
const seconds = Math.floor(uptime % 60);
console.log(`已运行: ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`);
```

## Path 模块 | Path Module

Path 模块提供了处理文件路径的工具函数。

```javascript
const path = require('path');

// 路径解析和格式化
const filePath = '/Users/user/documents/project/file.txt';

console.log('规范化路径:', path.normalize('/users/user/../documents//project/'));
console.log('解析路径:', path.parse(filePath));
console.log('格式化路径:', path.format(path.parse(filePath)));

// 获取路径各部分
console.log('目录名:', path.dirname(filePath));
console.log('文件名:', path.basename(filePath));
console.log('扩展名:', path.extname(filePath));
console.log('无扩展名文件名:', path.basename(filePath, path.extname(filePath)));

// 路径拼接
console.log('路径拼接:', path.join('users', 'user', 'documents', 'file.txt'));

// 绝对路径检查
console.log('是否是绝对路径:', path.isAbsolute(filePath));
console.log('是否是绝对路径:', path.isAbsolute('relative/path'));

// 相对路径计算
console.log('相对路径:', path.relative('/users/user/documents', '/users/user/downloads'));

// 分隔符
console.log('路径分隔符:', path.sep);
console.log('环境变量分隔符:', path.delimiter);
```

## File System 模块 | File System Module

File System 模块提供了文件系统操作的 API。

### 同步操作 | Synchronous Operations

```javascript
const fs = require('fs');
const path = require('path');

// 读取文件
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('文件内容:', data);
} catch (error) {
  console.error('读取文件失败:', error.message);
}

// 写入文件
try {
  fs.writeFileSync('output.txt', '这是写入的内容', 'utf8');
  console.log('文件写入成功');
} catch (error) {
  console.error('写入文件失败:', error.message);
}

// 追加内容到文件
try {
  fs.appendFileSync('output.txt', '\n这是追加的内容', 'utf8');
  console.log('内容追加成功');
} catch (error) {
  console.error('追加内容失败:', error.message);
}

// 创建目录
try {
  fs.mkdirSync('new-directory', { recursive: true });
  console.log('目录创建成功');
} catch (error) {
  console.error('创建目录失败:', error.message);
}

// 读取目录
try {
  const files = fs.readdirSync('.');
  console.log('目录内容:', files);
} catch (error) {
  console.error('读取目录失败:', error.message);
}

// 检查文件是否存在
const fileExists = fs.existsSync('example.txt');
console.log('文件是否存在:', fileExists);

// 获取文件信息
try {
  const stats = fs.statSync('example.txt');
  console.log('文件大小:', stats.size);
  console.log('是否是文件:', stats.isFile());
  console.log('是否是目录:', stats.isDirectory());
  console.log('修改时间:', stats.mtime);
} catch (error) {
  console.error('获取文件信息失败:', error.message);
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

// Promise API (Node.js v10+)
const fsPromises = fs.promises;

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

## Stream 模块 | Stream Module

Stream 模块提供了处理流数据的 API，是 Node.js 中处理大量数据的高效方式。

### 流的类型 | Types of Streams

1. **Readable Stream**: 可读流，用于读取数据
2. **Writable Stream**: 可写流，用于写入数据
3. **Duplex Stream**: 双工流，既可以读取也可以写入
4. **Transform Stream**: 转换流，用于数据转换

### 可读流示例 | Readable Stream Example

```javascript
const fs = require('fs');

// 创建可读流
const readableStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024  // 64KB 的缓冲区
});

// 监听数据事件
readableStream.on('data', (chunk) => {
  console.log(`接收到 ${chunk.length} 字节的数据`);
  // 处理数据块
});

// 监听结束事件
readableStream.on('end', () => {
  console.log('数据读取完成');
});

// 监听错误事件
readableStream.on('error', (error) => {
  console.error('读取错误:', error);
});
```

### 可写流示例 | Writable Stream Example

```javascript
const fs = require('fs');

// 创建可写流
const writableStream = fs.createWriteStream('output.txt');

// 写入数据
writableStream.write('第一行数据\n', 'utf8', () => {
  console.log('第一行写入完成');
});

writableStream.write('第二行数据\n', 'utf8', () => {
  console.log('第二行写入完成');
});

// 结束写入
writableStream.end('结束数据', () => {
  console.log('写入完成');
});

// 监听完成事件
writableStream.on('finish', () => {
  console.log('所有数据已写入');
});

// 监听错误事件
writableStream.on('error', (error) => {
  console.error('写入错误:', error);
});
```

### 管道流示例 | Pipeline Example

```javascript
const fs = require('fs');
const { pipeline } = require('stream');

// 使用管道连接可读流和可写流
const readableStream = fs.createReadStream('input.txt');
const writableStream = fs.createWriteStream('output-piped.txt');

// 方式一：使用 pipe 方法
readableStream.pipe(writableStream);

writableStream.on('finish', () => {
  console.log('管道传输完成');
});

// 方式二：使用 pipeline 方法（更安全，自动处理错误和清理）
pipeline(
  fs.createReadStream('input.txt'),
  fs.createWriteStream('output-pipeline.txt'),
  (error) => {
    if (error) {
      console.error('管道错误:', error);
    } else {
      console.error('pipeline 传输完成');
    }
  }
);
```

## Events 模块 | Events Module

Events 模块提供了事件驱动的架构，Node.js 中的许多核心模块都继承自 EventEmitter 类。

```javascript
const EventEmitter = require('events');

// 创建自定义事件发射器类
class Logger extends EventEmitter {
  log(message) {
    // 输出日志
    console.log(`[${new Date().toISOString()}] ${message}`);
    
    // 触发消息事件
    this.emit('messageLogged', { message, timestamp: new Date() });
  }
  
  error(message) {
    console.error(`[ERROR] ${message}`);
    this.emit('error', { message, timestamp: new Date() });
  }
}

// 创建实例
const logger = new Logger();

// 注册事件监听器
logger.on('messageLogged', (eventData) => {
  console.log('收到消息事件:', eventData);
});

// 注册一次性事件监听器
logger.once('specialEvent', (data) => {
  console.log('特殊事件触发（只执行一次）:', data);
});

// 触发事件
logger.log('这是一条日志消息');
logger.log('这是另一条日志消息');
logger.emit('specialEvent', { id: 1, text: '特殊内容' });
logger.emit('specialEvent', { id: 2, text: '不会被捕获' });  // 不会触发，因为是一次性监听器

// 处理错误事件
logger.on('error', (errorData) => {
  console.log('错误事件处理:', errorData);
});

// 触发错误
logger.error('发生了一个错误');

// 获取事件监听器数量
console.log('messageLogged 事件监听器数量:', logger.listenerCount('messageLogged'));

// 获取所有事件名称
console.log('所有监听的事件:', logger.eventNames());
```

## 执行方式 | Execution Methods

在本章节中，所有 JavaScript 示例都可以通过 Node.js 运行：

```bash
# 运行示例代码
node filename.js
```

对于需要 SSL 证书的 HTTPS 示例，你可以使用 OpenSSL 生成自签名证书：

```bash
# 生成私钥
openssl genrsa -out server-key.pem 2048

# 生成证书签名请求 (CSR)
openssl req -new -key server-key.pem -out server-csr.pem

# 生成自签名证书
openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem
```

请查看 `examples.js` 文件获取更多可执行的示例代码。