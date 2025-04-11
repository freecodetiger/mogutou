const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// 配置代理
const apiProxy = createProxyMiddleware({
  target: 'http://host.docker.internal:1988',
  changeOrigin: true,
  logLevel: 'debug'
});

// 使用代理中间件
app.use('/', apiProxy);

// 启动服务器
const PORT = 1988;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
