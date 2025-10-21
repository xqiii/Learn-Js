// Node.js Core Modules 示例代码
// 这些示例演示了 Node.js 核心模块的基本用法

// ============= HTTP 模块示例 =============
console.log('===== HTTP 模块示例 =====');

// HTTP 服务器示例 - 运行前请取消注释
/*
const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;
  
  console.log(`${method} ${url}`);
  
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, Node.js HTTP Server!\n');
  } else if (url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from API', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}/`);
});
*/

// HTTP 客户端示例
function httpClientExample() {
  const http = require('http');
  
  console.log('发送 HTTP GET 请求...');
  
  // 使用 http.get 发送 GET 请求
  http.get('http://nodejs.org/dist/index.json', (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];
    
    console.log(`状态码: ${statusCode}`);
    console.log(`内容类型: ${contentType}`);
    
    let error;
    if (statusCode !== 200) {
      error = new Error(`请求失败: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`无效的内容类型: ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // 消耗响应数据以释放内存
      res.resume();
      return;
    }
    
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
      console.log(`接收到数据块，大小: ${chunk.length} 字节`);
    });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log('最近的 Node.js 版本:', parsedData[0].version);
      } catch (e) {
        console.error('解析数据失败:', e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`请求错误: ${e.message}`);
  });
}

// ============= URL 模块示例 =============
console.log('\n===== URL 模块示例 =====');

function urlExample() {
  const url = require('url');
  
  // 使用 URL 构造函数解析 URL
  const myUrl = new URL('https://user:pass@example.com:8080/path/to/page?name=John&age=30#section1');
  
  console.log('URL 解析结果:');
  console.log('协议:', myUrl.protocol);
  console.log('主机名:', myUrl.hostname);
  console.log('端口:', myUrl.port);
  console.log('路径名:', myUrl.pathname);
  console.log('搜索参数:', myUrl.search);
  console.log('哈希:', myUrl.hash);
  console.log('用户名:', myUrl.username);
  console.log('密码:', myUrl.password);
  
  // 获取查询参数
  console.log('查询参数 name:', myUrl.searchParams.get('name'));
  console.log('查询参数 age:', myUrl.searchParams.get('age'));
  
  // 格式化 URL 对象为字符串
  const urlObject = {
    protocol: 'https',
    hostname: 'example.org',
    pathname: '/api',
    search: '?query=test'
  };
  
  console.log('\n格式化后的 URL:', url.format(urlObject));
}

// ============= Query String 模块示例 =============
console.log('\n===== Query String 模块示例 =====');

function querystringExample() {
  const querystring = require('querystring');
  
  // 解析查询字符串
  const query = 'name=Alice&age=25&city=New%20York&skills=javascript&skills=nodejs';
  const parsed = querystring.parse(query);
  
  console.log('解析后的查询对象:', parsed);
  console.log('name 值:', parsed.name);
  console.log('skills 值:', parsed.skills); // 注意 skills 有多个值
  
  // 字符串化对象
  const obj = {
    name: 'Bob',
    age: '30',
    city: 'Boston',
    tags: ['developer', 'nodejs']
  };
  
  const stringified = querystring.stringify(obj);
  console.log('\n字符串化的查询:', stringified);
  
  // 自定义分隔符
  const customStringified = querystring.stringify(obj, ';', ':');
  console.log('自定义格式查询:', customStringified);
}

// ============= Crypto 模块示例 =============
console.log('\n===== Crypto 模块示例 =====');

function cryptoExample() {
  const crypto = require('crypto');
  
  // 创建哈希
  const data = 'Hello, Crypto World!';
  
  const md5Hash = crypto.createHash('md5').update(data).digest('hex');
  const sha256Hash = crypto.createHash('sha256').update(data).digest('hex');
  const sha512Hash = crypto.createHash('sha512').update(data).digest('hex');
  
  console.log('原始数据:', data);
  console.log('MD5 哈希:', md5Hash);
  console.log('SHA256 哈希:', sha256Hash);
  console.log('SHA512 哈希:', sha512Hash);
  
  // HMAC 示例
  const secret = 'mySecretKey123';
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  console.log('\nHMAC (SHA256):', hmac);
  
  // 随机数生成
  const randomBytes = crypto.randomBytes(16);
  console.log('\n随机字节:', randomBytes);
  console.log('十六进制随机数:', randomBytes.toString('hex'));
  console.log('Base64 随机数:', randomBytes.toString('base64'));
}

// ============= OS 模块示例 =============
console.log('\n===== OS 模块示例 =====');

