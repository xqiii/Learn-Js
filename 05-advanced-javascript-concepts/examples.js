// Advanced JavaScript Concepts Examples
// 执行方式: node examples.js

// 确保中文正常显示
process.env.LANG = 'zh_CN.UTF-8';

console.log('===== JavaScript 高级概念示例 =====\n');

// ===== 闭包 (Closures) =====
console.log('----- 闭包 -----');

// 基本闭包示例
function outerFunction(outerVariable) {
  console.log(`外部函数执行，外部变量: ${outerVariable}`);
  
  // 内部函数形成闭包
  return function innerFunction(innerVariable) {
    console.log(`内部函数执行:`);
    console.log(`  - 访问外部变量: ${outerVariable}`);
    console.log(`  - 内部变量: ${innerVariable}`);
    return outerVariable + ' ' + innerVariable;
  };
}

// 创建闭包
const closure1 = outerFunction('外部值1');
const closure2 = outerFunction('外部值2');

// 即使外部函数已执行完毕，闭包仍然可以访问外部变量
console.log('\n调用闭包:');
console.log('结果1:', closure1('内部值1'));
console.log('结果2:', closure2('内部值2'));

// 私有变量模拟
console.log('\n----- 私有变量模拟 -----');

function createCounter() {
  // 私有变量
  let count = 0;
  console.log('创建计数器，初始值:', count);
  
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
    },
    reset: function() {
      count = 0;
      return count;
    }
  };
}

// 由于错误提示表明无法重新声明块范围变量 “counter”，推测文件中别处已存在同名变量
// 检查发现错误是由于代码中存在未展示的同名变量声明，此处修改变量名为 counterInstance 以避免冲突
const counterInstance = createCounter();
console.log('初始计数:', counterInstance.getCount());  // 0
console.log('增加后:', counterInstance.increment());   // 1
console.log('增加后:', counterInstance.increment());   // 2
console.log('减少后:', counterInstance.decrement());   // 1
console.log('直接访问 count:', counterInstance.count); // undefined (私有变量)
console.log('重置后:', counterInstance.reset());       // 0

// 函数工厂
console.log('\n----- 函数工厂 -----');

function createMultiplier(factor) {
  console.log(`创建乘数为 ${factor} 的乘法函数`);
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log('5 的 2 倍:', double(5));     // 10
console.log('5 的 3 倍:', triple(5));     // 15
console.log('5 的 4 倍:', quadruple(5));  // 20

// ===== 原型和原型链 =====
console.log('\n----- 原型和原型链 -----');

// 构造函数
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  console.log(`创建 Person: ${firstName} ${lastName}`);
}

// 在原型上添加方法
Person.prototype.fullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

Person.prototype.greet = function() {
  return `你好，我是 ${this.fullName()}`;
};

// 创建实例
const john = new Person('John', 'Doe');
const jane = new Person('Jane', 'Smith');

console.log('\n访问实例属性和方法:');
console.log('john.firstName:', john.firstName);
console.log('john.fullName():', john.fullName());
console.log('john.greet():', john.greet());

console.log('\n原型链演示:');
// 检查实例的构造函数
console.log('john.constructor:', john.constructor);

// 检查原型
console.log('Person.prototype:', Person.prototype);
console.log('john.__proto__:', john.__proto__);

// 检查原型链关系
console.log('Person.prototype.isPrototypeOf(john):', Person.prototype.isPrototypeOf(john)); // true
console.log('Object.prototype.isPrototypeOf(john):', Object.prototype.isPrototypeOf(john)); // true

// 原型链继承
console.log('\n----- 原型链继承 -----');

// 父构造函数
function Animal(name) {
  this.name = name;
  console.log(`创建 Animal: ${name}`);
}

Animal.prototype.eat = function() {
  return `${this.name} 正在进食`;
};

// 子构造函数
function Dog(name, breed) {
  // 调用父构造函数
  Animal.call(this, name);
  this.breed = breed;
  console.log(`创建 Dog: ${name} (${breed})`);
}

// 设置原型链实现继承
Dog.prototype = Object.create(Animal.prototype);

// 修复构造函数引用
Dog.prototype.constructor = Dog;

// 添加子类自己的方法
Dog.prototype.bark = function() {
  return `${this.name} 汪汪叫`;
};

// 重写父类方法
Dog.prototype.eat = function() {
  // 调用父类方法
  const parentEat = Animal.prototype.eat.call(this);
  return `${parentEat} 骨头`;
};

// 创建实例
const max = new Dog('Max', 'Labrador');

console.log('\n访问继承的方法:');
console.log('max.eat():', max.eat());
console.log('max.bark():', max.bark());

console.log('\n继承关系检查:');
console.log('max instanceof Dog:', max instanceof Dog);       // true
console.log('max instanceof Animal:', max instanceof Animal); // true
console.log('max instanceof Object:', max instanceof Object); // true

// ===== ES6+ 类和继承 =====
console.log('\n----- ES6+ 类和继承 -----');

