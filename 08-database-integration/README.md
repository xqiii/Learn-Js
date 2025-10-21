# Database Integration | 数据库集成

## 学习目标 | Learning Objectives

学习本章节后，你将能够：
- 理解 MongoDB 的基本概念和工作原理
- 安装和配置 MongoDB 数据库
- 使用 Mongoose ORM 进行数据库操作
- 定义数据模型和模式（Schema）
- 执行基本的 CRUD 操作
- 实现数据验证和中间件
- 处理数据库关系和引用
- 优化数据库查询

## MongoDB 简介 | Introduction to MongoDB

MongoDB 是一个开源的文档数据库，是 NoSQL 数据库的一种，使用 BSON（Binary JSON）格式存储数据。

### MongoDB 的主要特点 | Key Features of MongoDB

- **文档导向**：使用类似于 JSON 的文档格式存储数据
- **模式灵活**：不需要预定义表结构，文档可以有不同的字段
- **可扩展性**：支持水平扩展，可以轻松处理大量数据
- **高性能**：内存映射存储引擎提供快速数据访问
- **索引支持**：支持各种类型的索引，提高查询性能
- **聚合框架**：提供强大的数据聚合和分析功能

### MongoDB 术语 | MongoDB Terminology

| MongoDB | 关系型数据库 | 描述 |
|---------|------------|------|
| 数据库（Database） | 数据库（Database） | 存储相关集合的容器 |
| 集合（Collection） | 表（Table） | 文档的集合 |
| 文档（Document） | 行（Row） | 数据记录，BSON 格式 |
| 字段（Field） | 列（Column） | 文档中的数据项 |
| 索引（Index） | 索引（Index） | 用于加速查询 |
| 聚合管道（Pipeline） | SQL 查询 | 用于数据处理和转换 |

## 安装 MongoDB | Installing MongoDB

### 在 macOS 上安装 | Installing on macOS

使用 Homebrew 安装：

```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 MongoDB
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB 服务
brew services start mongodb-community

# 停止 MongoDB 服务
# brew services stop mongodb-community
```

### 在 Windows 上安装 | Installing on Windows

