// JavaScript Fundamentals Examples
// 执行方式: node examples.js

console.log('===== JavaScript 基础示例 =====\n');

// ===== 变量和数据类型 =====
console.log('----- 变量和数据类型 -----');

// 变量声明
var varVariable = 'var 变量'; // 函数作用域
let letVariable = 'let 变量'; // 块级作用域
const constVariable = 'const 变量'; // 常量

console.log('var变量:', varVariable);
console.log('let变量:', letVariable);
console.log('const变量:', constVariable);

// 尝试重新赋值const会引发错误，这里注释掉
// constVariable = '新值'; // TypeError: Assignment to constant variable

// 数据类型
const stringType = 'Hello JavaScript';
const numberType = 42;
const booleanType = true;
const nullType = null;
let undefinedType;
const symbolType = Symbol('unique');
const bigIntType = BigInt(9007199254740991);
const objectType = { name: 'JavaScript', type: 'language' };
const arrayType = [1, 2, 3, 4, 5];

console.log('\n数据类型示例:');
console.log('字符串:', stringType, typeof stringType);
console.log('数字:', numberType, typeof numberType);
console.log('布尔值:', booleanType, typeof booleanType);
console.log('null:', nullType, typeof nullType); // typeof null 返回 'object' (历史原因)
console.log('undefined:', undefinedType, typeof undefinedType);
console.log('Symbol:', symbolType, typeof symbolType);
console.log('BigInt:', bigIntType, typeof bigIntType);
console.log('对象:', objectType, typeof objectType);
console.log('数组:', arrayType, typeof arrayType); // 数组也是对象类型

// ===== 运算符和表达式 =====
console.log('\n----- 运算符和表达式 -----');

// 算术运算符
const a = 10;
const b = 5;

console.log(`${a} + ${b} =`, a + b);
console.log(`${a} - ${b} =`, a - b);
console.log(`${a} * ${b} =`, a * b);
console.log(`${a} / ${b} =`, a / b);
console.log(`${a} % ${b} =`, a % b);

// 自增自减
let counter = 0;
console.log('初始counter:', counter);
console.log('counter++:', counter++); // 先返回后增加
console.log('counter:', counter);
console.log('++counter:', ++counter); // 先增加后返回
console.log('counter:', counter);

// 赋值运算符
let x = 10;
x += 5; // x = x + 5
console.log('x += 5:', x);

// 比较运算符
console.log('\n比较运算:');
console.log('10 == "10":', 10 == "10"); // true, 不严格比较
console.log('10 === "10":', 10 === "10"); // false, 严格比较
console.log('10 > 5:', 10 > 5);

// 逻辑运算符
console.log('\n逻辑运算:');
console.log('true && false:', true && false);
console.log('true || false:', true || false);
console.log('!true:', !true);

// 短路求值
const name = null || '默认名称';
console.log('短路求值:', name);

// ===== 控制流 =====
console.log('\n----- 控制流 -----');

// if-else语句
const age = 25;

console.log('\n条件判断:');
if (age < 18) {
  console.log('未成年');
} else if (age >= 18 && age < 65) {
  console.log('成年人');
} else {
  console.log('老年人');
}

// switch语句
const fruit = 'apple';

console.log('\nswitch语句:');
switch (fruit) {
  case 'apple':
    console.log('苹果是红色的');
    break;
  case 'banana':
    console.log('香蕉是黄色的');
    break;
  case 'grape':
    console.log('葡萄是紫色的');
    break;
  default:
    console.log('我不知道这种水果的颜色');
}

// ===== 循环 =====
console.log('\n----- 循环 -----');

// for循环
console.log('\nfor循环:');
for (let i = 0; i < 5; i++) {
  console.log(`循环次数: ${i + 1}`);
}

// while循环
console.log('\nwhile循环:');
let count = 0;
while (count < 3) {
  console.log(`while循环: ${count + 1}`);
  count++;
}

// do-while循环
console.log('\ndo-while循环:');
let doCount = 0;
do {
  console.log(`do-while循环: ${doCount + 1}`);
  doCount++;
} while (doCount < 2);

// ===== 函数 =====
console.log('\n----- 函数 -----');

// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

console.log('函数声明:', greet('JavaScript'));

// 函数表达式
const calculateArea = function(width, height) {
  return width * height;
};

console.log('函数表达式 - 矩形面积:', calculateArea(5, 10));

// 箭头函数 (ES6)
const square = num => num * num;
console.log('箭头函数 - 平方:', square(5));

// 箭头函数带多个参数
const sum = (a, b) => a + b;
console.log('箭头函数 - 求和:', sum(10, 20));

// 箭头函数带函数体
const processNumber = num => {
  const doubled = num * 2;
  const squared = doubled * doubled;
  return squared;
};

console.log('箭头函数 - 处理数字:', processNumber(3));

// ===== 作用域和闭包 =====
console.log('\n----- 作用域和闭包 -----');

// 全局作用域
const globalVar = '全局变量';

function scopeDemo() {
  // 函数作用域
  const functionVar = '函数变量';
  
  // 可以访问全局变量
  console.log('在函数内访问全局变量:', globalVar);
  
  // 块级作用域
  if (true) {
    const blockVar = '块级变量';
    console.log('在块内访问块级变量:', blockVar);
  }
  
  // 这里无法访问blockVar
  // console.log(blockVar); // ReferenceError
  
  return functionVar;
}

console.log('函数返回函数作用域变量:', scopeDemo());
// 这里无法访问functionVar
// console.log(functionVar); // ReferenceError

// 闭包示例
function createCounter() {
  let count = 0; // 私有变量
  
  return {
    increment: function() {
      count++;
      return count;
    },
    getCount: function() {
      return count;
    },
    reset: function() {
      count = 0;
      return count;
    }
  };
}

console.log('\n闭包示例:');
const counterObj = createCounter();
console.log('初始计数:', counterObj.getCount());
console.log('增加后:', counterObj.increment());
console.log('增加后:', counterObj.increment());
console.log('重置后:', counterObj.reset());

// 另一个闭包示例
function outerFunction(outerVar) {
  return function innerFunction(innerVar) {
    console.log(`外部变量: ${outerVar}`);
    console.log(`内部变量: ${innerVar}`);
    console.log(`总和: ${outerVar + innerVar}`);
  };
}

console.log('\n带参数的闭包:');
const innerFunc = outerFunction(100);
innerFunc(50); // 即使outerFunction执行完毕，闭包仍然可以访问outerVar

console.log('\n===== 示例结束 =====');
console.log('\n执行命令: node examples.js');