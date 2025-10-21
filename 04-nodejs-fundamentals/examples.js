// Node.js Fundamentals Examples
// 执行方式: node examples.js

console.log('===== Node.js 基础示例 =====\n');

// ===== 模块系统示例 =====
console.log('----- 模块系统 -----');

// 我们将演示如何创建和使用模块
// 创建一个简单的自定义模块示例

// 首先，我们创建一个模拟的模块导出
const mockMathModule = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : 'Error: Division by zero'
};

console.log('模拟模块加法:', mockMathModule.add(5, 3));
console.log('模拟模块乘法:', mockMathModule.multiply(4, 7));
console.log('模拟模块除法:', mockMathModule.divide(10, 2));
console.log('模拟模块除零错误:', mockMathModule.divide(8, 0));

// 演示如何使用内置模块
const path = require('path');
const os = require('os');

console.log('\n内置模块示例:');
console.log('当前文件路径:', __filename);
console.log('当前目录路径:', __dirname);
console.log('操作系统类型:', os.type());
console.log('操作系统平台:', os.platform());

// ===== 文件系统操作示例 =====
console.log('\n----- 文件系统操作 -----');

const fs = require('fs');
const fsPromises = fs.promises;

// 创建一个测试文件
async function fileSystemExample() {
  const testFileName = 'test-file.txt';
  
  try {
    // 写入文件
    console.log(`创建文件: ${testFileName}`);
    await fsPromises.writeFile(testFileName, '这是一个测试文件内容\nNode.js 文件系统操作示例', 'utf8');
    console.log('文件写入成功');
    
    // 读取文件
    console.log('\n读取文件内容:');
    const content = await fsPromises.readFile(testFileName, 'utf8');
    console.log(content);
    
    // 追加内容
    console.log('\n追加内容到文件...');
    await fsPromises.appendFile(testFileName, '\n这是追加的内容', 'utf8');
    
    // 再次读取文件
    console.log('\n追加后的文件内容:');
    const updatedContent = await fsPromises.readFile(testFileName, 'utf8');
    console.log(updatedContent);
    
    // 获取文件信息
    console.log('\n文件信息:');
    const stats = await fsPromises.stat(testFileName);
    console.log(`是否是文件: ${stats.isFile()}`);
    console.log(`文件大小: ${stats.size} 字节`);
    console.log(`创建时间: ${stats.birthtime}`);
    
    // 创建测试目录
    const testDirName = 'test-directory';
    console.log(`\n创建目录: ${testDirName}`);
    await fsPromises.mkdir(testDirName, { recursive: true });
    console.log('目录创建成功');
    
    // 读取当前目录
    console.log('\n当前目录内容:');
    const files = await fsPromises.readdir('.');
    files.forEach(file => {
      console.log(`- ${file}`);
    });
    
    // 清理 - 删除创建的文件和目录
    console.log('\n清理 - 删除创建的文件和目录...');
    await fsPromises.unlink(testFileName);
    await fsPromises.rmdir(testDirName);
    console.log('清理完成');
    
  } catch (error) {
    console.error('文件系统操作错误:', error.message);
  }
}

// 执行文件系统示例
fileSystemExample();

// ===== 路径处理示例 =====
console.log('\n----- 路径处理 -----');

// 路径拼接
const joinedPath = path.join(__dirname, 'folder', 'subfolder', 'file.txt');
console.log('拼接后的路径:', joinedPath);

// 路径解析
const parsedPath = path.parse(joinedPath);
console.log('解析后的路径:', parsedPath);
console.log(`目录名: ${parsedPath.dir}`);
console.log(`文件名: ${parsedPath.base}`);
console.log(`扩展名: ${parsedPath.ext}`);
console.log(`名称(无扩展名): ${parsedPath.name}`);

// 规范化路径
const messyPath = '/folder/../subfolder/./file.txt';
const normalizedPath = path.normalize(messyPath);
console.log('混乱路径:', messyPath);
console.log('规范化后:', normalizedPath);

// 绝对路径检查
const relativePath = 'folder/file.txt';
const absolutePath = '/home/user/file.txt';
console.log(`${relativePath} 是否是绝对路径:`, path.isAbsolute(relativePath));
console.log(`${absolutePath} 是否是绝对路径:`, path.isAbsolute(absolutePath));

// 相对路径计算
const fromPath = '/home/user';
const toPath = '/home/user/projects/node-app';
console.log(`从 ${fromPath} 到 ${toPath} 的相对路径:`, path.relative(fromPath, toPath));

// ===== 进程管理示例 =====
console.log('\n----- 进程管理 -----');

// 进程信息
console.log('进程 ID:', process.pid);
console.log('父进程 ID:', process.ppid);
console.log('Node.js 版本:', process.version);
console.log('操作系统平台:', process.platform);
console.log('CPU 架构:', process.arch);
console.log('当前工作目录:', process.cwd());

// 环境变量
console.log('\n环境变量示例:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PATH (前100个字符):', process.env.PATH ? process.env.PATH.substring(0, 100) + '...' : '未设置');

