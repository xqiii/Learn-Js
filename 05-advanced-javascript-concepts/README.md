# Advanced JavaScript Concepts | JavaScript 高级概念

## 学习目标 | Learning Objectives

学习本章节后，你将能够：
- 深入理解闭包的概念和应用场景
- 掌握 JavaScript 的原型和原型链机制
- 熟练使用 ES6+ 类和继承
- 了解常用的设计模式在 JavaScript 中的实现
- 掌握函数式编程的核心概念
- 理解元编程的基本原理

## 闭包 | Closures

### 什么是闭包 | What is a Closure

闭包是指一个函数可以访问其词法作用域之外的变量，即使该函数在其定义作用域之外执行。

```javascript
function outerFunction(outerVariable) {
  // 内部函数可以访问 outerVariable，即使 outerFunction 已执行完毕
  return function innerFunction(innerVariable) {
    console.log(`外部变量: ${outerVariable}`);
    console.log(`内部变量: ${innerVariable}`);
  };
}

// 创建一个闭包
const newFunction = outerFunction('outside');

// 即使 outerFunction 已执行完毕，newFunction 仍然可以访问 outerVariable
newFunction('inside');  // 输出: 外部变量: outside, 内部变量: inside
```

### 闭包的应用场景 | Closure Use Cases

#### 1. 数据封装和私有变量 | Data Encapsulation and Private Variables

JavaScript 没有原生的私有变量概念，但可以使用闭包来模拟私有变量。

```javascript
function createCounter() {
  let count = 0;  // 私有变量
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getCount());  // 输出: 0
console.log(counter.increment()); // 输出: 1
console.log(counter.increment()); // 输出: 2
console.log(counter.decrement()); // 输出: 1
console.log(counter.count);       // 输出: undefined (无法直接访问私有变量)
```

#### 2. 函数工厂 | Function Factories

使用闭包创建具有特定行为的函数。

```javascript
function createGreeting(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeting('Hello');
const sayHi = createGreeting('Hi');

console.log(sayHello('World'));  // 输出: Hello, World!
console.log(sayHi('Friend'));    // 输出: Hi, Friend!
```

#### 3. 回调函数 | Callback Functions

在异步操作中，闭包允许回调函数访问定义时的变量。

```javascript
function fetchData(url) {
  const startTime = Date.now();
  
  // 模拟异步操作
  setTimeout(function() {
    const endTime = Date.now();
    console.log(`从 ${url} 获取数据耗时: ${endTime - startTime}ms`);
    // 即使 fetchData 执行上下文已消失，回调函数仍然可以访问 url 和 startTime
  }, 1000);
}

fetchData('https://api.example.com/data');
```

## 原型和原型链 | Prototype and Prototype Chain

### 原型概念 | Prototype Concept

每个 JavaScript 对象都有一个原型对象，对象从原型继承方法和属性。

```javascript
// 创建一个对象
const person = {
  firstName: 'John',
  lastName: 'Doe',
  fullName: function() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// 访问对象的原型
console.log(Object.getPrototypeOf(person));

// 检查一个对象是否是另一个对象的原型
console.log(Object.prototype.isPrototypeOf(person));  // true
```

### 构造函数和原型 | Constructor Functions and Prototype

构造函数用于创建特定类型的对象，原型用于共享方法和属性。

```javascript
// 构造函数
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

// 在原型上定义方法，所有实例共享
Person.prototype.fullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// 创建实例
const person1 = new Person('John', 'Doe');
const person2 = new Person('Jane', 'Smith');

console.log(person1.fullName());  // 输出: John Doe
console.log(person2.fullName());  // 输出: Jane Smith

// 验证两个实例共享同一个原型方法
console.log(person1.fullName === person2.fullName);  // true
```

### 原型链 | Prototype Chain

当访问对象的属性或方法时，如果对象本身没有该属性或方法，JavaScript 会沿着原型链向上查找。