1. 访问 [MongoDB 下载中心](https://www.mongodb.com/try/download/community)
2. 下载 Windows 版本的安装程序
3. 运行安装程序，按照向导完成安装
4. 将 MongoDB 的 bin 目录添加到环境变量 PATH 中
5. 创建数据目录：`mkdir -p C:\data\db`
6. 启动 MongoDB：在命令提示符中运行 `mongod`

### 在 Linux 上安装 | Installing on Linux

以 Ubuntu 为例：

```bash
# 导入 MongoDB 公钥
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

# 添加 MongoDB 源
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

# 更新包列表
sudo apt-get update

# 安装 MongoDB
sudo apt-get install -y mongodb-org

# 启动 MongoDB 服务
sudo systemctl start mongod

# 设置 MongoDB 开机自启
sudo systemctl enable mongod
```

## 使用 MongoDB Shell | Using MongoDB Shell

MongoDB Shell（mongosh）是一个交互式 JavaScript 接口，用于连接和管理 MongoDB 数据库。

### 基本操作 | Basic Operations

```javascript
// 连接到 MongoDB
mongosh

// 查看所有数据库
show dbs

// 使用特定数据库
use mydb

// 查看当前数据库
db

// 创建集合
db.createCollection("users")

// 查看所有集合
show collections

// 插入文档
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  createdAt: new Date()
})

// 插入多个文档
db.users.insertMany([
  { name: "Jane Smith", email: "jane@example.com", age: 25 },
  { name: "Bob Johnson", email: "bob@example.com", age: 35 }
])

// 查询所有文档
db.users.find()

// 格式化输出
db.users.find().pretty()

// 条件查询
db.users.find({ age: { $gt: 28 } })

// 更新文档
db.users.updateOne(
  { name: "John Doe" },
  { $set: { age: 31 } }
)

// 删除文档
db.users.deleteOne({ name: "Bob Johnson" })

// 统计文档数量
db.users.countDocuments()

// 退出 MongoDB Shell
exit
```

## Mongoose ORM 简介 | Introduction to Mongoose ORM

Mongoose 是 MongoDB 的对象文档模型（ODM）库，为 Node.js 提供了一种优雅的方式来与 MongoDB 交互。

### Mongoose 的主要功能 | Key Features of Mongoose

- **模式定义**：定义数据结构和验证规则
- **中间件**：在保存、更新等操作前后执行自定义逻辑
- **查询构建器**：提供丰富的查询 API
- **数据验证**：内置数据验证功能
- **虚拟属性**：定义不存储在数据库中的计算属性
- **钩子函数**：在文档生命周期的不同阶段执行函数

### 安装 Mongoose | Installing Mongoose

```bash
npm install mongoose
```

## 使用 Mongoose 连接 MongoDB | Connecting to MongoDB with Mongoose

```javascript
const mongoose = require('mongoose');

// 连接到 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('成功连接到 MongoDB'))
.catch(err => console.error('连接到 MongoDB 失败:', err));

// 断开连接
// mongoose.disconnect();
```

## 定义模型和模式 | Defining Models and Schemas

### 基本模式定义 | Basic Schema Definition

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 定义用户模式
const userSchema = new Schema({
  name: String,
  email: String,
  age: Number,
  isActive: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建用户模型
const User = mongoose.model('User', userSchema);

module.exports = User;
```

### 模式类型选项 | Schema Type Options

```javascript
const productSchema = new Schema({
  name: {
    type: String,
    required: true,         // 必填字段
    trim: true,             // 去除首尾空格
    maxlength: 100          // 最大长度
  },
  price: {
    type: Number,
    required: true,
    min: [0, '价格不能为负数']  // 最小值验证
  },
  category: {
    type: String,
    enum: ['电子产品', '服装', '食品'], // 枚举值验证
    default: '电子产品'
  },
  description: {
    type: String,
    default: ''
  },
  tags: [String],           // 字符串数组
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
```

### 验证器 | Validators

```javascript
const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,           // 唯一索引
    validate: {
      validator: function(v) {
        // 自定义验证器
        return /^ORD-\d{6}$/.test(v);
      },
      message: props => `${props.value} 不是有效的订单号格式！`
    }
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: '订单金额必须大于0'
    }
  }
});

const Order = mongoose.model('Order', orderSchema);
```

## CRUD 操作 | CRUD Operations

### 创建文档（Create） | Creating Documents

```javascript
const mongoose = require('mongoose');
const User = require('./models/User');

async function createUser() {
  try {
    // 方法 1：使用 new 创建实例并保存
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isActive: true
    });
    
    const savedUser = await user.save();
    console.log('保存的用户:', savedUser);
    
    // 方法 2：使用 create 静态方法
    const anotherUser = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28
    });
    
    console.log('创建的用户:', anotherUser);
  } catch (error) {
    console.error('创建用户失败:', error.message);
  }
}

createUser();
```

### 查询文档（Read） | Reading Documents

```javascript
async function findUsers() {
  try {
    // 查询所有用户
    const allUsers = await User.find();
    console.log('所有用户:', allUsers);
    
    // 条件查询
    const activeUsers = await User.find({ isActive: true });
    console.log('活跃用户:', activeUsers);
    
    // 查询单个文档
    const user = await User.findOne({ name: 'John Doe' });
    console.log('单个用户:', user);
    
    // 根据 ID 查询
    const userById = await User.findById('60d5f8b2e6d4c33e8c8e3e12');
    console.log('按 ID 查询:', userById);
    
    // 选择特定字段
    const usersWithNameAndEmail = await User.find()
      .select('name email -_id'); // -_id 表示排除 _id 字段
    console.log('用户（仅姓名和邮箱）:', usersWithNameAndEmail);
    
    // 排序
    const sortedUsers = await User.find()
      .sort({ age: 1 }); // 1 表示升序，-1 表示降序
    console.log('按年龄排序的用户:', sortedUsers);
    
    // 限制结果数量
    const limitedUsers = await User.find()
      .limit(5);
    console.log('限制为 5 个用户:', limitedUsers);
    
    // 分页
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const paginatedUsers = await User.find()
      .skip(skip)
      .limit(limit);
    console.log(`第 ${page} 页的用户（每页 ${limit} 个）:`, paginatedUsers);
  } catch (error) {
    console.error('查询用户失败:', error.message);
  }
}

