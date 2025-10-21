// 数据库集成示例代码 | Database Integration Example Code

// 注意：运行这些示例之前，请确保：
// 1. MongoDB 服务已经启动
// 2. 已经安装了必要的依赖：npm install mongoose

// ========== 1. 连接 MongoDB ==========
const mongoose = require('mongoose');

// 连接配置
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/jsprotect', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ 成功连接到 MongoDB');
  } catch (error) {
    console.error('❌ 连接到 MongoDB 失败:', error.message);
    process.exit(1);
  }
};

// ========== 2. 定义模型 ==========
// 用户模型
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '名称是必填的'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '邮箱是必填的'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} 不是有效的邮箱地址！`
    }
  },
  age: {
    type: Number,
    min: [0, '年龄不能为负数'],
    max: [120, '年龄超出合理范围']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 中间件示例
userSchema.pre('save', function(next) {
  console.log(`准备保存用户: ${this.name}`);
  next();
});

userSchema.post('save', function(doc, next) {
  console.log(`用户已保存: ${doc.name}`);
  next();
});

// 虚拟属性
userSchema.virtual('info').get(function() {
  return `${this.name} (${this.email}), ${this.age ? this.age : '年龄未知'}岁`;
});

// 方法
userSchema.methods.greet = function() {
  return `你好，我是 ${this.name}！`;
};

// 静态方法
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// 创建模型
const User = mongoose.model('User', userSchema);

// 产品模型
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['电子产品', '服装', '食品', '书籍'],
    default: '电子产品'
  },
  tags: [String],
  inStock: {
    type: Boolean,
    default: true
  }
});

const Product = mongoose.model('Product', productSchema);

// 订单模型 - 展示引用关系
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['待处理', '已付款', '已发货', '已完成', '已取消'],
    default: '待处理'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

// ========== 3. CRUD 操作示例 ==========

// 创建用户
const createUser = async () => {
  try {
    // 方法 1: 使用 new 创建实例并保存
    const user1 = new User({
      name: '张三',
      email: 'zhangsan@example.com',
      age: 28
    });
    await user1.save();
    console.log('创建的用户 1:', user1.info);
    console.log(user1.greet());

    // 方法 2: 使用 create 静态方法
    const user2 = await User.create({
      name: '李四',
      email: 'lisi@example.com',
      age: 32
    });
    console.log('创建的用户 2:', user2.info);

    // 批量创建
    const users = await User.create([
      { name: '王五', email: 'wangwu@example.com', age: 25 },
      { name: '赵六', email: 'zhaoliu@example.com', age: 40 },
      { name: '孙七', email: 'sunqi@example.com', age: 35 }
    ]);
    console.log(`批量创建了 ${users.length} 个用户`);
  } catch (error) {
    console.error('创建用户失败:', error.message);
  }
};

// 查询用户
const findUsers = async () => {
  try {
    // 查询所有用户
    const allUsers = await User.find();
    console.log('\n所有用户:');
    allUsers.forEach(user => console.log(user.info));

    // 条件查询 - 年龄大于30的用户
    const usersOver30 = await User.find({ age: { $gt: 30 } });
    console.log('\n年龄大于30的用户:');
    usersOver30.forEach(user => console.log(user.info));

    // 单一用户查询
    const userByName = await User.findOne({ name: '张三' });
    if (userByName) console.log('\n按名称查询:', userByName.info);

    // 使用静态方法查询
    const userByEmail = await User.findByEmail('lisi@example.com');
    if (userByEmail) console.log('\n使用静态方法按邮箱查询:', userByEmail.info);

    // 字段选择
    const usersWithSelectFields = await User.find().select('name email -_id');
    console.log('\n仅选择名称和邮箱:');
    usersWithSelectFields.forEach(user => console.log(user));

    // 排序
    const sortedUsers = await User.find().sort({ age: 1 });
    console.log('\n按年龄升序排序:');
    sortedUsers.forEach(user => console.log(`${user.name}: ${user.age}岁`));

    // 分页
    const page = 1;
    const limit = 2;
    const usersWithPagination = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(`\n第${page}页的用户（每页${limit}个）:`);
    usersWithPagination.forEach(user => console.log(user.info));
  } catch (error) {
    console.error('查询用户失败:', error.message);
  }
};

// 更新用户
const updateUsers = async () => {
  try {
    // 方法1: findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { name: '张三' },
      { age: 29, email: 'zhangsan_new@example.com' },
      { new: true, runValidators: true }
    );
    if (updatedUser) console.log('\n更新后的用户:', updatedUser.info);

    // 方法2: updateOne
    const updateResult = await User.updateOne(
      { name: '李四' },
      { $set: { age: 33 } }
    );
    console.log('\n更新结果:', updateResult);

    // 更新多个用户
    const updateManyResult = await User.updateMany(
      { age: { $lt: 30 } },
      { $set: { isActive: true } }
    );
    console.log('\n批量更新结果:', updateManyResult);

    // 方法3: 先查找，修改属性，然后保存
    const user = await User.findOne({ name: '王五' });
    if (user) {
      user.age += 1;
      await user.save();
      console.log('\n通过修改对象属性更新:', user.info);
    }
  } catch (error) {
    console.error('更新用户失败:', error.message);
  }
};

// 删除用户
const deleteUsers = async () => {
  try {
    // 删除单个用户
    const deletedUser = await User.findOneAndDelete({ name: '孙七' });
    if (deletedUser) console.log('\n删除的用户:', deletedUser.info);

    // deleteOne
    const deleteResult = await User.deleteOne({ name: '不存在的用户' });
    console.log('\ndeleteOne 结果:', deleteResult);

    // 删除多个用户
    const deleteManyResult = await User.deleteMany({ age: { $gt: 50 } });
    console.log('\ndeleteMany 结果:', deleteManyResult);
  } catch (error) {
    console.error('删除用户失败:', error.message);
  }
};

// ========== 4. 关系处理 ==========

// 创建带有关联的订单
const createOrdersWithRelations = async () => {
  try {
    // 首先创建一些产品
    const products = await Product.create([
      { name: '笔记本电脑', price: 5999, category: '电子产品', tags: ['电脑', '办公'] },
      { name: '智能手机', price: 2999, category: '电子产品', tags: ['手机', '通讯'] },
      { name: 'T恤衫', price: 99, category: '服装', tags: ['衣服', '夏季'] },
      { name: '书籍', price: 45, category: '书籍', tags: ['阅读', '学习'] }
    ]);
    console.log('\n创建了产品:', products.map(p => `${p.name}: ¥${p.price}`));

    // 获取用户
    const user = await User.findOne();
    if (!user) {
      console.log('未找到用户');
      return;
    }

    // 创建订单
    const order = new Order({
      user: user._id,
      products: [
        { product: products[0]._id, quantity: 1 },
        { product: products[1]._id, quantity: 2 }
      ],
      totalAmount: products[0].price + (products[1].price * 2),
      status: '已付款'
    });

    await order.save();
    console.log('\n创建的订单:', order);

    // 使用 populate 获取关联数据
    const orderWithDetails = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    console.log('\n包含详细信息的订单:');
    console.log(`用户: ${orderWithDetails.user.name} (${orderWithDetails.user.email})`);
    console.log('产品:');
    orderWithDetails.products.forEach(item => {
      console.log(`- ${item.product.name}: ¥${item.product.price} x ${item.quantity}`);
    });
    console.log(`总金额: ¥${orderWithDetails.totalAmount}`);
  } catch (error) {
    console.error('创建订单失败:', error.message);
  }
};

// ========== 5. 聚合查询 ==========

const runAggregateQueries = async () => {
  try {
    // 1. 按年龄分组统计
    const ageStats = await User.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 25] }, then: '25岁以下' },
                { case: { $lt: ['$age', 35] }, then: '25-35岁' },
                { case: { $lt: ['$age', 45] }, then: '35-45岁' }
              ],
              default: '45岁以上'
            }
          },
          count: { $sum: 1 },
          avgAge: { $avg: '$age' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n按年龄段统计:');
    ageStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}人, 平均年龄: ${stat.avgAge.toFixed(1)}岁`);
    });

    // 2. 计算产品类别统计
    const productCategoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalValue: { $sum: '$price' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    console.log('\n产品类别统计:');
    productCategoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}个产品, 平均价格: ¥${stat.avgPrice.toFixed(2)}, 总价值: ¥${stat.totalValue}`);
    });

    // 3. 复杂聚合 - 订单金额统计
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          avgAmount: { $avg: '$totalAmount' }
        }
      }
    ]);

    console.log('\n订单状态统计:');
    orderStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}个订单, 总金额: ¥${stat.totalAmount}, 平均金额: ¥${stat.avgAmount.toFixed(2)}`);
    });
  } catch (error) {
    console.error('聚合查询失败:', error.message);
  }
};

