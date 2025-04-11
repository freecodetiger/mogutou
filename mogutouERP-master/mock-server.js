const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const app = express();
const port = 1988;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// JWT密钥
const JWT_SECRET = 'mogutou-secret-key';

// 模拟用户数据
const users = [
  {
    userId: 'admin-user-id',
    name: 'admin',
    tel: '11223344556',
    password: 'e10adc3949ba59abbe56e057f20f883e', // MD5('11223344556')
    position: '管理员',
    roles: ['admin']
  }
];

// 登录接口
app.post('/api/v1/login', (req, res) => {
  const { tel, password } = req.body;

  console.log('登录请求:', { tel, password });
  console.log('期望密码:', users[0].password);

  const user = users.find(u => u.tel === tel);
  if (!user) {
    console.log('账号不存在');
    return res.status(401).json({ error: '账号不存在' });
  }

  console.log('用户密码:', user.password);
  console.log('提交密码:', password);
  console.log('加密后密码:', md5(password));

  // 对提交的密码进行MD5加密
  if (user.password !== md5(password)) {
    console.log('密码错误');
    return res.status(401).json({ error: '密码错误' });
  }

  // 生成JWT令牌
  const token = jwt.sign({
    userName: user.name,
    userId: user.userId,
    perAddr: req.ip,
    roles: user.roles
  }, JWT_SECRET, { expiresIn: '3d' });

  res.json({ token });
});

// 获取用户信息接口
app.get('/api/v1/user', authenticateToken, (req, res) => {
  const user = users.find(u => u.userId === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json({
    name: user.name,
    roles: user.roles
  });
});

// 登出接口
app.get('/api/v1/logout', (req, res) => {
  res.json({});
});

// 验证JWT令牌的中间件
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: '非法访问' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: '非法访问' });
    }

    req.user = user;
    next();
  });
}

// 启动服务器
app.listen(port, () => {
  console.log(`模拟服务器运行在 http://localhost:${port}`);
});