function osExample() {
  const os = require('os');
  
  console.log('操作系统信息:');
  console.log('类型:', os.type());
  console.log('平台:', os.platform());
  console.log('架构:', os.arch());
  console.log('版本:', os.release());
  console.log('主机名:', os.hostname());
  
  console.log('\n内存信息 (GB):');
  const totalMem = os.totalmem() / (1024 * 1024 * 1024);
  const freeMem = os.freemem() / (1024 * 1024 * 1024);
  console.log('总内存:', totalMem.toFixed(2));
  console.log('空闲内存:', freeMem.toFixed(2));
  console.log('使用中内存:', (totalMem - freeMem).toFixed(2));
  
  console.log('\nCPU 信息:');
  const cpus = os.cpus();
  console.log('CPU 核心数:', cpus.length);
  console.log('CPU 型号:', cpus[0].model);
  console.log('CPU 速度 (MHz):', cpus[0].speed);
  
  console.log('\n系统目录:');
  console.log('临时目录:', os.tmpdir());
  console.log('主目录:', os.homedir());
  
  // 系统正常运行时间
  const uptime = os.uptime();
  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  
  console.log('\n系统运行时间:', `${days}天 ${hours}小时 ${minutes}分钟`);
}

// ============= Path 模块示例 =============
console.log('\n===== Path 模块示例 =====');

function pathExample() {
  const path = require('path');
  
  const filePath = '/Users/user/Documents/Project/file.js';
  
  console.log('路径解析:');
  console.log('目录名:', path.dirname(filePath));
  console.log('文件名:', path.basename(filePath));
  console.log('扩展名:', path.extname(filePath));
  console.log('无扩展名文件名:', path.basename(filePath, path.extname(filePath)));
  
  console.log('\n路径处理:');
  console.log('规范化:', path.normalize('/users/user/../documents//project/'));
  console.log('是否绝对路径:', path.isAbsolute(filePath));
  console.log('是否绝对路径:', path.isAbsolute('relative/path'));
  
  console.log('\n路径拼接:');
  console.log('join:', path.join('users', 'user', 'documents', 'file.txt'));
  console.log('resolve:', path.resolve('users', 'user', 'documents'));
  
  // 相对路径计算
  const from = '/users/user/documents';
  const to = '/users/user/downloads/file.txt';
  console.log('\n相对路径计算:');
  console.log(`从 ${from} 到 ${to}:`, path.relative(from, to));
  
  console.log('\n路径分隔符:');
  console.log('path.sep:', path.sep);
  console.log('path.delimiter:', path.delimiter);
}

// ============= File System 模块示例 =============
console.log('\n===== File System 模块示例 =====');

function fsExample() {
  const fs = require('fs');
  const path = require('path');
  
  // 确保测试目录存在
  const testDir = path.join(__dirname, 'test-fs');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
    console.log('创建测试目录:', testDir);
  }
  
  // 测试文件路径
  const testFile = path.join(testDir, 'test.txt');
  
  // 同步写入文件
  try {
    fs.writeFileSync(testFile, 'Hello, File System!\n这是测试内容。', 'utf8');
    console.log('同步写入文件成功');
  } catch (err) {
    console.error('同步写入文件失败:', err.message);
  }
  
  // 同步读取文件
  try {
    const data = fs.readFileSync(testFile, 'utf8');
    console.log('\n同步读取的文件内容:');
    console.log(data);
  } catch (err) {
    console.error('同步读取文件失败:', err.message);
  }
  
  // 异步追加内容
  fs.appendFile(testFile, '\n这是追加的内容。', 'utf8', (err) => {
    if (err) {
      console.error('异步追加内容失败:', err.message);
      return;
    }
    console.log('异步追加内容成功');
    
    // 追加后读取文件
    fs.readFile(testFile, 'utf8', (err, data) => {
      if (err) {
        console.error('异步读取文件失败:', err.message);
        return;
      }
      console.log('\n追加后异步读取的文件内容:');
      console.log(data);
    });
  });
  
  // 读取目录
  try {
    const files = fs.readdirSync(testDir);
    console.log('\n测试目录内容:', files);
  } catch (err) {
    console.error('读取目录失败:', err.message);
  }
}

// ============= Stream 模块示例 =============
console.log('\n===== Stream 模块示例 =====');

