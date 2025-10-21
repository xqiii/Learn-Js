// 认证和授权示例代码 | Authentication and Authorization Example Code

// 确保中文正常显示
process.env.LANG = 'zh_CN.UTF-8';

// 尝试导入依赖，如果失败则提供模拟实现
let bcrypt, jwt, express, session, passport, speakeasy, QRCode;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  console.log('注意: bcrypt 包未安装，将使用模拟实现');
  // 模拟 bcrypt 实现
  bcrypt = {
    hash: async (password, saltRounds) => `$2b$${saltRounds}$mocked${password}`,
    compare: async (password, hash) => hash.includes(password)
  };
}

try {
  jwt = require('jsonwebtoken');
} catch (e) {
  console.log('注意: jsonwebtoken 包未安装，将使用模拟实现');
  // 模拟 jwt 实现
  jwt = {
    sign: (payload, secret, options) => `mock.jwt.token.${JSON.stringify(payload)}`,
    verify: (token, secret) => {
      if (token.startsWith('mock.jwt.token.')) {
        return JSON.parse(token.replace('mock.jwt.token.', ''));
      }
      throw new Error('无效的令牌');
    }
  };
}

try {
  express = require('express');
  session = require('express-session');
  passport = require('passport');
} catch (e) {
  console.log('注意: express 相关包未安装，将在示例中使用模拟代码');
}

try {
  speakeasy = require('speakeasy');
  QRCode = require('qrcode');
} catch (e) {
  console.log('注意: speakeasy 和 qrcode 包未安装，将使用模拟实现');
  // 模拟 speakeasy 实现
  speakeasy = {
    generateSecret: (options) => ({ base32: 'MOCKBASE32SECRET', otpauth_url: 'otpauth://totp/...' }),
    totp: (options) => Math.floor(100000 + Math.random() * 900000).toString(),
    totp: {
      verify: (options) => options.token === '123456'
    }
  };
  // 模拟 QRCode 实现
  QRCode = {
    toDataURL: async () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  };
}

// ========== 1. 密码哈希示例 ==========
const bcrypt = require('bcrypt');