// ========== 6. 高级查询 ==========

const runAdvancedQueries = async () => {
  try {
    // 使用高级操作符
    console.log('\n高级查询示例:');

    // $gt, $lt 范围查询
    const usersInRange = await User.find({ age: { $gte: 25, $lte: 35 } });
    console.log(`\n25-35岁之间的用户 (${usersInRange.length}人):`);
    usersInRange.forEach(user => console.log(user.info));

    // $in 查询
    const usersWithSpecificNames = await User.find({ name: { $in: ['张三', '李四', '王五'] } });
    console.log(`\n特定名称的用户 (${usersWithSpecificNames.length}人):`);
    usersWithSpecificNames.forEach(user => console.log(user.info));

    // $or 查询
    const specificUsers = await User.find({
      $or: [{ age: { $lt: 28 } }, { isActive: false }]
    });
    console.log(`\n年龄小于28或非活跃的用户 (${specificUsers.length}人)`);

    // 正则表达式查询
    const usersWithExampleEmail = await User.find({ email: { $regex: /example\.com$/, $options: 'i' } });
    console.log(`\n邮箱包含example.com的用户 (${usersWithExampleEmail.length}人)`);

    // 数组查询
    const electronicProducts = await Product.find({ category: '电子产品' });
    console.log(`\n电子产品 (${electronicProducts.length}个):`);
    electronicProducts.forEach(p => console.log(`${p.name}: ¥${p.price}`));

    // 使用 $elemMatch 查询数组
    const productsWithTag = await Product.find({ tags: { $elemMatch: { $eq: '电脑' } } });
    console.log(`\n包含'电脑'标签的产品 (${productsWithTag.length}个):`);
    productsWithTag.forEach(p => console.log(p.name));
  } catch (error) {
    console.error('高级查询失败:', error.message);
  }
};