findUsers();
```

### 更新文档（Update） | Updating Documents

```javascript
async function updateUser() {
  try {
    // 方法 1：使用 findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { name: 'John Doe' },          // 查询条件
      { age: 31, email: 'john.doe@example.com' }, // 更新的字段
      { new: true, runValidators: true } // 选项：返回更新后的文档，运行验证器
    );
    console.log('更新后的用户:', updatedUser);
    
    // 方法 2：使用 updateOne
    const result = await User.updateOne(
      { name: 'Jane Smith' },
      { $set: { age: 29 } }
    );
    console.log('更新结果:', result);
    
    // 方法 3：先查找，再更新，再保存
    const user = await User.findOne({ name: 'Bob Johnson' });
    if (user) {
      user.age = 36;
      user.isActive = true;
      await user.save();
      console.log('保存更新后的用户:', user);
    }
    
    // 更新多个文档
    const multipleResult = await User.updateMany(
      { age: { $lt: 30 } },  // 条件：年龄小于 30
      { $set: { isActive: true } } // 设置为活跃
    );
    console.log('更新多个文档的结果:', multipleResult);
  } catch (error) {
    console.error('更新用户失败:', error.message);
  }
}

updateUser();
```

### 删除文档（Delete） | Deleting Documents

```javascript
async function deleteUser() {
  try {
    // 删除单个文档
    const deletedUser = await User.findOneAndDelete({ name: 'Bob Johnson' });
    console.log('删除的用户:', deletedUser);
    
    // 使用 deleteOne
    const deleteResult = await User.deleteOne({ email: 'test@example.com' });
    console.log('删除结果:', deleteResult);
    
    // 删除多个文档
    const deleteManyResult = await User.deleteMany({ isActive: false });
    console.log('删除多个文档的结果:', deleteManyResult);
    
    // 根据 ID 删除
    const deleteByIdResult = await User.findByIdAndDelete('60d5f8b2e6d4c33e8c8e3e12');
    console.log('根据 ID 删除的结果:', deleteByIdResult);
  } catch (error) {
    console.error('删除用户失败:', error.message);
  }
}

deleteUser();
```

## 数据关系 | Data Relationships

Mongoose 支持多种方式来处理文档之间的关系。

### 引用关系（Referencing） | Referencing

```javascript
// 定义作者模式
const authorSchema = new Schema({
  name: String,
  bio: String,
  birthDate: Date
});

const Author = mongoose.model('Author', authorSchema);

// 定义书籍模式，引用作者
const bookSchema = new Schema({
  title: String,
  publishedYear: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author' // 引用 Author 模型
  }
});

const Book = mongoose.model('Book', bookSchema);

// 创建并关联数据
async function createAndRelateData() {
  try {
    // 创建作者
    const author = await Author.create({
      name: 'J.K. Rowling',
      bio: '英国作家',
      birthDate: new Date('1965-07-31')
    });
    
    // 创建书籍并关联作者
    const book = await Book.create({
      title: '哈利·波特与魔法石',
      publishedYear: 1997,
      author: author._id
    });
    
    console.log('书籍:', book);
    
    // 使用 populate 获取关联的作者信息
    const bookWithAuthor = await Book.findById(book._id).populate('author');
    console.log('包含作者信息的书籍:', bookWithAuthor);
  } catch (error) {
    console.error('创建关联数据失败:', error.message);
  }
}