// 密码哈希函数
async function demonstratePasswordHashing() {
  console.log('=== 密码哈希示例 ===');
  
  const plainPassword = 'SecurePassword123!';
  const saltRounds = 10;
  
  try {
    // 哈希密码
    console.log(`原始密码: ${plainPassword}`);
    console.log('开始哈希处理...');
    
    const startTime = Date.now();
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    const endTime = Date.now();
    
    console.log(`哈希后的密码: ${hashedPassword}`);
    console.log(`哈希耗时: ${endTime - startTime}ms`);
    
    // 验证密码
    console.log('\n验证密码...');
    
    // 正确的密码
    const isCorrect = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`密码 "${plainPassword}" 验证结果: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
    
    // 错误的密码
    const wrongPassword = 'WrongPassword!';
    const isWrong = await bcrypt.compare(wrongPassword, hashedPassword);
    console.log(`密码 "${wrongPassword}" 验证结果: ${isWrong ? '✅ 正确' : '❌ 错误'}`);
    
    // 演示不同的盐值导致不同的哈希结果
    console.log('\n演示不同的盐值:');
    const hash1 = await bcrypt.hash(plainPassword, 10);
    const hash2 = await bcrypt.hash(plainPassword, 10);
    console.log(`哈希结果 1: ${hash1}`);
    console.log(`哈希结果 2: ${hash2}`);
    console.log(`两个哈希结果是否相同: ${hash1 === hash2 ? '✅ 是' : '❌ 否'}`);
    
  } catch (error) {
    console.error('密码处理过程中出错:', error.message);
  }
}

// ========== 2. JWT (JSON Web Token) 示例 ==========
const jwt = require('jsonwebtoken');

// JWT 示例
function demonstrateJWT() {
  console.log('\n=== JWT 示例 ===');
  
  // 密钥（在实际应用中应存储在环境变量中）
  const SECRET_KEY = 'your-very-secure-secret-key-change-this-in-production';
  
  // 示例用户数据
  const userData = {
    id: '123456',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    permissions: ['read', 'write']
  };
  
  console.log('原始用户数据:');
  console.log(userData);
  
  // 生成 JWT
  try {
    // 设置过期时间为 1 小时
    const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '1h' });
    console.log('\n生成的 JWT:');
    console.log(token);
    
    // 解析 JWT 结构
    const tokenParts = token.split('.');
    console.log('\nJWT 结构:');
    console.log(`Header (base64): ${tokenParts[0]}`);
    console.log(`Payload (base64): ${tokenParts[1]}`);
    console.log(`Signature: ${tokenParts[2]}`);
    
    // 解码并显示 header 和 payload (不使用验证)
    try {
      const decodedHeader = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString('utf8'));
      const decodedPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
      
      console.log('\n解码后的 Header:');
      console.log(decodedHeader);
      console.log('\n解码后的 Payload:');
      console.log(decodedPayload);
    } catch (decodeError) {
      console.error('解码 JWT 部分时出错:', decodeError.message);
    }
    
    // 验证 JWT
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('\n验证成功后的解码数据:');
    console.log(decoded);
    
    // 演示过期令牌
    console.log('\n演示过期令牌:');
    const shortToken = jwt.sign(userData, SECRET_KEY, { expiresIn: '1ms' });
    
    // 等待一小段时间确保令牌过期
    setTimeout(() => {
      try {
        jwt.verify(shortToken, SECRET_KEY);
        console.log('令牌仍然有效');
      } catch (expiredError) {
        console.log(`过期错误: ${expiredError.message}`);
      }
    }, 10);
    
    // 演示无效签名
    console.log('\n演示无效签名:');
    const tamperedToken = token + 'tampered';
    try {
      jwt.verify(tamperedToken, SECRET_KEY);
      console.log('验证成功（这不应该发生）');
    } catch (invalidError) {
      console.log(`无效错误: ${invalidError.message}`);
    }
    
  } catch (error) {
    console.error('JWT 操作过程中出错:', error.message);
  }
}

// ========== 3. 会话管理示例 ==========
const express = require('express');
const session = require('express-session');

function demonstrateSessionManagement() {
  console.log('\n=== 会话管理示例 ===');
  console.log('此示例需要在真实的 Express 服务器环境中运行');
  console.log('以下是会话管理的核心配置代码:');
  
  const sessionCode = `
const express = require('express');
const session = require('express-session');
const app = express();

// 配置会话中间件
app.use(session({
  secret: 'your-secret-key', // 用于签名会话 ID
  resave: false,             // 不强制保存未修改的会话
  saveUninitialized: false,  // 不保存未初始化的会话
  cookie: {
    secure: false,           // 在生产环境中应为 true（仅 HTTPS）
    httpOnly: true,          // 防止客户端 JavaScript 访问 cookie
    sameSite: 'strict',      // 防止 CSRF 攻击
    maxAge: 3600000          // 会话过期时间（1小时）
  }
}));

// 登录路由
app.post('/login', (req, res) => {
  // 验证用户凭据
  const { username, password } = req.body;
  
  // 这里简化了验证过程
  if (username && password) {
    // 在会话中存储用户信息
    req.session.user = {
      id: '123',
      username: username,
      role: 'user'
    };
    
    res.json({ success: true, message: '登录成功' });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码不正确' });
  }
});

// 会话验证中间件
function requireAuth(req, res, next) {
  if (req.session.user) {
    next(); // 用户已认证
  } else {
    res.status(401).json({ success: false, message: '请先登录' });
  }
}

// 受保护的路由
app.get('/profile', requireAuth, (req, res) => {
  res.json({ success: true, user: req.session.user });
});

// 登出路由
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: '登出失败' });
    } else {
      res.json({ success: true, message: '登出成功' });
    }
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});`;
  
  console.log(sessionCode);
}

// ========== 4. 基于角色的访问控制 (RBAC) 示例 ==========

// RBAC 示例
function demonstrateRBAC() {
  console.log('\n=== 基于角色的访问控制 (RBAC) 示例 ===');
  
  // 定义角色和权限
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
  
  // 示例用户
  const users = [
    {
      id: '1',
      name: '普通用户',
      role: ROLES.USER
    },
    {
      id: '2',
      name: '管理员',
      role: ROLES.ADMIN
    },
    {
      id: '3',
      name: '超级管理员',
      role: ROLES.SUPER_ADMIN
    }
  ];
  
  // 测试各种权限组合
  console.log('角色权限映射:');
  for (const role in ROLE_PERMISSIONS) {
    console.log(`\n${role} 可以执行的操作:`);
    ROLE_PERMISSIONS[role].forEach(permission => {
      console.log(`- ${permission}`);
    });
  }
  
  console.log('\n权限检查示例:');
  
  // 测试场景
  const testScenarios = [
    { userIndex: 0, permission: PERMISSIONS.EDIT_PROFILE, action: '编辑自己的资料' },
    { userIndex: 0, permission: PERMISSIONS.DELETE_USERS, action: '删除用户' },
    { userIndex: 1, permission: PERMISSIONS.READ_USERS, action: '查看用户列表' },
    { userIndex: 1, permission: PERMISSIONS.DELETE_USERS, action: '删除用户' },
    { userIndex: 2, permission: PERMISSIONS.DELETE_USERS, action: '删除用户' },
    { userIndex: 2, permission: PERMISSIONS.MANAGE_SETTINGS, action: '管理系统设置' }
  ];
  
  testScenarios.forEach(scenario => {
    const user = users[scenario.userIndex];
    const allowed = hasPermission(user, scenario.permission);
    console.log(`\n用户: ${user.name} (${user.role})`);
    console.log(`尝试执行: ${scenario.action}`);
    console.log(`权限检查结果: ${allowed ? '✅ 允许' : '❌ 拒绝'}`);
  });
  
  // Express 中间件示例
  console.log('\nExpress 中间件示例代码:');
  const middlewareCode = `
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
app.get('/profile', authenticate, (req, res) => {
  res.json({ message: '访问个人资料' });
});

