// Asynchronous JavaScript Examples
// 执行方式: node examples.js

console.log('===== 异步 JavaScript 示例 =====\n');

// ===== 回调函数 (Callbacks) =====
console.log('----- 回调函数 -----');

// 基本回调函数示例
function fetchData(callback) {
  console.log('开始获取数据...');
  // 模拟异步操作
  setTimeout(() => {
    const data = { id: 1, name: '示例数据' };
    console.log('数据获取完成');
    callback(null, data);
  }, 1000);
}

function processData(error, data) {
  if (error) {
    console.error('处理数据时出错:', error);
    return;
  }
  console.log('处理获取到的数据:', data);
  // 可以在这里进行更多处理
}

// 使用回调函数
fetchData(processData);

// ===== 回调地狱 (Callback Hell) =====
console.log('\n----- 回调地狱 -----');

// 模拟异步API调用
function fetchUser(id, callback) {
  setTimeout(() => {
    console.log(`获取用户数据: ${id}`);
    callback(null, { id, name: `用户${id}` });
  }, 800);
}

function fetchUserPosts(userId, callback) {
  setTimeout(() => {
    console.log(`获取用户${userId}的帖子`);
    callback(null, [{ id: 1, title: '帖子1' }, { id: 2, title: '帖子2' }]);
  }, 600);
}

function fetchPostComments(postId, callback) {
  setTimeout(() => {
    console.log(`获取帖子${postId}的评论`);
    callback(null, [{ id: 1, content: '评论1' }, { id: 2, content: '评论2' }]);
  }, 400);
}

// 回调地狱示例
console.log('回调地狱示例开始:');
fetchUser(1, (error, user) => {
  if (error) return console.error(error);
  
  fetchUserPosts(user.id, (error, posts) => {
    if (error) return console.error(error);
    
    fetchPostComments(posts[0].id, (error, comments) => {
      if (error) return console.error(error);
      
      console.log('最终结果 - 用户:', user.name);
      console.log('最终结果 - 帖子:', posts[0].title);
      console.log('最终结果 - 评论数量:', comments.length);
    });
  });
});

// ===== Promise =====
console.log('\n----- Promise -----');

// 创建Promise
const promise = new Promise((resolve, reject) => {
  console.log('Promise执行器函数运行');
  
  setTimeout(() => {
    const success = true;
    
    if (success) {
      resolve('操作成功完成！');
    } else {
      reject(new Error('操作失败！'));
    }
  }, 1000);
});

// 使用Promise
console.log('Promise已创建，等待完成...');
promise
  .then(result => {
    console.log('Promise成功:', result);
    return '新的结果';
  })
  .then(newResult => {
    console.log('Promise链式调用:', newResult);
  })
  .catch(error => {
    console.error('Promise错误:', error.message);
  })
  .finally(() => {
    console.log('Promise最终执行');
  });

// 将回调函数转为Promise
function fetchDataPromise(success = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ message: 'Promise数据获取成功' });
      } else {
        reject(new Error('Promise数据获取失败'));
      }
    }, 800);
  });
}

// ===== Promise静态方法 =====
console.log('\n----- Promise静态方法 -----');

// 模拟多个异步操作
const promise1 = Promise.resolve('成功1');
const promise2 = new Promise((resolve) => setTimeout(resolve, 500, '成功2'));
const promise3 = Promise.reject(new Error('失败3'));

// Promise.all - 全部成功才成功，一个失败就失败
console.log('\nPromise.all:');
Promise.all([promise1, promise2])
  .then(values => {
    console.log('Promise.all成功:', values);
  })
  .catch(error => {
    console.error('Promise.all错误:', error.message);
  });

