# Asynchronous JavaScript | 异步 JavaScript

## 学习目标

本章将深入探讨JavaScript中的异步编程模式，包括回调函数、Promise对象、async/await语法、错误处理机制、事件循环原理和定时器的使用。异步编程是JavaScript中处理耗时操作的核心概念，对于构建高性能的应用程序至关重要。

## 回调函数 (Callbacks)

回调函数是最基础的异步编程模式，它是一个函数，作为参数传递给另一个函数，在特定事件发生或操作完成后被调用。

### 基本概念

```javascript
function doSomethingAsync(callback) {
  setTimeout(function() {
    console.log('异步操作完成');
    callback(null, '操作结果');
  }, 1000);
}

doSomethingAsync(function(error, result) {
  if (error) {
    console.error('发生错误:', error);
    return;
  }
  console.log('获取到结果:', result);
});
```

### 回调地狱 (Callback Hell)

当多个异步操作需要按顺序执行时，可能会导致代码嵌套层级过深，形成所谓的"回调地狱"或"末日金字塔"。

```javascript
doTask1(function(error, result1) {
  if (error) {
    return console.error(error);
  }
  doTask2(result1, function(error, result2) {
    if (error) {
      return console.error(error);
    }
    doTask3(result2, function(error, result3) {
      if (error) {
        return console.error(error);
      }
      // 继续嵌套...
    });
  });
});
```

### 解决回调地狱的方法

1. **模块化**：将回调函数提取为命名函数
2. **Promise**：使用Promise链式调用
3. **async/await**：使用现代异步语法

## Promise 对象 (Promises)

Promise是ES6引入的处理异步操作的对象，它代表一个异步操作的最终完成（或失败）及其结果值。

### Promise 的三种状态

1. **pending**：初始状态，既不是成功，也不是失败
2. **fulfilled**：操作成功完成
3. **rejected**：操作失败