// ========== 主函数 - 运行所有示例 ==========
const runAllExamples = async () => {
  console.log('=== MongoDB 和 Mongoose 示例 ===');

  try {
    // 连接数据库
    await connectToMongoDB();

    // 运行 CRUD 示例
    console.log('\n--- 创建用户 ---');
    await createUser();

    console.log('\n--- 查询用户 ---');
    await findUsers();

    console.log('\n--- 更新用户 ---');
    await updateUsers();

    console.log('\n--- 创建带关系的订单 ---');
    await createOrdersWithRelations();

    console.log('\n--- 聚合查询 ---');
    await runAggregateQueries();

    console.log('\n--- 高级查询 ---');
    await runAdvancedQueries();

    console.log('\n--- 删除用户示例 ---');
    await deleteUsers();

  } catch (error) {
    console.error('运行示例时出错:', error);
  } finally {
    // 断开连接
    await mongoose.disconnect();
    console.log('\n✅ 已断开与 MongoDB 的连接');
  }
};

// ========== 如何运行此示例 ==========
/*
  要运行此示例，请按照以下步骤操作：
  
  1. 确保 MongoDB 服务已经启动
     - macOS: brew services start mongodb-community
     - Windows: 启动 MongoDB 服务或运行 mongod 命令
     - Linux: sudo systemctl start mongod
  
  2. 安装必要的依赖
     npm install mongoose
  
  3. 运行示例
     node examples.js
  
  注意：此示例将创建临时数据用于演示。在实际应用中，请根据需要修改连接字符串和数据操作。
*/

// 运行所有示例
// 取消下面的注释以运行所有示例
// runAllExamples();

// 如果要单独运行某个示例，可以取消相应函数的注释
// 例如：
// connectToMongoDB().then(() => createUser());

module.exports = {
  connectToMongoDB,
  User,
  Product,
  Order,
  createUser,
  findUsers,
  updateUsers,
  deleteUsers,
  createOrdersWithRelations,
  runAggregateQueries,
  runAdvancedQueries,
  runAllExamples
};