createAndRelateData();
```

### 嵌入关系（Embedding） | Embedding

```javascript
// 定义评论子文档模式
const commentSchema = new Schema({
  text: String,
  author: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 定义文章模式，嵌入评论
const articleSchema = new Schema({
  title: String,
  content: String,
  author: String,
  comments: [commentSchema] // 嵌入评论子文档数组
});

const Article = mongoose.model('Article', articleSchema);

// 创建带有嵌入评论的文章
async function createArticleWithComments() {
  try {
    const article = await Article.create({
      title: 'MongoDB 入门指南',
      content: 'MongoDB 是一个开源的文档数据库...',
      author: '数据库专家',
      comments: [
        {
          text: '非常有用的文章！',
          author: '用户1'
        },
        {
          text: '感谢分享！',
          author: '用户2'
        }
      ]
    });
    
    console.log('带有评论的文章:', article);
    
    // 添加新评论
    article.comments.push({
      text: '这篇文章帮助很大',
      author: '用户3'
    });
    
    await article.save();
    console.log('更新后的文章:', article);
  } catch (error) {
    console.error('创建文章失败:', error.message);
  }
}

createArticleWithComments();
```

## 中间件（Middleware） | Middleware

Mongoose 中间件允许你在文档的生命周期的不同阶段执行函数。

### 预保存中间件（Pre-save Middleware） | Pre-save Middleware

```javascript
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 密码哈希中间件
userSchema.pre('save', async function(next) {
  // 只有在密码被修改或创建新用户时才哈希密码
  if (!this.isModified('password')) return next();
  
  try {
    // 这里应该使用密码哈希库如 bcrypt
    // const hashedPassword = await bcrypt.hash(this.password, 10);
    // this.password = hashedPassword;
    
    console.log('密码已被哈希处理');
    next();
  } catch (error) {
    return next(error);
  }
});

// 验证电子邮件格式的中间件
userSchema.pre('save', function(next) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    return next(new Error('无效的电子邮件格式'));
  }
  next();
});

const User = mongoose.model('User', userSchema);
```

### 后保存中间件（Post-save Middleware） | Post-save Middleware

```javascript
userSchema.post('save', function(doc, next) {
  console.log(`用户 ${doc.email} 已被保存`);
  // 这里可以发送通知、记录日志等
  next();
});

// 删除后的中间件
userSchema.post('remove', function(doc, next) {
  console.log(`用户 ${doc.email} 已被删除`);
  // 执行清理操作
  next();
});
```

## 聚合管道 | Aggregation Pipeline

MongoDB 的聚合管道提供了数据转换和分析的强大工具。

```javascript
async function runAggregation() {
  try {
    // 按年龄分组并计算每个年龄段的用户数量
    const ageGroups = await User.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 18] }, then: '未成年人' },
                { case: { $lt: ['$age', 30] }, then: '18-29岁' },
                { case: { $lt: ['$age', 50] }, then: '30-49岁' }
              ],
              default: '50岁以上'
            }
          },
          count: { $sum: 1 },
          averageAge: { $avg: '$age' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('按年龄分组统计:', ageGroups);
    
    // 查找活跃用户并计算平均年龄
    const activeUsersStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          averageAge: { $avg: '$age' }
        }
      }
    ]);
    
    console.log('活跃用户统计:', activeUsersStats);
  } catch (error) {
    console.error('聚合查询失败:', error.message);
  }
}

runAggregation();
```

## 虚拟属性 | Virtual Properties

虚拟属性是文档的属性，但不会存储在 MongoDB 中。

```javascript
const personSchema = new Schema({
  firstName: String,
  lastName: String
});

// 定义虚拟属性 fullName
personSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// 设置虚拟属性的 setter
personSchema.virtual('fullName').set(function(name) {
  const [firstName, lastName] = name.split(' ');
  this.firstName = firstName;
  this.lastName = lastName;
});

const Person = mongoose.model('Person', personSchema);

async function useVirtualProperties() {
  try {
    const person = new Person({
      firstName: 'John',
      lastName: 'Doe'
    });
    
    console.log('全名:', person.fullName); // 输出: John Doe
    
    // 使用 setter
    person.fullName = 'Jane Smith';
    console.log('修改后的名字:', person.firstName, person.lastName); // 输出: Jane Smith
    
    await person.save();
    console.log('保存的文档:', person); // fullName 不会保存在数据库中
  } catch (error) {
    console.error('使用虚拟属性失败:', error.message);
  }
}

useVirtualProperties();
```

## 高级查询技巧 | Advanced Query Techniques

### 索引 | Indexes

```javascript
// 在定义模式时创建索引
const userSchema = new Schema({
  email: {
    type: String,
    index: true,     // 单字段索引
    unique: true     // 唯一索引
  },
  name: String,
  age: Number
});