// 命令行参数
console.log('\n命令行参数:');
console.log('参数数量:', process.argv.length);
process.argv.forEach((arg, index) => {
  console.log(`参数 ${index}: ${arg}`);
});

// 内存使用情况
console.log('\n内存使用情况:');
const memoryUsage = process.memoryUsage();
console.log(`RSS (常驻集大小): ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`);
console.log(`堆总量: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`);
console.log(`堆使用量: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`);
console.log(`外部内存: ${Math.round(memoryUsage.external / 1024 / 1024)} MB`);

// 运行时间
console.log('\n进程运行时间:');
const uptimeInSeconds = process.uptime();
console.log(`${uptimeInSeconds.toFixed(2)} 秒`);

// 演示信号处理（在实际运行时可能需要按 Ctrl+C 来触发）
console.log('\n信号处理演示:');
console.log('按 Ctrl+C 可以触发 SIGINT 信号处理');
console.log('(这个演示会在10秒后自动结束)');

// 临时的信号处理器
function handleSigint() {
  console.log('\n接收到 SIGINT 信号 (Ctrl+C)');
  console.log('执行清理操作...');
  console.log('程序优雅退出');
  
  // 移除处理器以避免多次执行
  process.removeListener('SIGINT', handleSigint);
  
  // 设置退出码
  process.exitCode = 0;
}

// 添加信号处理器
process.on('SIGINT', handleSigint);

// ===== 子进程示例 =====
console.log('\n----- 子进程 -----');

const { exec, spawn } = require('child_process');

// exec 示例 - 执行简单命令
console.log('使用 exec 执行 "ls -la" 命令:');
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec 错误: ${error}`);
    return;
  }
  console.log('stdout:\n', stdout);
  if (stderr) {
    console.error('stderr:\n', stderr);
  }
});

// 演示 spawn - 执行命令并流式处理输出
// 为了简化示例，我们使用一个简单的命令
setTimeout(() => {
  console.log('\n使用 spawn 执行命令:');
  
  // 根据操作系统选择合适的命令
  const command = process.platform === 'win32' ? 'dir' : 'ls';
  const args = process.platform === 'win32' ? ['/w'] : ['-la'];
  
  const childProcess = spawn(command, args);
  
  console.log(`执行命令: ${command} ${args.join(' ')}`);
  
  childProcess.stdout.on('data', (data) => {
    console.log(`stdout:\n${data}`);
  });
  
  childProcess.stderr.on('data', (data) => {
    console.error(`stderr:\n${data}`);
  });
  
  childProcess.on('close', (code) => {
    console.log(`子进程退出码: ${code}`);
  });
}, 2000);

// 创建一个临时的子 JavaScript 文件用于 fork 演示
async function createWorkerFile() {
  const workerCode = `
    // 这是一个工作进程
    console.log('工作进程已启动，PID:', process.pid);
    
    // 监听来自父进程的消息
    process.on('message', (message) => {
      console.log('工作进程收到消息:', message);
      
      // 处理消息并发送响应
      if (message.type === 'compute') {
        const result = message.value * 2;
        process.send({ result: result });
      } else if (message.type === 'exit') {
        console.log('工作进程接收到退出信号');
        process.exit(0);
      }
    });
  `;
  
  const workerFileName = 'temp-worker.js';
  
  try {
    await fsPromises.writeFile(workerFileName, workerCode, 'utf8');
    console.log(`\n已创建临时工作进程文件: ${workerFileName}`);
    
    // 使用 fork 创建子进程
    setTimeout(async () => {
      try {
        const { fork } = require('child_process');
        console.log('\n使用 fork 创建子进程:');
        
        const worker = fork(workerFileName);
        
        // 向子进程发送消息
        worker.send({ type: 'compute', value: 42 });
        
        // 接收子进程的消息
        worker.on('message', (message) => {
          console.log('父进程收到工作进程的响应:', message);
          // 发送退出消息
          worker.send({ type: 'exit' });
        });
        
        worker.on('exit', (code) => {
          console.log(`工作进程已退出，退出码: ${code}`);
          
          // 清理临时文件
          fsPromises.unlink(workerFileName)
            .then(() => console.log(`已删除临时工作进程文件: ${workerFileName}`))
            .catch(err => console.error(`删除临时文件失败: ${err.message}`));
        });
      } catch (error) {
        console.error('Fork 示例错误:', error.message);
        // 清理临时文件
        await fsPromises.unlink(workerFileName).catch(() => {});
      }
    }, 3000);
    
  } catch (error) {
    console.error('创建工作进程文件失败:', error.message);
  }
}

// 创建工作进程文件并演示 fork
createWorkerFile();

// ===== 超时退出 =====
console.log('\n示例程序将在15秒后自动退出...');
setTimeout(() => {
  console.log('\n程序超时，正在退出...');
  // 移除信号处理器
  process.removeListener('SIGINT', handleSigint);
  console.log('===== 所有示例执行完毕 =====');
  console.log('\n执行命令: node examples.js');
  
  // 注意：在实际环境中，我们不会在这里调用 process.exit()，
  // 除非是在特定的脚本中需要强制退出
  // 这里只是为了确保演示在有限时间内结束
}, 15000);