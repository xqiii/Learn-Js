// JavaScript Objects and Arrays Examples
// 执行方式: node examples.js

console.log('===== JavaScript 对象和数组示例 =====\n');

// ===== 对象字面量 (Object Literals) =====
console.log('----- 对象字面量 -----');

// 基本对象创建
const person = {
  name: '张三',
  age: 30,
  isStudent: false,
  address: {
    city: '北京',
    district: '朝阳区'
  }
};

console.log('创建的对象:', person);

// 属性访问
console.log('\n属性访问:');
console.log('点表示法 - 姓名:', person.name);
console.log('方括号表示法 - 年龄:', person['age']);
console.log('嵌套属性 - 城市:', person.address.city);

// 动态属性名 (ES6)
const propName = 'job';
const dynamicPerson = {
  name: '李四',
  [propName]: '工程师'
};

console.log('\n动态属性名:');
console.log(dynamicPerson);
console.log(dynamicPerson.job); // 工程师

// 添加和修改属性
person.email = 'zhangsan@example.com';
person.age = 31;
console.log('\n修改后的对象:', person);

// 删除属性
delete person.isStudent;
console.log('\n删除属性后的对象:', person);

// ===== 对象方法 (Object Methods) =====
console.log('\n----- 对象方法 -----');

const calculator = {
  add: function(a, b) {
    return a + b;
  },
  subtract: function(a, b) {
    return a - b;
  },
  // ES6 方法简写
  multiply(a, b) {
    return a * b;
  },
  divide(a, b) {
    if (b === 0) {
      return '除数不能为零';
    }
    return a / b;
  }
};

console.log('计算器方法:');
console.log('10 + 5 =', calculator.add(10, 5));
console.log('10 - 5 =', calculator.subtract(10, 5));
console.log('10 * 5 =', calculator.multiply(10, 5));
console.log('10 / 5 =', calculator.divide(10, 5));
console.log('10 / 0 =', calculator.divide(10, 0));

// ===== This 关键字 (This Keyword) =====
console.log('\n----- This 关键字 -----');

// 方法中的 this
const user = {
  firstName: '张',
  lastName: '三',
  getFullName: function() {
    return this.firstName + ' ' + this.lastName;
  },
  // 箭头函数中的 this (注意：箭头函数不绑定自己的 this)
  getFullNameArrow: () => {
    // 这里的 this 指向外层作用域（在Node.js中通常是 module.exports）
    return this.firstName + ' ' + this.lastName; // 可能返回 undefined undefined
  }
};

console.log('普通函数中的 this:');
console.log(user.getFullName()); // 张 三
console.log('箭头函数中的 this:');
console.log(user.getFullNameArrow()); // 可能返回 undefined undefined

// 显式绑定 this
function greet(greeting) {
  console.log(`${greeting}, ${this.name}!`);
}

const person1 = { name: '张三' };
const person2 = { name: '李四' };

console.log('\n显式绑定 this:');
greet.call(person1, '你好'); // 你好, 张三!
greet.apply(person2, ['Hello']); // Hello, 李四!

// bind 创建新函数
const greetPerson1 = greet.bind(person1);
greetPerson1('Hi'); // Hi, 张三!

// ===== 数组和数组方法 (Arrays and Array Methods) =====
console.log('\n----- 数组和数组方法 -----');

// 创建数组
const numbers = [1, 2, 3, 4, 5];
const fruits = new Array('apple', 'banana', 'orange');

console.log('创建的数组:');
console.log('numbers:', numbers);
console.log('fruits:', fruits);

// 数组访问和修改
console.log('\n数组访问:');
console.log('第一个元素:', numbers[0]);
console.log('最后一个元素:', numbers[numbers.length - 1]);

// 修改数组
numbers[2] = 30;
console.log('修改后的数组:', numbers);

// 数组长度
console.log('\n数组长度:', numbers.length);

// 数组转换方法
console.log('\n数组转换:');
console.log('toString():', numbers.toString());
console.log('join(", "):', numbers.join(', '));

// 栈和队列方法
console.log('\n栈和队列操作:');
const stack = [];
stack.push(10);
stack.push(20);
stack.push(30);
console.log('push 后:', stack);
console.log('pop 结果:', stack.pop());
console.log('pop 后:', stack);

const queue = [];
queue.push('a');
queue.push('b');
queue.push('c');
console.log('\n队列 push 后:', queue);
console.log('shift 结果:', queue.shift());
console.log('shift 后:', queue);
queue.unshift('x');
console.log('unshift 后:', queue);

// 数组操作方法
console.log('\n数组操作方法:');
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// concat
const concatenated = arr1.concat(arr2);
console.log('concat:', concatenated);

// slice
const sliced = numbers.slice(1, 3); // 从索引1开始，到索引3结束（不包含3）
console.log('slice(1, 3):', sliced);

// splice
const numbersCopy = [...numbers]; // 复制数组
numbersCopy.splice(1, 2, 100, 200); // 从索引1开始，删除2个元素，添加100和200
console.log('splice(1, 2, 100, 200):', numbersCopy);

