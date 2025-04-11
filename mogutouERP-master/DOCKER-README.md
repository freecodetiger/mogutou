# 使用Docker运行蘑菇头进存销管理系统

本文档说明如何使用Docker Compose来运行蘑菇头进存销管理系统。

## 前提条件

- 安装Docker和Docker Compose
- 确保端口1988和3306未被占用

## 运行步骤

1. 确保当前目录包含以下文件和目录：
   - `docker-compose.yml`
   - `docker-conf/conf.json`
   - `docker-conf/jwt.json`

2. 启动服务：

```bash
docker-compose up -d
```

3. 等待服务启动完成（可能需要几分钟）：

```bash
docker-compose logs -f
```

4. 在浏览器中访问系统：

```
http://localhost:1988/ui/
```

5. 使用默认账号和密码登录：
   - 账号：11223344556
   - 密码：11223344556

## 停止服务

```bash
docker-compose down
```

## 数据持久化

MySQL数据存储在`./mysql-data`目录中，确保不要意外删除此目录，否则会丢失所有数据。

## 故障排除

如果遇到"密码错误"的问题，可能是因为：

1. 数据库连接问题：检查`docker-conf/conf.json`中的数据库配置
2. 密码验证逻辑问题：可能需要修改后端代码中的密码验证逻辑

如果需要重置数据库：

```bash
docker-compose down
rm -rf mysql-data
docker-compose up -d
```