```javascript
// 创建一个构造函数
function Animal(name) {
  this.name = name;
}

// 在 Animal 原型上定义方法
Animal.prototype.eat = function() {
  return `${this.name} 正在进食`;
};

// 创建一个继承自 Animal 的构造函数
function Dog(name, breed) {
  Animal.call(this, name);  // 调用父构造函数
  this.breed = breed;
}

// 设置原型链，实现继承
Dog.prototype = Object.create(Animal.prototype);

// 修复构造函数引用
Dog.prototype.constructor = Dog;

// 在 Dog 原型上定义自己的方法
Dog.prototype.bark = function() {
  return `${this.name} 汪汪叫`;
};

// 创建一个 Dog 实例
const myDog = new Dog('Max', 'Labrador');

// 调用从 Animal 继承的方法
console.log(myDog.eat());  // 输出: Max 正在进食

// 调用自己的方法
console.log(myDog.bark()); // 输出: Max 汪汪叫

// 检查原型链
console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Animal);  // true
console.log(myDog instanceof Object);  // true
```

## ES6+ 类和继承 | ES6+ Classes and Inheritance

ES6 引入了类语法，使得面向对象编程在 JavaScript 中更加直观。

### 基本类定义 | Basic Class Definition

```javascript
class Person {
  // 构造函数
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  // 实例方法
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  // 静态方法
  static createPerson(nameString) {
    const [firstName, lastName] = nameString.split(' ');
    return new Person(firstName, lastName);
  }
}

// 创建实例
const person = new Person('John', 'Doe');
console.log(person.fullName());  // 输出: John Doe

// 使用静态方法
const anotherPerson = Person.createPerson('Jane Smith');
console.log(anotherPerson.fullName());  // 输出: Jane Smith
```

### 类继承 | Class Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return `${this.name} 正在进食`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // 调用父类构造函数
    this.breed = breed;
  }
  
  bark() {
    return `${this.name} 汪汪叫`;
  }
  
  // 重写父类方法
  eat() {
    return `${this.name} 正在吃骨头`;
  }
}

const myDog = new Dog('Max', 'Labrador');
console.log(myDog.eat());  // 输出: Max 正在吃骨头
console.log(myDog.bark()); // 输出: Max 汪汪叫
```

### 类的高级特性 | Advanced Class Features

#### 1. Getters 和 Setters

```javascript
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  
  // Getter
  get area() {
    return this._width * this._height;
  }
  
  // Setter
  set width(value) {
    if (value > 0) {
      this._width = value;
    } else {
      console.error('宽度必须大于0');
    }
  }
  
  get width() {
    return this._width;
  }
}

const rect = new Rectangle(5, 10);
console.log(rect.area);  // 输出: 50 (通过 getter 访问)
rect.width = 15;         // 通过 setter 设置
console.log(rect.area);  // 输出: 150
rect.width = -5;         // 输出: 宽度必须大于0
```

#### 2. 私有类字段和方法 (ES2022)

```javascript
class Counter {
  // 私有字段（以 # 开头）
  #count = 0;
  
  increment() {
    this.#count++;
    return this.#count;
  }
  
  // 私有方法
  #validate() {
    return this.#count >= 0;
  }
  
  getCount() {
    if (this.#validate()) {
      return this.#count;
    }
    return 0;
  }
}

const counter = new Counter();
console.log(counter.increment());  // 输出: 1
console.log(counter.getCount());   // 输出: 1
// console.log(counter.#count);    // 错误: 无法访问私有字段
// counter.#validate();           // 错误: 无法访问私有方法
```

## 设计模式 | Design Patterns

### 单例模式 | Singleton Pattern

确保一个类只有一个实例，并提供全局访问点。

```javascript
class Singleton {
  constructor() {
    // 检查是否已经存在实例
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    // 初始化实例
    this.timestamp = new Date().getTime();
    
    // 保存实例引用
    Singleton.instance = this;
  }
  
  getTimestamp() {
    return this.timestamp;
  }
}

// 创建实例
const instance1 = new Singleton();
const instance2 = new Singleton();