// 位置方法
console.log('\n位置方法:');
const searchArray = [10, 20, 30, 20, 40];
console.log('indexOf(20):', searchArray.indexOf(20)); // 1
console.log('lastIndexOf(20):', searchArray.lastIndexOf(20)); // 3
console.log('includes(30):', searchArray.includes(30)); // true
console.log('includes(50):', searchArray.includes(50)); // false

// 迭代方法
console.log('\n迭代方法:');
const data = [1, 2, 3, 4, 5];

// forEach
console.log('forEach:');
data.forEach(item => console.log(item * 2));

// map
const doubled = data.map(item => item * 2);
console.log('map 结果:', doubled);

// filter
const evenNumbers = data.filter(item => item % 2 === 0);
console.log('filter 偶数:', evenNumbers);

// find
const firstEven = data.find(item => item % 2 === 0);
console.log('find 第一个偶数:', firstEven);

// findIndex
const firstEvenIndex = data.findIndex(item => item % 2 === 0);
console.log('findIndex 第一个偶数索引:', firstEvenIndex);

// every
const allPositive = data.every(item => item > 0);
console.log('every 正数:', allPositive);

// some
const hasEven = data.some(item => item % 2 === 0);
console.log('some 偶数:', hasEven);

// 归约方法
console.log('\n归约方法:');
const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log('reduce 求和:', sum);

const product = data.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
console.log('reduce 求积:', product);

// ===== JSON (Parse and Stringify) =====
console.log('\n----- JSON 处理 -----');

// JSON.stringify
const userObj = { 
  name: '张三', 
  age: 30, 
  address: { city: '北京' },
  hobbies: ['读书', '游泳']
};

const jsonString = JSON.stringify(userObj);
console.log('JSON.stringify 结果:', jsonString);

// 格式化输出
const prettyJson = JSON.stringify(userObj, null, 2);
console.log('\n格式化的 JSON:');
console.log(prettyJson);

// JSON.parse
const jsonData = '{"name":"李四","age":25,"isStudent":false}';
const parsedObj = JSON.parse(jsonData);
console.log('\nJSON.parse 结果:', parsedObj);
console.log('解析后的姓名:', parsedObj.name);

// 处理函数（不被序列化）
try {
  const objWithFunction = { name: '王五', greet: function() { console.log('Hello'); } };
  const jsonFunc = JSON.stringify(objWithFunction);
  console.log('\n包含函数的对象序列化:', jsonFunc); // 函数会被忽略
} catch (e) {
  console.error('序列化错误:', e.message);
}

// ===== 解构和展开运算符 (Destructuring and Spread Operators) =====
console.log('\n----- 解构和展开运算符 -----');

// 对象解构
console.log('对象解构:');
const userProfile = { 
  username: 'zhangsan', 
  level: 5, 
  score: 1000, 
  badges: ['新手', '活跃'] 
};

const { username, level } = userProfile;
console.log('解构出的用户名:', username);
console.log('解构出的等级:', level);

// 重命名和默认值
const { score: userScore, status = 'active' } = userProfile;
console.log('重命名的分数:', userScore);
console.log('带默认值的状态:', status);

// 数组解构
console.log('\n数组解构:');
const rgb = [255, 128, 0];
const [red, green, blue] = rgb;
console.log('红色值:', red);
console.log('绿色值:', green);
console.log('蓝色值:', blue);

// 跳过元素和剩余元素
const [first, , third, ...rest] = [1, 2, 3, 4, 5, 6];
console.log('第一个元素:', first);
console.log('第三个元素:', third);
console.log('剩余元素:', rest);

// 数组展开
console.log('\n数组展开:');
const part1 = [1, 2, 3];
const part2 = [4, 5, 6];
const combinedArray = [...part1, ...part2];
console.log('合并后的数组:', combinedArray);

// 复制数组
const originalArray = [10, 20, 30];
const copiedArray = [...originalArray];
console.log('复制的数组:', copiedArray);
console.log('是否是同一个数组:', originalArray === copiedArray); // false

// 函数参数展开
function sumThree(a, b, c) {
  return a + b + c;
}
const nums = [100, 200, 300];
console.log('函数参数展开结果:', sumThree(...nums)); // 600

// 对象展开
console.log('\n对象展开:');
const basicInfo = { name: '张三', age: 30 };
const contactInfo = { email: 'zhangsan@example.com', phone: '123456789' };
const completeInfo = { ...basicInfo, ...contactInfo };
console.log('合并后的对象:', completeInfo);

// 对象复制
const copiedObj = { ...basicInfo };
console.log('复制的对象:', copiedObj);

// 覆盖属性
const updatedInfo = { ...basicInfo, age: 31, city: '北京' };
console.log('更新后的对象:', updatedInfo);

console.log('\n===== 示例结束 =====');
console.log('\n执行命令: node examples.js');