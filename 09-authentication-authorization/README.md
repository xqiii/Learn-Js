# Authentication and Authorization | 认证和授权

## 学习目标 | Learning Objectives

学习本章节后，你将能够：
- 理解认证（Authentication）和授权（Authorization）的区别
- 实现安全的用户认证系统
- 掌握密码哈希和安全存储技术
- 使用 JWT（JSON Web Token）进行身份验证
- 实现会话管理
- 理解 OAuth 2.0 和第三方登录流程
- 实现基于角色的访问控制（RBAC）
- 应用安全最佳实践

## 认证与授权的区别 | Authentication vs. Authorization

### 认证（Authentication）

认证是确认用户身份的过程，验证用户是否是他们声称的人。

- **什么是认证？** 验证用户身份的机制
- **目标**：回答「你是谁？」的问题
- **常见方式**：用户名/密码、生物识别、多因素认证等
- **结果**：用户被确认为特定身份

### 授权（Authorization）

授权是决定已认证用户可以访问哪些资源和执行哪些操作的过程。

- **什么是授权？** 控制用户权限的机制
- **目标**：回答「你可以做什么？」的问题
- **常见方式**：角色、权限位、访问控制列表等
- **结果**：允许或拒绝用户对特定资源的访问

### 两者关系 | Relationship Between Authentication and Authorization

1. 认证通常在授权之前发生
2. 未认证用户不能进行授权
3. 已认证用户可能没有权限访问所有资源

```
用户 --> 认证 --> 授权 --> 资源访问
```

## 密码安全 | Password Security

### 密码哈希 | Password Hashing

哈希是将任意长度的输入转换为固定长度的输出的过程，用于安全地存储密码。

- **单向函数**：从哈希值无法轻易还原原始密码
- **确定性**：相同输入始终产生相同输出
- **雪崩效应**：输入的微小变化会导致输出的巨大变化

### bcrypt 库 | bcrypt Library

`bcrypt` 是一个流行的密码哈希库，它自动处理盐值和哈希轮数。

```bash
npm install bcrypt
```

### 密码哈希示例 | Password Hashing Example

```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 哈希密码
async function hashPassword(plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('哈希密码时出错:', error);
    throw error;
  }
}

// 验证密码
async function validatePassword(plainPassword, hashedPassword) {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('验证密码时出错:', error);
    throw error;
  }
}
```

## JWT (JSON Web Token) | JWT (JSON Web Token)

### JWT 简介 | JWT Introduction

JWT 是一种开放标准（RFC 7519），定义了一种紧凑且自包含的方式，用于在各方之间安全地传输信息。

### JWT 结构 | JWT Structure

JWT 由三部分组成，用点（`.`）分隔：

1. **Header**（头部）：包含令牌类型和使用的签名算法
2. **Payload**（负载）：包含声明（claims）和用户信息
3. **Signature**（签名）：确保令牌未被篡改

格式：`xxxxx.yyyyy.zzzzz`

### JWT 工作流程 | JWT Workflow

1. 用户使用凭据（用户名/密码）登录
2. 服务器验证凭据
3. 服务器生成包含用户信息的 JWT
4. 服务器将 JWT 返回给客户端
5. 客户端在后续请求中包含 JWT
6. 服务器验证 JWT 的有效性
7. 服务器基于 JWT 中的信息授权访问

### 使用 jsonwebtoken 库 | Using jsonwebtoken Library

```bash
npm install jsonwebtoken
```

### JWT 示例 | JWT Example

```javascript
const jwt = require('jsonwebtoken');

// JWT 密钥
const SECRET_KEY = 'your-secret-key'; // 在生产环境中应使用环境变量

// 生成 JWT
function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
    // 可选：设置过期时间
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 小时后过期
  };

  return jwt.sign(payload, SECRET_KEY);
}

// 验证 JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    // 令牌无效或过期
    return null;
  }
}

// JWT 中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: '未提供认证令牌' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(403).json({ message: '无效的令牌' });

  req.user = decoded; // 将用户信息存储在请求对象中
  next();
}
```