app.get('/admin/users', 
  authenticate, 
  checkPermission(PERMISSIONS.READ_USERS), 
  (req, res) => {
    res.json({ message: '用户列表' });
  }
);

app.delete('/admin/users/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.DELETE_USERS), 
  (req, res) => {
    res.json({ message: '用户已删除' });
  }
);`;
  
  console.log(middlewareCode);
}

// ========== 5. 多因素认证 (MFA) 示例 ==========
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// MFA 示例
async function demonstrateMFA() {
  console.log('\n=== 多因素认证 (MFA) 示例 ===');
  
  try {
    // 生成密钥
    console.log('步骤 1: 生成密钥');
    const secret = speakeasy.generateSecret({
      name: 'MyApp:user@example.com'
    });
    
    console.log(`密钥 (base32): ${secret.base32}`);
    console.log(`OTP Auth URL: ${secret.otpauth_url}`);
    
    // 生成 QR 码（在实际应用中，用户会扫描此 QR 码）
    console.log('\n步骤 2: 生成 QR 码（在实际应用中，用户会扫描此码添加到认证器应用）');
    try {
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
      console.log(`QR 码数据 URL: ${qrCodeUrl.substring(0, 100)}...`);
    } catch (qrError) {
      console.log('生成 QR 码时出错:', qrError.message);
      console.log('在实际应用中，您需要显示此 QR 码给用户扫描');
    }
    
    // 模拟用户输入的 TOTP 码
    console.log('\n步骤 3: 验证 TOTP 码');
    
    // 生成当前时间的有效 TOTP 码
    const validToken = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
    console.log(`当前有效的 TOTP 码 (用于测试): ${validToken}`);
    
    // 验证有效码
    const isValid = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: validToken,
      window: 1 // 允许的时间窗口（前一个和后一个令牌也有效）
    });
    console.log(`验证有效码结果: ${isValid ? '✅ 验证成功' : '❌ 验证失败'}`);
    
    // 验证无效码
    const invalidToken = '123456';
    const isInvalid = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: invalidToken
    });
    console.log(`验证无效码 (${invalidToken}) 结果: ${isInvalid ? '✅ 验证成功' : '❌ 验证失败'}`);
    
    // 演示时间窗口
    console.log('\n步骤 4: 时间窗口演示');
    console.log('TOTP 码通常每 30 秒更改一次');
    console.log('window 参数允许一定的时间偏差，以防止由于时钟不同步导致的验证失败');
    console.log('在实际应用中，建议将 window 设置为 1 或 2');
    
  } catch (error) {
    console.error('MFA 演示过程中出错:', error.message);
  }
}

// ========== 6. OAuth 2.0 简化示例 ==========

// OAuth 2.0 简化示例
function demonstrateOAuth() {
  console.log('\n=== OAuth 2.0 简化示例 ===');
  console.log('OAuth 2.0 是一个授权框架，完整实现需要服务端环境');
  console.log('以下是使用 Passport.js 实现 GitHub OAuth 的核心代码:');
  
  const oauthCode = `
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
    clientID: 'your-client-id', // 从 GitHub 开发者设置获取
    clientSecret: 'your-client-secret', // 从 GitHub 开发者设置获取
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // 在这里，你通常会查找或创建用户
      console.log('获取到的访问令牌:', accessToken);
      // 可以使用 accessToken 获取用户信息
      // const userInfo = await fetchGitHubUserInfo(accessToken);
      
      // 返回用户信息
      return cb(null, { id: 'user123', username: 'example' });
    } catch (error) {
      return cb(error);
    }
  }
));