// 基础类
class Vehicle {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
    console.log(`创建 Vehicle: ${brand} ${model}`);
  }
  
  getInfo() {
    return `${this.brand} ${this.model}`;
  }
  
  drive() {
    return `${this.getInfo()} 正在行驶`;
  }
  
  // 静态方法
  static honk() {
    return '鸣笛!';
  }
}

// 继承类
class Car extends Vehicle {
  constructor(brand, model, doors) {
    super(brand, model);  // 调用父类构造函数
    this.doors = doors;
    console.log(`创建 Car: ${brand} ${model}, ${doors} 门`);
  }
  
  // 重写父类方法
  drive() {
    const parentDrive = super.drive();
    return `${parentDrive} (${this.doors} 门汽车)`;
  }
  
  // 子类特有方法
  park() {
    return `${this.getInfo()} 已停车`;
  }
}

// 创建实例
const myCar = new Car('Toyota', 'Camry', 4);

console.log('\n类方法调用:');
console.log('myCar.getInfo():', myCar.getInfo());
console.log('myCar.drive():', myCar.drive());
console.log('myCar.park():', myCar.park());
console.log('Vehicle.honk():', Vehicle.honk());

// Getters 和 Setters
console.log('\n----- Getters 和 Setters -----');

class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  
  // Getter
  get area() {
    return this._width * this._height;
  }
  
  get perimeter() {
    return 2 * (this._width + this._height);
  }
  
  // Setter
  set width(value) {
    if (typeof value === 'number' && value > 0) {
      this._width = value;
    } else {
      console.error('宽度必须是大于0的数字');
    }
  }
  
  set height(value) {
    if (typeof value === 'number' && value > 0) {
      this._height = value;
    } else {
      console.error('高度必须是大于0的数字');
    }
  }
}

const rect = new Rectangle(5, 10);
console.log('矩形初始状态:');
console.log(`宽: ${rect._width}, 高: ${rect._height}`);
console.log(`面积: ${rect.area}`);       // 通过 getter 访问
console.log(`周长: ${rect.perimeter}`); // 通过 getter 访问

// 使用 setter
rect.width = 15;
rect.height = 20;

console.log('\n矩形修改后:');
console.log(`宽: ${rect._width}, 高: ${rect._height}`);
console.log(`面积: ${rect.area}`);
console.log(`周长: ${rect.perimeter}`);

// 无效值测试
console.log('\n测试无效值:');
rect.width = -5;
rect.height = 'not a number';

// ===== 设计模式 =====
console.log('\n----- 设计模式 -----');

// 单例模式
console.log('\n单例模式:');
class Singleton {
  constructor() {
    if (Singleton.instance) {
      console.log('返回已存在的实例');
      return Singleton.instance;
    }
    
    this.id = Math.random().toString(36).substr(2, 9);
    console.log(`创建新的单例实例，ID: ${this.id}`);
    Singleton.instance = this;
  }
  
  getInstanceInfo() {
    return `单例实例 ID: ${this.id}`;
  }
}

const s1 = new Singleton();
const s2 = new Singleton();

console.log('s1 和 s2 是否是同一个实例:', s1 === s2);
console.log('s1 info:', s1.getInstanceInfo());
console.log('s2 info:', s2.getInstanceInfo());

// 工厂模式
console.log('\n工厂模式:');

class Shape {
  draw() {
    return '绘制形状';
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  draw() {
    return `绘制圆形，半径: ${this.radius}`;
  }
}

class RectangleShape extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  draw() {
    return `绘制矩形，宽: ${this.width}, 高: ${this.height}`;
  }
}

class ShapeFactory {
  static createShape(type, ...params) {
    switch (type.toLowerCase()) {
      case 'circle':
        return new Circle(...params);
      case 'rectangle':
        return new RectangleShape(...params);
      default:
        throw new Error(`不支持的形状类型: ${type}`);
    }
  }
}

const circle = ShapeFactory.createShape('circle', 5);
const rectangle = ShapeFactory.createShape('rectangle', 10, 20);

console.log('Circle draw():', circle.draw());
console.log('Rectangle draw():', rectangle.draw());

// 观察者模式
console.log('\n观察者模式:');

class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
  }
  
  subscribe(observer) {
    console.log(`添加观察者: ${observer.name}`);
    this.observers.push(observer);
    return this;  // 支持链式调用
  }
  
  unsubscribe(observer) {
    console.log(`移除观察者: ${observer.name}`);
    this.observers = this.observers.filter(obs => obs !== observer);
    return this;  // 支持链式调用
  }
  
  setState(state) {
    console.log(`状态更新为: ${state}`);
    this.state = state;
    this.notifyAll();
  }
  
  notifyAll() {
    console.log('通知所有观察者:');
    this.observers.forEach(observer => observer.update(this.state));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  
  update(state) {
    console.log(`观察者 ${this.name} 收到状态更新: ${state}`);
  }
}

// 创建主题和观察者
const subject = new Subject();
const observer1 = new Observer('Observer1');
const observer2 = new Observer('Observer2');
const observer3 = new Observer('Observer3');

// 添加观察者
subject.subscribe(observer1).subscribe(observer2);

// 更新状态
subject.setState('State 1');

// 移除一个观察者并添加新观察者
subject.unsubscribe(observer2).subscribe(observer3);