### 创建 Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // 执行异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功！');
    } else {
      reject('操作失败！');
    }
  }, 1000);
});
```

### Promise 链式调用

```javascript
promise
  .then(result => {
    console.log('成功:', result);
    return '新的结果';
  })
  .then(newResult => {
    console.log('链式调用:', newResult);
  })
  .catch(error => {
    console.error('错误:', error);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### Promise 静态方法

- **Promise.all(iterable)**：当所有Promise都成功时返回包含所有结果的Promise，任一失败则立即失败
- **Promise.race(iterable)**：返回第一个完成的Promise的结果或拒绝原因
- **Promise.resolve(value)**：返回已解析的Promise
- **Promise.reject(reason)**：返回已拒绝的Promise
- **Promise.allSettled(iterable)**：返回包含所有Promise结果的Promise，无论成功或失败
- **Promise.any(iterable)**：返回第一个成功的Promise结果，所有都失败才拒绝

```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(values => {
  console.log(values); // [3, 42, "foo"]
});
```

## Async/Await

async/await是ES2017引入的语法，它建立在Promise之上，使异步代码看起来更像传统的同步代码，提高了可读性和可维护性。

### 基本语法

```javascript
async function asyncFunction() {
  try {
    const result = await promise;
    console.log('异步操作结果:', result);
    return '处理后的结果';
  } catch (error) {
    console.error('处理错误:', error);
  }
}

asyncFunction().then(result => {
  console.log('函数返回的结果:', result);
});
```

### 特点

1. **async函数**：声明的函数总是返回Promise
2. **await表达式**：只能在async函数内部使用，会暂停函数执行直到Promise解析或拒绝
3. **错误处理**：使用try/catch语法捕获错误，比Promise的.catch更直观
4. **并行处理**：可以使用Promise.all与await结合实现并行异步操作

```javascript
async function fetchMultipleResources() {
  try {
    const [resource1, resource2] = await Promise.all([
      fetchResource1(),
      fetchResource2()
    ]);
    return { resource1, resource2 };
  } catch (error) {
    console.error('获取资源失败:', error);
  }
}
```

## 错误处理 (Error Handling)

在异步JavaScript中，错误处理是一个重要的话题，有多种方式可以捕获和处理错误。

### 回调中的错误处理

通常使用错误优先回调模式（Error-First Callback Pattern）：

```javascript
function asyncOperation(callback) {
  // 异步操作
  if (errorCondition) {
    callback(new Error('操作失败'));
  } else {
    callback(null, result);
  }
}
```

### Promise中的错误处理

使用.catch()方法捕获Promise链中的错误：

```javascript
promise
  .then(step1)
  .then(step2)
  .then(step3)
  .catch(error => {
    console.error('捕获到错误:', error);
  });
```

### Async/Await中的错误处理

使用try/catch块捕获错误：

```javascript
async function handleErrors() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error('错误处理:', error);
    // 可以返回默认值或重新抛出错误
    return fallbackValue;
  }
}
```

### 全局错误处理

在浏览器中，可以使用window.onerror捕获未处理的错误：

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误捕获:', message, error);
  return true; // 阻止默认事件处理
};
```

在Node.js中，可以监听process对象的error事件：

```javascript
process.on('uncaughtException', error => {
  console.error('未捕获的异常:', error);
  // 通常应该在这里执行清理工作并退出进程
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});
```

## 事件循环 (Event Loop)

事件循环是JavaScript处理异步操作的核心机制，它负责执行代码、收集和处理事件以及执行队列中的子任务。

### JavaScript 运行时组成

1. **调用栈 (Call Stack)**：跟踪函数调用
2. **Web APIs/Node.js APIs**：提供异步操作能力（setTimeout, fetch等）
3. **回调队列 (Callback Queue)**：存储待处理的回调函数
4. **微任务队列 (Microtask Queue)**：存储微任务（Promise回调、MutationObserver等）
5. **事件循环 (Event Loop)**：协调调用栈、任务队列和微任务队列

### 事件循环执行顺序

1. 执行调用栈中的所有同步代码
2. 执行所有微任务队列中的任务（先进先出）
3. 渲染UI（浏览器环境）
4. 从回调队列中取出一个任务执行
5. 重复步骤2-4

### 宏任务与微任务

- **宏任务 (Macrotasks)**：setTimeout, setInterval, setImmediate, I/O操作, UI渲染等
- **微任务 (Microtasks)**：Promise.then/catch/finally, process.nextTick(Node.js), MutationObserver等

```javascript
console.log('1: 同步代码开始');

setTimeout(() => {
  console.log('4: setTimeout 回调');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise 回调');
});

console.log('2: 同步代码结束');

// 输出顺序: 1, 2, 3, 4
```

## 定时器 (Timers)

JavaScript提供了几种定时器函数，用于在指定时间后执行代码。

### setTimeout

在指定的延迟时间后执行一次函数。

```javascript
const timeoutId = setTimeout(callback, delay, param1, param2, ...);

// 清除定时器
clearTimeout(timeoutId);
```

**注意**：
- 延迟时间不是精确的，受事件循环影响
- 最小延迟在浏览器中通常为4ms
- 回调函数在指定时间后被添加到队列中，而非立即执行

### setInterval

按照指定的时间间隔重复执行函数。

```javascript
const intervalId = setInterval(callback, interval, param1, param2, ...);

// 清除定时器
clearInterval(intervalId);
```

**注意**：
- 如果回调函数执行时间超过间隔时间，可能导致回调函数连续执行
- 不保证回调函数执行的精确间隔

### setImmediate (Node.js)

在当前事件循环周期结束时执行函数。

```javascript
const immediateId = setImmediate(callback, param1, param2, ...);

// 清除
clearImmediate(immediateId);
```

### requestAnimationFrame (浏览器)

在浏览器下一次重绘之前执行函数，常用于动画。

```javascript
const requestId = requestAnimationFrame(callback);

// 取消
cancelAnimationFrame(requestId);
```

## 学习资源

- [MDN Web Docs - Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN Web Docs - Async 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

## 下一步

完成本章学习后，建议继续学习Node.js基础（Chapter 4）。