// 序列化和反序列化用户
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  // 从数据库查找用户
  cb(null, { id, username: 'example' });
});

// 路由
app.get('/auth/github', passport.authenticate('oauth2'));

app.get('/auth/github/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res) => {
    // 成功认证后重定向
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, message: '成功使用 OAuth 登录' });
  } else {
    res.redirect('/auth/github');
  }
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('登出失败');
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});`;
  
  console.log(oauthCode);
  
  console.log('\nOAuth 2.0 授权码流程步骤:');
  console.log('1. 用户点击 "使用 GitHub 登录"');
  console.log('2. 用户被重定向到 GitHub 的授权页面');
  console.log('3. 用户登录 GitHub 并授权应用');
  console.log('4. GitHub 将用户重定向回应用，附带授权码');
  console.log('5. 应用使用授权码向 GitHub 请求访问令牌');
  console.log('6. GitHub 返回访问令牌');
  console.log('7. 应用使用访问令牌获取用户信息');
  console.log('8. 应用创建会话，用户登录成功');
}

// ========== 7. 安全最佳实践示例 ==========

// 安全最佳实践示例
function demonstrateSecurityBestPractices() {
  console.log('\n=== 安全最佳实践示例 ===');
  
  console.log('\n1. 安全的密码策略:');
  const passwordPolicy = `
// 密码强度验证函数
function validatePasswordStrength(password) {
  // 至少 8 位
  if (password.length < 8) return { isValid: false, message: '密码至少需要 8 位' };
  
  // 包含至少一个大写字母
  if (!/[A-Z]/.test(password)) return { isValid: false, message: '密码需要包含至少一个大写字母' };
  
  // 包含至少一个小写字母
  if (!/[a-z]/.test(password)) return { isValid: false, message: '密码需要包含至少一个小写字母' };
  
  // 包含至少一个数字
  if (!/[0-9]/.test(password)) return { isValid: false, message: '密码需要包含至少一个数字' };
  
  // 包含至少一个特殊字符
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, message: '密码需要包含至少一个特殊字符' };
  
  return { isValid: true, message: '密码强度符合要求' };
}

// 测试密码
const testPasswords = [
  'password',
  'Password123',
  'P@ssw0rd!'
];

testPasswords.forEach(pwd => {
  const result = validatePasswordStrength(pwd);
  console.log(${pwd}: ${result.isValid ? '有效' : '无效'} - ${result.message});

});`;
  console.log(passwordPolicy);
  
  console.log('\n2. 防止暴力破解的登录限制:');
  const loginLimiter = `
// 使用 express-rate-limit 限制登录尝试
const rateLimit = require('express-rate-limit');

// 创建登录限制器
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 每 IP 限制 5 次尝试
  message: '登录尝试次数过多，请 15 分钟后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// 应用于登录路由
app.post('/login', loginLimiter, (req, res) => {
  // 登录逻辑
});`;
  console.log(loginLimiter);
  
  console.log('\n3. 安全的 HTTP 头:');
  const securityHeaders = `
// 使用 helmet 设置安全 HTTP 头
const helmet = require('helmet');

// 应用 helmet
app.use(helmet());

// 或者单独配置每个头
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'trusted-cdn.com'],
    styleSrc: ["'self'", 'trusted-cdn.com'],
    imgSrc: ["'self'", 'data:'],
  },
}));