// 复合索引
userSchema.index({ name: 1, age: -1 });

const User = mongoose.model('User', userSchema);

// 创建文本索引（用于全文搜索）
userSchema.index({ name: 'text', email: 'text' });

// 查看索引信息
async function checkIndexes() {
  try {
    const indexes = await User.collection.getIndexes();
    console.log('索引信息:', indexes);
  } catch (error) {
    console.error('获取索引信息失败:', error.message);
  }
}

checkIndexes();
```

### 高级查询操作符 | Advanced Query Operators

```javascript
async function runAdvancedQueries() {
  try {
    // $gt, $gte, $lt, $lte - 比较操作符
    const usersWithAgeBetween25And35 = await User.find({
      age: { $gte: 25, $lte: 35 }
    });
    
    // $in - 值在数组中
    const usersWithSpecificNames = await User.find({
      name: { $in: ['John', 'Jane', 'Bob'] }
    });
    
    // $or - 逻辑或
    const usersWithCondition = await User.find({
      $or: [{ age: { $lt: 25 } }, { isActive: false }]
    });
    
    // $and - 逻辑与
    const activeAdultUsers = await User.find({
      $and: [{ age: { $gte: 18 } }, { isActive: true }]
    });
    
    // $exists - 字段是否存在
    const usersWithBio = await User.find({
      bio: { $exists: true }
    });
    
    // $regex - 正则表达式
    const usersWithEmailFromExample = await User.find({
      email: { $regex: /@example\.com$/, $options: 'i' } // i 表示忽略大小写
    });
    
    console.log('高级查询结果:', {
      usersWithAgeBetween25And35: usersWithAgeBetween25And35.length,
      usersWithSpecificNames: usersWithSpecificNames.length,
      usersWithCondition: usersWithCondition.length,
      activeAdultUsers: activeAdultUsers.length,
      usersWithBio: usersWithBio.length,
      usersWithEmailFromExample: usersWithEmailFromExample.length
    });
  } catch (error) {
    console.error('高级查询失败:', error.message);
  }
}

runAdvancedQueries();
```

## 最佳实践 | Best Practices

1. **使用环境变量**：不要在代码中硬编码数据库连接字符串
   ```javascript
   const mongoose = require('mongoose');
   require('dotenv').config();
   
   mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true
   });
   ```

2. **错误处理**：实现适当的错误处理和连接状态监控
   ```javascript
   mongoose.connection.on('error', err => {
     console.error('MongoDB 连接错误:', err);
     process.exit(1); // 退出进程，让进程管理器重启服务
   });
   
   mongoose.connection.once('open', () => {
     console.log('MongoDB 连接成功');
   });
   ```

3. **使用事务**：对于需要原子性的操作，使用 MongoDB 事务
   ```javascript
   const session = await mongoose.startSession();
   session.startTransaction();
   
   try {
     // 执行多个操作
     await User.create([{ name: 'John' }], { session });
     await Product.updateOne({ _id: '123' }, { $inc: { stock: -1 } }, { session });
     
     await session.commitTransaction();
   } catch (error) {
     await session.abortTransaction();
     throw error;
   } finally {
     session.endSession();
   }
   ```

4. **查询优化**：确保查询使用索引，避免全表扫描
   ```javascript
   // 查看查询执行计划
   const explainResult = await User.find({ age: { $gt: 30 } }).explain();
   console.log('查询执行计划:', explainResult);
   ```

5. **数据验证**：使用 Mongoose 的验证功能确保数据质量
   ```javascript
   const userSchema = new Schema({
     email: {
       type: String,
       required: [true, '邮箱是必填的'],
       unique: true,
       validate: {
         validator: function(v) {
           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
         },
         message: '请提供有效的邮箱地址'
       }
     }
   });
   ```

## 执行方式 | Execution Methods

在本章节中，所有 MongoDB 和 Mongoose 示例都可以通过以下方式执行：

1. 确保安装了 Node.js 和 MongoDB
2. 安装所需的依赖
   ```bash
   npm install mongoose dotenv
   ```
3. 创建示例文件
4. 运行示例
   ```bash
   node filename.js
   ```

请查看 `examples.js` 文件获取更多可执行的示例代码。