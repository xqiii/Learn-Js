# JavaScript Objects and Arrays | JavaScript 对象和数组

## 学习目标

本章将深入探讨JavaScript中的对象和数组，包括对象字面量、对象方法、this关键字、数组操作方法、JSON处理和ES6中的解构与展开运算符等重要概念。这些是JavaScript中处理复杂数据结构的核心工具。

## 对象字面量 (Object Literals)

对象字面量是创建对象的最简单方式，使用花括号 `{}` 表示。

### 基本语法

```javascript
const person = {
  name: '张三',
  age: 30,
  isStudent: false
};
```

### 属性访问方式

1. **点表示法**：`person.name`
2. **方括号表示法**：`person['name']`

### 属性名与属性值

- 属性名可以是字符串或标识符
- 属性值可以是任何JavaScript值（原始类型或引用类型）
- ES6允许使用变量作为属性名（计算属性名）

```javascript
const propName = 'age';
const person = {
  name: '李四',
  [propName]: 25
};
console.log(person.age); // 25
```

## 对象方法 (Object Methods)

对象可以包含函数作为其属性，这些函数称为方法。

### 基本方法定义

```javascript
const calculator = {
  add: function(a, b) {
    return a + b;
  },
  subtract: function(a, b) {
    return a - b;
  }
};
```

### 简写方法（ES6）

```javascript
const calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  }
};
```

### this关键字在方法中的使用

```javascript
const person = {
  firstName: '张',
  lastName: '三',
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
};
```

## This 关键字 (This Keyword)

`this` 是一个特殊的关键字，它的值在函数执行时确定，取决于函数的调用方式。

### This 的绑定规则

1. **默认绑定**：函数独立调用时，`this` 指向全局对象（非严格模式）或 `undefined`（严格模式）
2. **隐式绑定**：作为对象方法调用时，`this` 指向调用该方法的对象
3. **显式绑定**：使用 `call()`、`apply()` 或 `bind()` 方法时，`this` 指向指定的对象
4. **构造函数绑定**：使用 `new` 关键字调用时，`this` 指向新创建的对象

### 箭头函数中的 this

箭头函数不会创建自己的 `this`，它会继承外层作用域的 `this`。

```javascript
const obj = {
  value: 10,
  regularFunction: function() {
    console.log(this.value); // 10
  },
  arrowFunction: () => {
    console.log(this.value); // 取决于外层作用域
  }
};
```

## 数组和数组方法 (Arrays and Array Methods)

数组是一种特殊的对象，用于存储有序的元素集合。

### 创建数组

```javascript
const numbers = [1, 2, 3, 4, 5]; // 字面量方式
const fruits = new Array('apple', 'banana', 'orange'); // 构造函数方式
```

### 数组索引

数组元素通过索引访问，索引从0开始。

```javascript
const numbers = [10, 20, 30];
console.log(numbers[0]); // 10
console.log(numbers[1]); // 20
```

### 常用数组方法

#### 转换方法
- `toString()`：将数组转换为字符串
- `join()`：将数组元素连接为字符串

#### 栈和队列方法
- `push()`：在数组末尾添加元素
- `pop()`：移除并返回数组末尾元素
- `shift()`：移除并返回数组第一个元素
- `unshift()`：在数组开头添加元素

#### 数组操作方法
- `concat()`：连接数组
- `slice()`：返回数组的一部分
- `splice()`：修改数组（添加、删除、替换）

#### 位置方法
- `indexOf()`：查找元素索引
- `lastIndexOf()`：从末尾查找元素索引
- `includes()`：检查数组是否包含元素

#### 迭代方法
- `forEach()`：对每个元素执行操作
- `map()`：创建一个新数组，其中包含对每个元素调用函数的结果
- `filter()`：创建一个新数组，其中包含通过测试的元素
- `find()`：返回满足条件的第一个元素
- `findIndex()`：返回满足条件的第一个元素的索引
- `every()`：检查所有元素是否满足条件
- `some()`：检查是否有元素满足条件

#### 归约方法
- `reduce()`：从左到右归约数组
- `reduceRight()`：从右到左归约数组

## JSON (Parse and Stringify)

JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式。

### JSON.stringify()

将JavaScript对象转换为JSON字符串。

```javascript
const person = { name: '张三', age: 30 };
const jsonString = JSON.stringify(person);
console.log(jsonString); // {"name":"张三","age":30}
```

### JSON.parse()

将JSON字符串转换为JavaScript对象。

```javascript
const jsonString = '{"name":"张三","age":30}';
const person = JSON.parse(jsonString);
console.log(person.name); // 张三
```

### 注意事项

- JSON中的属性名必须用双引号
- JSON不支持函数、undefined、Symbol、循环引用
- 日期对象会被转换为字符串

## 解构和展开运算符 (Destructuring and Spread Operators)

### 对象解构（ES6）

从对象中提取属性并赋值给变量。

```javascript
const person = { firstName: '张', lastName: '三', age: 30 };
const { firstName, lastName } = person;
console.log(firstName); // 张
console.log(lastName); // 三

// 重命名变量
const { firstName: fName, lastName: lName } = person;

// 默认值
const { country = '中国' } = person;
```

### 数组解构（ES6）

从数组中提取元素并赋值给变量。

```javascript
const numbers = [1, 2, 3, 4, 5];
const [first, second] = numbers;
console.log(first); // 1
console.log(second); // 2

// 跳过元素
const [a, , b] = numbers;

// 剩余元素
const [head, ...tail] = numbers;
```

### 展开运算符（ES6）

#### 展开数组

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 复制数组
const copy = [...arr1];

// 函数参数展开
const sum = (a, b, c) => a + b + c;
console.log(sum(...arr1)); // 6
```

#### 展开对象

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// 复制对象
const copy = { ...obj1 };

// 覆盖属性
const updated = { ...obj1, b: 99 };
```

## 学习资源

- [MDN Web Docs - 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects)
- [MDN Web Docs - 数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN Web Docs - JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)

## 下一步

完成本章学习后，建议继续学习异步JavaScript（Chapter 3）。