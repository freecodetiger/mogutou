const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// 中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// JWT密钥
const JWT_SECRET = 'mogutou-secret-key';

// 模拟用户数据
const users = [
  {
    userId: 'admin-user-id',
    name: 'admin',
    tel: '11223344556',
    password: '11223344556', // 明文密码
    position: '管理员',
    roles: ['admin']
  }
];

// 模拟商品数据
const commodities = [
  {
    ID: 'C001',
    Name: '男士衬衫',
    Colour: '白色',
    Size: 'XL',
    Brand: '优衣库',
    Price: 199.00,
    PurchasePrice: 99.00,
    Number: 100,
    PresaleNumber: 20,
    SalesVolume: 50
  },
  {
    ID: 'C002',
    Name: '女士连衣裙',
    Colour: '红色',
    Size: 'M',
    Brand: 'ZARA',
    Price: 299.00,
    PurchasePrice: 150.00,
    Number: 80,
    PresaleNumber: 30,
    SalesVolume: 40
  },
  {
    ID: 'C003',
    Name: '男士休闲裤',
    Colour: '黑色',
    Size: 'L',
    Brand: 'H&M',
    Price: 249.00,
    PurchasePrice: 120.00,
    Number: 60,
    PresaleNumber: 15,
    SalesVolume: 30
  }
];

// 模拟客户订单数据
const custormerOrders = [
  {
    ID: 'CO001',
    Name: '张三',
    Tel: '13800138000',
    DeliveryAddress: '北京市海淀区中关村',
    DeliveryTime: '2023-05-01',
    Amount: 598.00,
    Deposit: 100.00,
    State: '未完成',
    Operator: 'admin',
    CreatedAt: '2023-04-20 10:00:00',
    Goods: [
      {
        ID: 'C001',
        Name: '男士衬衫',
        Colour: '白色',
        Size: 'XL',
        Brand: '优衣库',
        Number: 2
      },
      {
        ID: 'C002',
        Name: '女士连衣裙',
        Colour: '红色',
        Size: 'M',
        Brand: 'ZARA',
        Number: 1
      }
    ]
  },
  {
    ID: 'CO002',
    Name: '李四',
    Tel: '13900139000',
    DeliveryAddress: '北京市朝阳区建国门',
    DeliveryTime: '2023-05-05',
    Amount: 249.00,
    Deposit: 50.00,
    State: '已完成',
    Operator: 'admin',
    CreatedAt: '2023-04-15 14:30:00',
    Goods: [
      {
        ID: 'C003',
        Name: '男士休闲裤',
        Colour: '黑色',
        Size: 'L',
        Brand: 'H&M',
        Number: 1
      }
    ]
  }
];

// 模拟采购订单数据
const purchaseOrders = [
  {
    ID: 'PO001',
    Supplier: '优衣库供应商',
    Amount: 990.00,
    Freight: 50.00,
    Remarks: '春季新款',
    State: '未完成',
    Operator: 'admin',
    CreatedAt: '2023-04-10 09:00:00',
    Goods: [
      {
        ID: 'C001',
        Name: '男士衬衫',
        Colour: '白色',
        Size: 'XL',
        Brand: '优衣库',
        Number: 10
      }
    ]
  },
  {
    ID: 'PO002',
    Supplier: 'ZARA供应商',
    Amount: 1500.00,
    Freight: 80.00,
    Remarks: '夏季新款',
    State: '已完成',
    Operator: 'admin',
    CreatedAt: '2023-04-05 11:30:00',
    Goods: [
      {
        ID: 'C002',
        Name: '女士连衣裙',
        Colour: '红色',
        Size: 'M',
        Brand: 'ZARA',
        Number: 10
      }
    ]
  }
];

// 登录接口
app.post('/api/v1/login', (req, res) => {
  const { tel, password } = req.body;

  const user = users.find(u => u.tel === tel);
  if (!user) {
    return res.status(401).json({ error: '账号不存在' });
  }

  // 不验证密码，直接通过
  // if (user.password !== password) {
  //   return res.status(401).json({ error: '密码错误' });
  // }

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

// 库存查询接口
app.get('/api/v1/commodities', authenticateToken, (req, res) => {
  console.log('访问库存查询接口');
  res.json(commodities);
});

// 客户订单查询接口
app.get('/api/v1/orders/custormer', authenticateToken, (req, res) => {
  console.log('访问客户订单查询接口');
  res.json(custormerOrders);
});

// 采购订单查询接口
app.get('/api/v1/orders/purchase', authenticateToken, (req, res) => {
  console.log('访问采购订单查询接口');
  res.json(purchaseOrders);
});

// 员工查询接口
app.get('/api/v1/users', authenticateToken, (req, res) => {
  console.log('访问员工查询接口');
  // 返回所有用户信息，但不包含密码
  const staffList = users.map(user => ({
    UserID: user.userId,
    Name: user.name,
    Tel: user.tel,
    Position: user.position
  }));
  res.json(staffList);
});

// 注册接口
app.post('/api/v1/register', (req, res) => {
  console.log('访问注册接口 /api/v1/register');
  const { name, tel, password, position } = req.body;

  console.log('注册请求:', { name, tel, password, position });

  // 检查账号是否已存在
  if (users.find(u => u.tel === tel)) {
    return res.status(400).json({ error: '账号已存在' });
  }

  // 创建新用户
  const newUser = {
    userId: 'user-' + Date.now(),
    name,
    tel,
    password,
    position,
    roles: ['user']
  };

  users.push(newUser);

  // 生成JWT令牌
  const token = jwt.sign({
    userName: newUser.name,
    userId: newUser.userId,
    perAddr: req.ip,
    roles: newUser.roles
  }, JWT_SECRET, { expiresIn: '3d' });

  console.log('注册成功:', newUser);
  res.json({ token });
});

// 注册接口
app.post('/register', (req, res) => {
  console.log('访问注册接口 /register');
  const { name, tel, password, position } = req.body;

  console.log('注册请求:', { name, tel, password, position });

  // 检查账号是否已存在
  if (users.find(u => u.tel === tel)) {
    return res.status(400).json({ error: '账号已存在' });
  }

  // 创建新用户
  const newUser = {
    userId: 'user-' + Date.now(),
    name,
    tel,
    password,
    position,
    roles: ['user']
  };

  users.push(newUser);

  // 生成JWT令牌
  const token = jwt.sign({
    userName: newUser.name,
    userId: newUser.userId,
    perAddr: req.ip,
    roles: newUser.roles
  }, JWT_SECRET, { expiresIn: '3d' });

  console.log('注册成功:', newUser);
  res.json({ token });
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
  console.log('可用的接口：');
  console.log('- POST /api/v1/login');
  console.log('- GET /api/v1/user');
  console.log('- GET /api/v1/logout');
  console.log('- GET /api/v1/commodities');
  console.log('- GET /api/v1/orders/custormer');
  console.log('- GET /api/v1/orders/purchase');
  console.log('- GET /api/v1/users');
  console.log('- POST /api/v1/register');
  console.log('- POST /register');
});
