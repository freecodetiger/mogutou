const http = require('http');
const httpProxy = require('http-proxy');

// 创建代理服务器
const proxy = httpProxy.createProxyServer({
  target: 'http://host.docker.internal:1988',
  changeOrigin: true
});

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  console.log(`Proxying request to: ${req.url}`);
  proxy.web(req, res);
});

// 监听错误
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error');
});

// 启动服务器
const PORT = 1988;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