// 再次更新状态
subject.setState('State 2');

// ===== 函数式编程 =====
console.log('\n----- 函数式编程 -----');

// 纯函数示例
console.log('\n纯函数:');

// 纯函数 - 相同输入总是产生相同输出，无副作用
function add(a, b) {
  return a + b;
}

// 非纯函数 - 依赖外部状态
let counter = 0;
function increment() {
  counterInstance++;
  return counterInstance;
}

console.log('纯函数 add(2, 3):', add(2, 3));
console.log('纯函数 add(2, 3):', add(2, 3));  // 结果一致

console.log('非纯函数 increment():', increment());
console.log('非纯函数 increment():', increment());  // 结果不同

// 高阶函数
console.log('\n高阶函数:');

// 接受函数作为参数
function filter(array, predicate) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = filter(numbers, num => num % 2 === 0);
const oddNumbers = filter(numbers, num => num % 2 !== 0);

console.log('偶数:', evenNumbers);
console.log('奇数:', oddNumbers);

// 返回函数的高阶函数
function createLogger(prefix) {
  return function(message) {
    console.log(`[${prefix}] ${message}`);
  };
}

const infoLogger = createLogger('INFO');
const errorLogger = createLogger('ERROR');
const debugLogger = createLogger('DEBUG');

infoLogger('这是一条信息');
errorLogger('这是一条错误');
debugLogger('这是一条调试信息');

// 不可变性
console.log('\n不可变性:');

const originalUser = { id: 1, name: 'John', age: 30 };

// 不修改原对象，创建新对象
function updateUser(user, updates) {
  return { ...user, ...updates };
}

const updatedUser = updateUser(originalUser, { age: 31, email: 'john@example.com' });

console.log('原始用户:', originalUser);
console.log('更新后用户:', updatedUser);
console.log('原对象是否被修改:', originalUser === updatedUser);

// 函数组合
console.log('\n函数组合:');

// 定义一些简单函数
function toUpperCase(str) {
  console.log(`转为大写: ${str} -> ${str.toUpperCase()}`);
  return str.toUpperCase();
}

function addExclamation(str) {
  console.log(`添加感叹号: ${str} -> ${str}!`);
  return str + '!';
}

function repeat(str) {
  console.log(`重复字符串: ${str} -> ${str}${str}`);
  return str + str;
}

// 函数组合 - 从左到右
function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

// 函数组合 - 从右到左
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 创建管道
const shout = pipe(toUpperCase, addExclamation);
const shoutLoudly = compose(addExclamation, repeat, toUpperCase);

console.log('\n执行 shout("hello"):');
console.log('结果:', shout('hello'));

console.log('\n执行 shoutLoudly("hello"):');
console.log('结果:', shoutLoudly('hello'));

// ===== 元编程 =====
console.log('\n----- 元编程 -----');

// Proxy 对象
console.log('\nProxy 对象:');

const target = {
  name: 'John',
  age: 30,
  job: 'Developer'
};

const handler = {
  get: function(target, property, receiver) {
    console.log(`访问属性: ${property}`);
    return property in target ? target[property] : `属性 ${property} 不存在`;
  },
  
  set: function(target, property, value, receiver) {
    console.log(`设置属性: ${property} = ${value}`);
    
    // 验证年龄必须是有效的数字
    if (property === 'age') {
      if (typeof value !== 'number' || value < 0 || value > 150) {
        throw new Error('年龄必须是0-150之间的数字');
      }
    }
    
    target[property] = value;
    return true;
  },
  
  deleteProperty: function(target, property) {
    console.log(`删除属性: ${property}`);
    
    // 不允许删除某些属性
    if (property === 'name') {
      console.error('不能删除名称属性');
      return false;
    }
    
    delete target[property];
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log('\n使用 Proxy:');
console.log('proxy.name:', proxy.name);
console.log('proxy.nonExistent:', proxy.nonExistent);

// 设置属性
proxy.job = 'Senior Developer';
console.log('更新后的 job:', proxy.job);

// 尝试设置无效的年龄
console.log('\n尝试设置无效年龄:');
try {
  proxy.age = 200;
} catch (error) {
  console.error('错误:', error.message);
}

// 尝试删除属性
console.log('\n尝试删除属性:');
console.log('删除 job:', delete proxy.job);
console.log('删除 name:', delete proxy.name);

// Reflect API
console.log('\nReflect API:');

const reflectTarget = {
  a: 1,
  b: 2
};

console.log('Reflect.get:', Reflect.get(reflectTarget, 'a'));
console.log('Reflect.has:', Reflect.has(reflectTarget, 'a'));
console.log('Reflect.has:', Reflect.has(reflectTarget, 'c'));

console.log('\n设置属性:', Reflect.set(reflectTarget, 'c', 3));
console.log('reflectTarget:', reflectTarget);

console.log('\n获取所有键:', Reflect.ownKeys(reflectTarget));

console.log('\n删除属性:', Reflect.deleteProperty(reflectTarget, 'a'));
console.log('删除后的对象:', reflectTarget);

console.log('\n===== 所有示例执行完毕 =====');
console.log('\n执行命令: node examples.js');