## 会话管理 | Session Management

### 基于会话的认证 | Session-Based Authentication

基于会话的认证使用服务器端会话存储用户信息。

### 工作流程 | Workflow

1. 用户登录
2. 服务器验证凭据
3. 服务器创建会话并存储在服务器端
4. 服务器生成会话 ID 并将其发送给客户端（通常通过 cookie）
5. 客户端在后续请求中发送会话 ID
6. 服务器验证会话 ID 并获取用户信息
7. 服务器授权访问

### 使用 express-session | Using express-session

```bash
npm install express-session
```

### 会话示例 | Session Example

```javascript
const express = require('express');
const session = require('express-session');
const app = express();

// 配置会话中间件
app.use(session({
  secret: 'your-secret-key', // 用于签名会话 ID
  resave: false, // 不强制保存未修改的会话
  saveUninitialized: false, // 不保存未初始化的会话
  cookie: {
    secure: false, // 在生产环境中应为 true（仅 HTTPS）
    httpOnly: true, // 防止客户端 JavaScript 访问 cookie
    maxAge: 3600000 // 会话过期时间（毫秒）
  }
}));

// 登录路由
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证用户凭据（这里是简化的示例）
    const user = await findUserByUsername(username);
    if (!user || !(await validatePassword(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 创建会话
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;
    
    res.json({ message: '登录成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 会话认证中间件
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: '请先登录' });
  }
  next();
}

// 受保护的路由
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: '访问受保护的资源', user: req.session.username });
});

// 登出路由
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: '登出失败' });
    }
    res.json({ message: '登出成功' });
  });
});
```

## OAuth 2.0 | OAuth 2.0

### OAuth 2.0 简介 | OAuth 2.0 Introduction

OAuth 2.0 是一个授权框架，允许用户授权第三方应用访问其在另一个服务提供商上的资源，而无需共享其凭据。

### OAuth 2.0 角色 | OAuth 2.0 Roles

1. **资源所有者**（Resource Owner）：授权访问其资源的用户
2. **客户端**（Client）：请求访问资源的应用
3. **授权服务器**（Authorization Server）：负责验证用户身份并发放访问令牌
4. **资源服务器**（Resource Server）：存储受保护资源的服务器

### OAuth 2.0 授权流程 | OAuth 2.0 Authorization Flows

#### 授权码流程（Authorization Code Flow）

适用于有后端服务器的应用：

1. 用户访问客户端应用
2. 客户端重定向用户到授权服务器
3. 用户在授权服务器上登录并授权客户端
4. 授权服务器重定向用户到客户端，附带授权码
5. 客户端使用授权码向授权服务器请求访问令牌
6. 授权服务器验证授权码并返回访问令牌
7. 客户端使用访问令牌访问资源服务器上的资源

#### 隐式授权流程（Implicit Flow）

适用于纯前端应用（不推荐用于新应用）：

1. 用户访问客户端应用
2. 客户端重定向用户到授权服务器
3. 用户在授权服务器上登录并授权客户端
4. 授权服务器直接返回访问令牌（通过 URL 片段）
5. 客户端使用访问令牌访问资源服务器

#### 客户端凭证流程（Client Credentials Flow）

适用于服务器间通信：

1. 客户端向授权服务器提供其客户端 ID 和客户端密钥
2. 授权服务器验证凭据
3. 授权服务器返回访问令牌
4. 客户端使用访问令牌访问资源服务器

#### 密码凭证流程（Resource Owner Password Credentials Flow）

适用于高信任度的应用：

1. 用户向客户端提供其用户名和密码
2. 客户端向授权服务器发送用户凭据
3. 授权服务器验证凭据
4. 授权服务器返回访问令牌
5. 客户端使用访问令牌访问资源服务器

### 使用 Passport.js | Using Passport.js

Passport.js 是 Node.js 的身份验证中间件。

```bash
npm install passport passport-oauth2
```