// 验证是否是同一个实例
console.log(instance1 === instance2);  // true
console.log(instance1.getTimestamp() === instance2.getTimestamp());  // true
```

### 工厂模式 | Factory Pattern

提供一个创建对象的接口，允许子类决定实例化哪个类。

```javascript
class Animal {
  speak() {
    return '动物发声';
  }
}

class Dog extends Animal {
  speak() {
    return '汪汪';
  }
}

class Cat extends Animal {
  speak() {
    return '喵喵';
  }
}

class AnimalFactory {
  static createAnimal(type) {
    switch (type) {
      case 'dog':
        return new Dog();
      case 'cat':
        return new Cat();
      default:
        throw new Error(`不支持的动物类型: ${type}`);
    }
  }
}

// 使用工厂创建实例
const dog = AnimalFactory.createAnimal('dog');
const cat = AnimalFactory.createAnimal('cat');

console.log(dog.speak());  // 输出: 汪汪
console.log(cat.speak());  // 输出: 喵喵
```

### 观察者模式 | Observer Pattern

定义对象间的一种一对多依赖关系，当一个对象状态发生改变时，所有依赖它的对象都会得到通知并自动更新。

```javascript
class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
  }
  
  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  // 移除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // 设置状态并通知所有观察者
  setState(state) {
    this.state = state;
    this.notifyAll();
  }
  
  // 通知所有观察者
  notifyAll() {
    this.observers.forEach(observer => {
      observer.update(this.state);
    });
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  
  update(state) {
    console.log(`${this.name} 收到更新: ${state}`);
  }
}

// 创建主题
const subject = new Subject();

// 创建观察者
const observer1 = new Observer('观察者1');
const observer2 = new Observer('观察者2');

// 添加观察者到主题
subject.addObserver(observer1);
subject.addObserver(observer2);

// 更新状态
subject.setState('新状态');  // 两个观察者都会收到通知

// 移除一个观察者
subject.removeObserver(observer1);

// 再次更新状态
subject.setState('另一个新状态');  // 只有观察者2会收到通知
```

## 函数式编程 | Functional Programming

### 纯函数 | Pure Functions

纯函数是指对于相同的输入，总是返回相同的输出，并且没有副作用。

```javascript
// 纯函数示例
function add(a, b) {
  return a + b;
}

// 非纯函数示例（依赖外部状态）
let counter = 0;
function increment() {
  counter++;
  return counter;
}

// 非纯函数示例（有副作用）
function appendFile(filename, content) {
  // 副作用：修改文件系统
  fs.appendFileSync(filename, content);
  return true;
}
```

### 高阶函数 | Higher-Order Functions

高阶函数是指接受函数作为参数或返回函数的函数。

```javascript
// 接受函数作为参数的高阶函数
function map(array, transform) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transform(array[i]));
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = map(numbers, num => num * 2);
console.log(doubled);  // 输出: [2, 4, 6, 8, 10]

// 返回函数的高阶函数
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 输出: 10
console.log(triple(5));  // 输出: 15
```

### 函数式编程的核心概念 | Core Concepts of Functional Programming

#### 1. 不可变性 | Immutability

```javascript
// 使用不可变性方式更新对象
function updateUser(user, updates) {
  // 创建新对象而不是修改原对象
  return { ...user, ...updates };
}

const user = { name: 'John', age: 30 };
const updatedUser = updateUser(user, { age: 31 });

console.log(user);        // { name: 'John', age: 30 }
console.log(updatedUser); // { name: 'John', age: 31 }

// 使用不可变性方式更新数组
function addItem(array, item) {
  // 返回新数组
  return [...array, item];
}

