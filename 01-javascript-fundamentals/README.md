# JavaScript Fundamentals | JavaScript 基础

## 学习目标

本章将介绍JavaScript的基础知识，包括变量、数据类型、运算符、控制流、循环、函数、作用域和闭包等核心概念。这些是JavaScript编程的基础，对于深入理解和使用JavaScript至关重要。

## 变量和数据类型 (Variables and Data Types)

### 变量声明

JavaScript中有三种变量声明方式：`var`、`let`和`const`。

- `var`：函数作用域，存在变量提升
- `let`：块级作用域，不存在变量提升
- `const`：块级作用域，声明后不可重新赋值

### 数据类型

JavaScript有七种原始数据类型和一种引用类型：

- **原始数据类型**：
  - String (字符串)
  - Number (数字)
  - Boolean (布尔值)
  - Null (空值)
  - Undefined (未定义)
  - Symbol (符号，ES6新增)
  - BigInt (大整数，ES11新增)
- **引用类型**：
  - Object (对象)
  - Array (数组)
  - Function (函数)

## 运算符和表达式 (Operators and Expressions)

### 算术运算符

- `+`：加法或字符串连接
- `-`：减法
- `*`：乘法
- `/`：除法
- `%`：取模
- `++`：递增
- `--`：递减

### 赋值运算符

- `=`：赋值
- `+=`：加赋值
- `-=`：减赋值
- `*=`：乘赋值
- `/=`：除赋值

### 比较运算符

- `==`：相等（不严格）
- `===`：严格相等
- `!=`：不相等（不严格）
- `!==`：严格不相等
- `>`：大于
- `<`：小于
- `>=`：大于等于
- `<=`：小于等于

### 逻辑运算符

- `&&`：逻辑与
- `||`：逻辑或
- `!`：逻辑非

## 控制流 (Control Flow)

### if-else 语句

```javascript
if (condition) {
  // 当条件为true时执行
} else if (anotherCondition) {
  // 当第一个条件为false，第二个条件为true时执行
} else {
  // 当所有条件都为false时执行
}
```

### switch 语句

```javascript
switch (expression) {
  case value1:
    // 当expression等于value1时执行
    break;
  case value2:
    // 当expression等于value2时执行
    break;
  default:
    // 当expression不等于任何case值时执行
}
```

## 循环 (Loops)

### for 循环

```javascript
for (initialization; condition; iteration) {
  // 循环体
}
```

### while 循环

```javascript
while (condition) {
  // 循环体
}
```

### do-while 循环

```javascript
do {
  // 循环体
} while (condition);
```

## 函数 (Functions)

### 函数声明

```javascript
function functionName(parameters) {
  // 函数体
  return result; // 可选
}
```

### 函数表达式

```javascript
const functionName = function(parameters) {
  // 函数体
};
```

### 箭头函数 (ES6)

```javascript
const functionName = (parameters) => {
  // 函数体
};

// 单个参数可以省略括号
const singleParam = param => param * 2;

// 单行返回可以省略大括号和return关键字
const square = num => num * num;
```

## 作用域和闭包 (Scope and Closures)

### 作用域

- **全局作用域**：在任何地方都可访问的变量
- **函数作用域**：在函数内部定义的变量只能在函数内部访问
- **块级作用域**：使用`let`或`const`声明的变量在`{}`块内有效

### 闭包

闭包是指有权访问另一个函数作用域中的变量的函数。闭包让你可以从内部函数访问到外部函数的作用域。

```javascript
function outer() {
  const outerVar = 'I am from outer';
  
  function inner() {
    console.log(outerVar); // 可以访问外部函数的变量
  }
  
  return inner;
}

const closure = outer();
closure(); // 输出: I am from outer
```

## 学习资源

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [JavaScript.info](https://zh.javascript.info/)

## 下一步

完成本章学习后，建议继续学习JavaScript对象和数组（Chapter 2）。