### OAuth 2.0 示例（GitHub） | OAuth 2.0 Example (GitHub)

```javascript
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const session = require('express-session');
const app = express();

// 配置会话
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 配置 GitHub OAuth 策略
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token',
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, cb) {
    // 在这里，你通常会查找或创建用户
    try {
      // 获取用户信息（示例）
      // const userInfo = await fetchGitHubUserInfo(accessToken);
      // 查找或创建用户
      // const user = await findOrCreateUser(userInfo);
      return cb(null, { id: '1', username: 'example' }); // 简化的示例
    } catch (error) {
      return cb(error);
    }
  }
));

// 序列化用户（存储在会话中）
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

// 反序列化用户（从会话中检索）
passport.deserializeUser(function(id, cb) {
  // 在这里，你通常会从数据库中查找用户
  cb(null, { id, username: 'example' }); // 简化的示例
});

// 路由
app.get('/auth/github', passport.authenticate('oauth2'));

app.get('/auth/github/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // 成功认证后重定向
    res.redirect('/profile');
  }
);

app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({ message: '访问个人资料', user: req.user });
});

// 确保用户已认证的中间件
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// 登出
app.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 基于角色的访问控制 (RBAC) | Role-Based Access Control (RBAC)

### RBAC 简介 | RBAC Introduction

基于角色的访问控制是一种根据用户角色限制系统访问的方法。

### RBAC 核心概念 | RBAC Core Concepts

1. **用户**（Users）：系统的用户
2. **角色**（Roles）：权限的集合
3. **权限**（Permissions）：允许的操作
4. **分配**（Assignments）：将用户分配到角色

### RBAC 示例 | RBAC Example

```javascript
// 角色权限定义
const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superAdmin'
};

const PERMISSIONS = {
  READ_PROFILE: 'readProfile',
  EDIT_PROFILE: 'editProfile',
  READ_USERS: 'readUsers',
  EDIT_USERS: 'editUsers',
  DELETE_USERS: 'deleteUsers',
  MANAGE_SETTINGS: 'manageSettings'
};

// 角色权限映射
const ROLE_PERMISSIONS = {
  [ROLES.USER]: [
    PERMISSIONS.READ_PROFILE,
    PERMISSIONS.EDIT_PROFILE
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.READ_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.MANAGE_SETTINGS
  ],
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.READ_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.MANAGE_SETTINGS
  ]
};

// 检查用户是否有权限
function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

// 基于角色的中间件
function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '请先登录' });
    }
    
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: '权限不足' });
    }
    
    next();
  };
}

// 基于权限的中间件
function checkPermission(requiredPermission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '请先登录' });
    }
    
    if (!hasPermission(req.user, requiredPermission)) {
      return res.status(403).json({ message: '权限不足' });
    }
    
    next();
  };
}

// 使用示例
app.get('/admin/users', 
  authenticateToken, 
  checkPermission(PERMISSIONS.READ_USERS), 
  (req, res) => {
    // 获取用户列表
    res.json({ message: '用户列表', users: [...] });
  }
);