app.use(helmet.xssFilter()); // X-XSS-Protection: 1; mode=block
app.use(helmet.noSniff()); // X-Content-Type-Options: nosniff
app.use(helmet.frameguard({ action: 'deny' })); // X-Frame-Options: DENY`;
  console.log(securityHeaders);
  
  console.log('\n4. 安全的错误处理:');
  const errorHandling = `
// 错误处理中间件
app.use((err, req, res, next) => {
  // 记录详细错误日志（仅服务器端可见）
  console.error('错误详情:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    // 不记录敏感信息
  });
  
  // 对客户端返回通用错误信息
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: '请求数据无效' });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: '认证失败' });
  }
  
  // 生产环境不返回详细错误
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ message: '服务器内部错误' });
  }
  
  // 开发环境可以返回详细错误
  res.status(500).json({
    message: err.message,
    error: err
  });
});`;
  console.log(errorHandling);
}

// ========== 8. 完整的认证中间件示例 ==========

// 完整的认证中间件示例
function demonstrateAuthMiddleware() {
  console.log('\n=== 完整的认证中间件示例 ===');
  
  const authMiddlewareCode = `
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// JWT 认证中间件
const authenticateJWT = async (req, res, next) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供有效的认证令牌' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // 查找用户并附加到请求对象
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    
    // 检查用户是否被禁用
    if (!user.isActive) {
      return res.status(403).json({ message: '账户已被禁用' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌已过期' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '无效的令牌' });
    }
    return res.status(500).json({ message: '服务器错误' });
  }
};

// 刷新令牌中间件
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: '需要刷新令牌' });
    }
    
    // 验证刷新令牌
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: '无效的刷新令牌' });
    }
    
    // 生成新的访问令牌
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: '刷新令牌失败' });
  }
};

module.exports = { authenticateJWT, refreshToken };`;
  
  console.log(authMiddlewareCode);
}

// ========== 主函数 - 运行所有示例 ==========
const runAllExamples = async () => {
  console.log('===== 认证与授权示例 =====\n');
  
  try {
    // 运行密码哈希示例
    await demonstratePasswordHashing();
    console.log('\n');
    
    // 运行 JWT 示例
    demonstrateJWT();
    console.log('\n');
    
    // 运行会话管理示例
    demonstrateSessionManagement();
    console.log('\n');
    
    // 运行 RBAC 示例
    demonstrateRBAC();
    console.log('\n');
    
    // 运行 MFA 示例
    try {
      await demonstrateMFA();
    } catch (mfaError) {
      console.error('MFA 示例运行失败（可能缺少依赖）:', mfaError.message);
    }
    console.log('\n');
    
    // 运行 OAuth 示例
    if (passport) {
      demonstrateOAuth();
    } else {
      console.log('跳过 OAuth 示例：passport 未安装');
    }
    console.log('\n');
    
    // 运行安全最佳实践示例
    demonstrateSecurityBestPractices();
    console.log('\n');
    
    // 运行认证中间件示例
    demonstrateAuthMiddleware();
    console.log('\n');
    
    console.log('===== 所有示例运行完成 =====');
    console.log('\n注意事项:');
    console.log('1. 这些示例仅用于演示目的');
    console.log('2. 在生产环境中，请使用环境变量存储密钥和敏感信息');
    console.log('3. 请确保实现适当的错误处理和日志记录');
    console.log('4. 定期更新依赖包以修复安全漏洞');
  } catch (error) {
    console.error('运行示例时出错:', error.message);
  }
};

// ========== 如何运行此示例 ==========
/*
  要运行此示例，请按照以下步骤操作：
  
  1. 安装必要的依赖
     npm install bcrypt jsonwebtoken express express-session passport speakeasy qrcode
  
  2. 运行示例
     node examples.js
  
  注意：某些示例可能需要在实际的服务器环境中运行才能完全展示功能。
*/

// 运行所有示例
// 取消下面的注释以运行所有示例
// runAllExamples();

// 如果要单独运行某个示例，可以取消相应函数的注释
// 例如：
// demonstratePasswordHashing();
// demonstrateJWT();

module.exports = {
  demonstratePasswordHashing,
  demonstrateJWT,
  demonstrateSessionManagement,
  demonstrateRBAC,
  demonstrateMFA,
  demonstrateOAuth,
  demonstrateSecurityBestPractices,
  demonstrateAuthMiddleware,
  runAllExamples
};