function removeItem(array, index) {
  // 返回新数组
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

const items = [1, 2, 3];
const newItems = addItem(items, 4);
const removedItems = removeItem(items, 1);

console.log(items);        // [1, 2, 3]
console.log(newItems);     // [1, 2, 3, 4]
console.log(removedItems); // [1, 3]
```

#### 2. 函数组合 | Function Composition

```javascript
// 函数组合
function compose(...functions) {
  return function(x) {
    return functions.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 定义一些简单函数
function double(x) { return x * 2; }
function increment(x) { return x + 1; }
function square(x) { return x * x; }

// 组合函数: square(increment(double(x)))
const pipeline = compose(square, increment, double);

console.log(pipeline(3));  // 输出: (3*2+1)^2 = 7^2 = 49
```

#### 3. 柯里化 | Currying

```javascript
// 柯里化函数
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// 原始函数
function add(a, b, c) {
  return a + b + c;
}

// 柯里化后的函数
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 输出: 6
console.log(curriedAdd(1, 2)(3));   // 输出: 6
console.log(curriedAdd(1)(2, 3));   // 输出: 6
console.log(curriedAdd(1, 2, 3));   // 输出: 6
```

## 元编程 | Metaprogramming

### Proxy 对象 | Proxy Object

Proxy 对象允许你拦截并自定义对目标对象的操作。

```javascript
// 创建一个普通对象
const target = {
  name: 'John',
  age: 30
};

// 创建代理
const handler = {
  // 拦截属性访问
  get: function(target, prop, receiver) {
    console.log(`访问属性: ${prop}`);
    return prop in target ? target[prop] : `属性 ${prop} 不存在`;
  },
  
  // 拦截属性设置
  set: function(target, prop, value, receiver) {
    console.log(`设置属性: ${prop} = ${value}`);
    
    // 验证年龄必须是数字且大于0
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new Error('年龄必须是正数');
    }
    
    target[prop] = value;
    return true;
  },
  
  // 拦截属性删除
  deleteProperty: function(target, prop) {
    console.log(`删除属性: ${prop}`);
    if (prop === 'name') {
      throw new Error('不能删除名称属性');
    }
    delete target[prop];
    return true;
  }
};

const proxy = new Proxy(target, handler);

// 访问属性
console.log(proxy.name);     // 输出: 访问属性: name, John
console.log(proxy.nonExistent);  // 输出: 访问属性: nonExistent, 属性 nonExistent 不存在

// 设置属性
proxy.age = 31;              // 输出: 设置属性: age = 31
// proxy.age = -5;           // 抛出错误: 年龄必须是正数

// 尝试删除属性
// delete proxy.name;        // 抛出错误: 不能删除名称属性
```

### Reflect API | Reflect API

Reflect 是一个内置对象，提供了与对象交互的方法，这些方法与 Proxy handlers 的方法名称相同。

```javascript
const obj = {
  name: 'John',
  age: 30
};

// 使用 Reflect 访问属性
console.log(Reflect.get(obj, 'name'));  // 输出: John

// 使用 Reflect 设置属性
console.log(Reflect.set(obj, 'age', 31));  // 输出: true
console.log(obj.age);  // 输出: 31

// 检查属性是否存在
console.log(Reflect.has(obj, 'name'));  // 输出: true
console.log(Reflect.has(obj, 'email'));  // 输出: false

// 删除属性
console.log(Reflect.deleteProperty(obj, 'age'));  // 输出: true
console.log(obj.age);  // 输出: undefined

// 获取对象的属性名
console.log(Reflect.ownKeys(obj));  // 输出: ['name']
```

### 装饰器 | Decorators (实验性)

装饰器是一种特殊类型的声明，可以附加到类声明、方法、访问器或属性上。虽然装饰器目前是实验性的，但在许多 JavaScript 项目中已经通过 Babel 或 TypeScript 广泛使用。

```javascript
// 注意：装饰器目前是实验性的，需要特殊配置才能使用

// 方法装饰器示例
function log(target, name, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    console.log(`调用方法 ${name}，参数:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${name} 返回:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a, b) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3);  // 输出: 调用方法 add，参数: [5, 3], 方法 add 返回: 8
```

## 执行方式 | Execution Methods

在本章节中，所有 JavaScript 示例都可以通过 Node.js 运行：

```bash
# 运行示例代码
node filename.js

# 对于使用装饰器等实验性特性的代码，需要使用 Babel 或 TypeScript
# 例如使用 TypeScript:
tsc filename.ts && node filename.js
```

请查看 `examples.js` 文件获取更多可执行的示例代码。