app.delete('/admin/users/:id', 
  authenticateToken, 
  checkPermission(PERMISSIONS.DELETE_USERS), 
  (req, res) => {
    // 删除用户
    res.json({ message: '用户已删除' });
  }
);
```

## 多因素认证 (MFA) | Multi-Factor Authentication (MFA)

### MFA 简介 | MFA Introduction

多因素认证是一种安全机制，要求用户提供两种或更多的验证因素来证明其身份。

### MFA 因素类型 | MFA Factor Types

1. **知识因素**（Something you know）：如密码、PIN码
2. **拥有因素**（Something you have）：如手机、安全令牌
3. **固有因素**（Something you are）：如指纹、面部识别

### 使用 speakeasy 实现 TOTP | Implementing TOTP with speakeasy

```bash
npm install speakeasy qrcode
```

### MFA 实现示例 | MFA Implementation Example

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 生成密钥
function generateSecret() {
  const secret = speakeasy.generateSecret({
    name: 'MyApp:user@example.com'
  });
  return secret;
}

// 生成 QR 码（用于添加到认证器应用）
async function generateQRCode(secret) {
  try {
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    return qrCodeUrl;
  } catch (error) {
    console.error('生成 QR 码时出错:', error);
    throw error;
  }
}

// 验证 TOTP 码
function verifyToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 1 // 允许的时间窗口（前一个和后一个令牌也有效）
  });
}

// 使用示例
async function setupMFA(req, res) {
  try {
    // 生成密钥
    const secret = generateSecret();
    
    // 生成 QR 码
    const qrCodeUrl = await generateQRCode(secret);
    
    // 存储密钥（在实际应用中，应存储在用户数据库中）
    // await saveSecretToUser(req.user.id, secret.base32);
    
    // 返回 QR 码给用户
    res.json({ 
      qrCodeUrl, 
      provisioningUri: secret.otpauth_url,
      message: '请使用认证器应用扫描此 QR 码'
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}

function verifyMFA(req, res) {
  try {
    const { token } = req.body;
    // 从数据库获取用户密钥
    // const userSecret = await getUserSecret(req.user.id);
    const userSecret = 'YOUR_USER_SECRET'; // 示例
    
    // 验证令牌
    const isValid = verifyToken({ base32: userSecret }, token);
    
    if (isValid) {
      res.json({ message: '验证成功', mfaEnabled: true });
      // 在实际应用中，应更新用户 MFA 状态
      // await updateUserMFAStatus(req.user.id, true);
    } else {
      res.status(401).json({ message: '无效的令牌' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}

// 登录流程（包含 MFA）
async function loginWithMFA(req, res) {
  try {
    const { username, password, totpCode } = req.body;
    
    // 验证用户名和密码
    const user = await findUserByUsername(username);
    if (!user || !(await validatePassword(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 检查用户是否启用了 MFA
    if (user.mfaEnabled) {
      // 如果启用了 MFA，验证 TOTP 码
      if (!totpCode) {
        return res.status(400).json({ message: '需要 TOTP 码', requiresMFA: true });
      }
      
      const isValid = verifyToken({ base32: user.mfaSecret }, totpCode);
      if (!isValid) {
        return res.status(401).json({ message: '无效的 TOTP 码' });
      }
    }
    
    // 验证成功，生成令牌或创建会话
    const token = generateToken(user);
    res.json({ message: '登录成功', token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}
```

## 安全最佳实践 | Security Best Practices

### 密码安全 | Password Security

1. **使用强哈希算法**：如 bcrypt、Argon2
2. **使用盐值**：防止彩虹表攻击
3. **要求强密码**：至少 8 位，包含大小写字母、数字和特殊字符
4. **限制登录尝试**：防止暴力破解
5. **使用密码重置流程**：而不是通过电子邮件发送新密码

### 会话安全 | Session Security

1. **使用安全的 cookie 属性**：`secure`、`httpOnly`、`sameSite`
2. **定期轮换会话 ID**：特别是在权限变更后
3. **设置会话超时**：限制非活动时间
4. **使用 CSRF 保护**：防止跨站请求伪造

### JWT 安全 | JWT Security

1. **使用强密钥**：密钥应足够长且随机
2. **设置适当的过期时间**：令牌不应长期有效
3. **使用 HTTPS**：防止令牌在传输过程中被截获
4. **存储令牌安全**：前端存储在 HttpOnly cookie 或安全存储中
5. **验证签名和声明**：始终验证令牌的有效性

### 防止常见攻击 | Preventing Common Attacks

1. **SQL 注入**：使用参数化查询
2. **XSS**：对用户输入进行验证和转义
3. **CSRF**：使用 CSRF 令牌
4. **点击劫持**：使用 `X-Frame-Options` 头部
5. **DOS 攻击**：实现速率限制

### 日志和监控 | Logging and Monitoring