// Promise.allSettled - 无论成功失败都返回结果
console.log('\nPromise.allSettled:');
Promise.allSettled([promise1, promise3])
  .then(results => {
    console.log('Promise.allSettled结果:', results);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index + 1} 成功:`, result.value);
      } else {
        console.log(`Promise ${index + 1} 失败:`, result.reason.message);
      }
    });
  });

// Promise.race - 返回第一个完成的结果（无论成功失败）
console.log('\nPromise.race:');
Promise.race([
  new Promise(resolve => setTimeout(resolve, 300, '快速成功')),
  new Promise((_, reject) => setTimeout(reject, 100, new Error('快速失败')))
])
  .then(value => {
    console.log('Promise.race成功:', value);
  })
  .catch(error => {
    console.error('Promise.race失败:', error.message);
  });

// Promise.any - 返回第一个成功的结果，全部失败才失败
console.log('\nPromise.any:');
Promise.any([promise3, promise1])
  .then(value => {
    console.log('Promise.any成功:', value);
  })
  .catch(error => {
    console.error('Promise.any错误:', error.errors);
  });

// ===== Async/Await =====
console.log('\n----- Async/Await -----');

// 基本使用
async function asyncExample() {
  console.log('Async函数开始');
  
  try {
    // 等待Promise完成
    const result = await fetchDataPromise();
    console.log('Async获取数据:', result);
    
    // 返回值会被包装为Promise
    return 'Async函数返回值';
  } catch (error) {
    console.error('Async捕获错误:', error.message);
  } finally {
    console.log('Async函数最终执行');
  }
}

// 调用async函数
asyncExample().then(returnValue => {
  console.log('Async函数返回结果:', returnValue);
});

// 模拟链式异步操作，避免回调地狱
async function asyncChainExample() {
  console.log('\nAsync链式调用开始:');
  
  try {
    // 等待用户数据
    const user = await new Promise(resolve => fetchUser(2, (err, user) => resolve(user)));
    console.log('Async获取用户:', user.name);
    
    // 等待帖子数据
    const posts = await new Promise(resolve => fetchUserPosts(user.id, (err, posts) => resolve(posts)));
    console.log('Async获取帖子:', posts[0].title);
    
    // 等待评论数据
    const comments = await new Promise(resolve => fetchPostComments(posts[0].id, (err, comments) => resolve(comments)));
    console.log('Async获取评论:', comments.length, '条');
    
    return { user, posts, comments };
  } catch (error) {
    console.error('Async链式调用错误:', error);
  }
}

// 并行执行异步操作
async function asyncParallelExample() {
  console.log('\nAsync并行执行开始:');
  
  try {
    // 同时开始多个异步操作
    const [result1, result2] = await Promise.all([
      fetchDataPromise(),
      new Promise(resolve => setTimeout(() => resolve('并行操作结果'), 1200))
    ]);
    
    console.log('并行操作1结果:', result1);
    console.log('并行操作2结果:', result2);
    
    return { result1, result2 };
  } catch (error) {
    console.error('并行操作错误:', error);
  }
}

// ===== 错误处理 (Error Handling) =====
console.log('\n----- 错误处理 -----');

// Promise错误处理
function errorProneOperation(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve('操作成功');
      } else {
        reject(new Error('故意的错误'));
      }
    }, 500);
  });
}

// Promise错误捕获
errorProneOperation(false)
  .then(result => console.log('这不会执行'))
  .catch(error => {
    console.error('Promise错误捕获:', error.message);
    // 可以在这里处理错误或重新抛出
    // throw new Error('重新抛出的错误');
  });

// Async/Await错误处理
async function handleErrorExample() {
  console.log('\nAsync/Await错误处理:');
  
  try {
    // 尝试执行可能失败的操作
    const result = await errorProneOperation(false);
    console.log('这不会执行');
  } catch (error) {
    console.error('Async/Await错误捕获:', error.message);
    // 错误恢复策略
    return '从错误中恢复';
  }
}

// 调用带错误处理的async函数
handleErrorExample().then(result => {
  console.log('错误处理后的返回值:', result);
});

// ===== 事件循环 (Event Loop) 演示 =====
console.log('\n----- 事件循环演示 -----');

console.log('1. 开始同步代码');

// 定时器属于宏任务
setTimeout(() => {
  console.log('4. setTimeout 宏任务执行');
  
  // 在宏任务中添加微任务
  Promise.resolve().then(() => {
    console.log('5. setTimeout中的Promise微任务执行');
  });
}, 0);

// setImmediate属于宏任务 (Node.js)
setImmediate(() => {
  console.log('7. setImmediate 宏任务执行');
});

// Promise.then属于微任务
Promise.resolve().then(() => {
  console.log('3. Promise 微任务执行');
  
  // 在微任务中添加微任务
  Promise.resolve().then(() => {
    console.log('3.1. 嵌套的Promise微任务执行');
  });
});

// process.nextTick属于微任务 (Node.js)，优先级高于Promise
process.nextTick(() => {
  console.log('2. process.nextTick 微任务执行');
});

console.log('1.1. 继续同步代码');

// ===== 定时器 (Timers) =====
console.log('\n----- 定时器 -----');

// setTimeout示例
console.log('设置setTimeout定时器');
const timeoutId = setTimeout(() => {
  console.log('setTimeout 1秒后执行');
}, 1000);

// 清除定时器示例（这里注释掉以便看到执行效果）
// clearTimeout(timeoutId);

// setInterval示例
let intervalCount = 0;
const maxIntervals = 3;

console.log('设置setInterval定时器（将执行3次）');
const intervalId = setInterval(() => {
  intervalCount++;
  console.log(`setInterval 第${intervalCount}次执行（每500毫秒）`);
  
  if (intervalCount >= maxIntervals) {
    console.log('清除setInterval定时器');
    clearInterval(intervalId);
  }
}, 500);

// 嵌套定时器示例（比setInterval更可靠的定时执行）
console.log('\n嵌套定时器示例:');
let nestedCount = 0;
const maxNested = 3;

function nestedTimeout() {
  nestedCount++;
  console.log(`嵌套定时器 第${nestedCount}次执行`);
  
  // 模拟耗时操作
  const startTime = Date.now();
  while (Date.now() - startTime < 200) {}
  
  if (nestedCount < maxNested) {
    setTimeout(nestedTimeout, 500);
  }
}

setTimeout(nestedTimeout, 500);

// ===== 等待所有异步操作完成 =====
console.log('\n开始等待所有异步操作完成...');

// 使用setTimeout确保其他异步操作有时间执行
setTimeout(async () => {
  // 执行async链和并行操作示例
  await asyncChainExample();
  await asyncParallelExample();
  
  console.log('\n===== 所有示例执行完毕 =====');
  console.log('\n执行命令: node examples.js');
}, 3000);