function streamExample() {
  const fs = require('fs');
  const path = require('path');
  
  const testDir = path.join(__dirname, 'test-fs');
  const sourceFile = path.join(testDir, 'large-file.txt');
  const destFile = path.join(testDir, 'copied-file.txt');
  
  // 先创建一个较大的测试文件
  try {
    let largeContent = '';
    for (let i = 0; i < 10000; i++) {
      largeContent += `这是第 ${i + 1} 行测试数据。\n`;
    }
    fs.writeFileSync(sourceFile, largeContent, 'utf8');
    console.log('创建了测试大文件');
  } catch (err) {
    console.error('创建测试文件失败:', err.message);
    return;
  }
  
  console.log('开始使用流复制文件...');
  
  // 创建可读流和可写流
  const readableStream = fs.createReadStream(sourceFile, {
    encoding: 'utf8',
    highWaterMark: 8192  // 8KB 缓冲区
  });
  
  const writableStream = fs.createWriteStream(destFile);
  
  let chunkCount = 0;
  
  // 监听可读流事件
  readableStream.on('data', (chunk) => {
    chunkCount++;
    console.log(`处理数据块 #${chunkCount}, 大小: ${chunk.length} 字节`);
    writableStream.write(chunk);
  });
  
  readableStream.on('end', () => {
    console.log('读取完成，所有数据块已处理');
    writableStream.end();
  });
  
  writableStream.on('finish', () => {
    console.log('文件复制完成');
    
    // 验证文件大小
    const sourceStats = fs.statSync(sourceFile);
    const destStats = fs.statSync(destFile);
    console.log(`源文件大小: ${sourceStats.size} 字节`);
    console.log(`目标文件大小: ${destStats.size} 字节`);
    console.log(`复制是否成功: ${sourceStats.size === destStats.size}`);
  });
  
  // 使用管道（更简洁的方式）
  const pipedDest = path.join(testDir, 'piped-file.txt');
  console.log('\n使用管道复制文件...');
  
  const pipeReadable = fs.createReadStream(sourceFile);
  const pipeWritable = fs.createWriteStream(pipedDest);
  
  pipeReadable.pipe(pipeWritable);
  
  pipeWritable.on('finish', () => {
    console.log('管道复制完成');
  });
}

// ============= Events 模块示例 =============
console.log('\n===== Events 模块示例 =====');

function eventsExample() {
  const EventEmitter = require('events');
  
  // 创建自定义事件发射器
  class MessageEmitter extends EventEmitter {}
  
  const messageEmitter = new MessageEmitter();
  
  // 注册事件监听器
  messageEmitter.on('message', (data) => {
    console.log('接收到消息:', data);
  });
  
  // 注册一次性事件监听器
  messageEmitter.once('oneTimeEvent', () => {
    console.log('一次性事件被触发，只会执行一次');
  });
  
  // 注册错误事件监听器
  messageEmitter.on('error', (error) => {
    console.error('捕获到错误:', error.message);
  });
  
  // 触发事件
  messageEmitter.emit('message', { text: 'Hello, Events!', timestamp: new Date() });
  messageEmitter.emit('message', { text: 'This is another message', timestamp: new Date() });
  
  // 触发一次性事件
  messageEmitter.emit('oneTimeEvent');
  messageEmitter.emit('oneTimeEvent'); // 不会触发，因为是一次性监听器
  
  // 触发错误事件
  messageEmitter.emit('error', new Error('测试错误事件'));
  
  // 获取事件名称和监听器数量
  console.log('\n监听的事件名称:', messageEmitter.eventNames());
  console.log('message 事件监听器数量:', messageEmitter.listenerCount('message'));
}

// 运行所有示例
console.log('开始运行 Node.js 核心模块示例...\n');

// 运行 URL 模块示例
urlExample();

// 运行 Query String 模块示例
querystringExample();

// 运行 Crypto 模块示例
cryptoExample();

// 运行 OS 模块示例
osExample();

// 运行 Path 模块示例
pathExample();

// 运行 File System 模块示例
fsExample();

// 运行 Events 模块示例
eventsExample();

// 延迟运行 Stream 示例，等待文件系统操作完成
setTimeout(() => {
  streamExample();
}, 2000);

// 延迟运行 HTTP 客户端示例
setTimeout(() => {
  console.log('\n===== 运行 HTTP 客户端示例 =====');
  httpClientExample();
}, 4000);

console.log('\n示例程序已启动，请查看输出...');
console.log('注意: 要运行 HTTP 服务器示例，请取消相关注释');

/*
执行说明：

1. 运行全部示例：
   node examples.js

2. 运行特定模块示例：
   可以修改此文件，只调用你感兴趣的示例函数

3. HTTP 服务器示例：
   - 取消 HTTP 服务器部分的注释
   - 运行: node examples.js
   - 打开浏览器访问: http://localhost:3000/
   - 或使用 curl 测试: curl http://localhost:3000/
   - 测试 API: curl http://localhost:3000/api/data

4. 文件系统示例会在当前目录创建 test-fs 文件夹
   包含示例文件，运行后可以检查

5. 清理测试文件：
   运行完成后可以删除 test-fs 目录
*/