1. **记录安全事件**：登录尝试、权限变更等
2. **监控异常活动**：异常登录位置、频繁失败尝试
3. **使用安全头**：`X-Content-Type-Options`、`X-XXS-Protection`、`Content-Security-Policy`
4. **定期安全审计**：审查代码和依赖项

## 实现一个完整的认证系统 | Implementing a Complete Authentication System

### 项目结构 | Project Structure

```
/auth-system/
  /config
    - passport.js       # Passport 配置
    - jwt.js           # JWT 工具
  /controllers
    - authController.js # 认证控制器
  /middlewares
    - auth.js          # 认证中间件
    - rbac.js          # 角色权限控制中间件
  /models
    - user.js          # 用户模型
  /routes
    - authRoutes.js    # 认证路由
    - protectedRoutes.js # 受保护路由
  - app.js             # 主应用文件
  - package.json       # 项目依赖
```

### 用户模型 | User Model

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} 不是有效的邮箱地址！`
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user'
  },
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// 密码哈希中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// 验证密码方法
userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

### 认证控制器 | Auth Controller

```javascript
const User = require('../models/user');
const { generateToken, verifyToken } = require('../config/jwt');
const crypto = require('crypto');

// 注册新用户
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已被使用' });
    }
    
    // 创建新用户
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // 生成令牌
    const token = generateToken({ id: user._id, role: user.role });
    
    res.status(201).json({ message: '注册成功', token });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码不正确' });
    }
    
    // 验证密码
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码不正确' });
    }
    
    // 更新最后登录时间
    user.lastLogin = Date.now();
    await user.save();
    
    // 生成令牌
    const token = generateToken({ id: user._id, role: user.role });
    
    res.json({ message: '登录成功', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -mfaSecret -verificationToken -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ user });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 忘记密码
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // 设置令牌和过期时间
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 分钟后过期
    
    await user.save();
    
    // 在实际应用中，这里应该发送电子邮件
    // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    // await sendResetPasswordEmail(user.email, resetUrl);
    
    res.json({ message: '重置密码链接已发送到您的邮箱', resetToken });
  } catch (error) {
    console.error('忘记密码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 重置密码
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // 哈希令牌
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // 查找用户
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: '无效或过期的令牌' });
    }
    
    // 更新密码
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.json({ message: '密码已重置' });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
```

### 认证中间件 | Auth Middleware

```javascript
const { verifyToken } = require('../config/jwt');

// JWT 认证中间件
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: '无效的令牌格式' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: '无效的令牌' });
  }
};

// 角色认证中间件
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: '权限不足' });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorizeRole };
```

### 路由配置 | Route Configuration

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth');

// 公开路由
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// 受保护路由
router.get('/me', authenticateJWT, authController.getCurrentUser);

// 管理路由
router.get('/admin/users', authenticateJWT, authorizeRole('admin', 'superAdmin'), (req, res) => {
  // 获取用户列表
  res.json({ message: '管理用户列表' });
});

module.exports = router;
```

### 主应用文件 | Main App File

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const app = express();

// 安全中间件
app.use(helmet()); // 设置安全相关的 HTTP 头
app.use(cors()); // 启用 CORS
app.use(express.json()); // 解析 JSON 请求体

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 每 IP 限制的请求数
});
app.use('/api', limiter);

// 路由
app.use('/api/auth', authRoutes);

// 连接数据库
mongoose.connect('mongodb://localhost:27017/auth-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('成功连接到数据库'))
.catch(err => console.error('连接数据库失败:', err));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

## 执行方式 | Execution Methods

在本章节中，所有认证和授权示例都可以通过以下方式执行：

1. 确保安装了 Node.js
2. 安装所需的依赖
   ```bash
   npm install express mongoose bcrypt jsonwebtoken passport passport-oauth2 speakeasy qrcode cors helmet express-rate-limit crypto
   ```
3. 创建示例文件
4. 运行示例
   ```bash
   node filename.js
   ```

请查看 `examples.js` 文件获取更多可执行的示例代码。