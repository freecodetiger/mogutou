# 贡献指南

感谢您对MogutouERP项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 报告问题
- 提交功能请求
- 提交代码修复
- 提交新功能
- 改进文档

## 开发流程

1. Fork项目仓库
2. 克隆您的Fork到本地
   ```bash
   git clone https://github.com/YourUsername/mogutouERP.git
   cd mogutouERP
   ```
3. 创建一个新的分支
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. 进行更改并提交
   ```bash
   git add .
   git commit -m "Add your feature or fix"
   ```
5. 推送到您的Fork
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建Pull Request

## 代码规范

### Go代码规范

- 遵循[Go官方代码规范](https://golang.org/doc/effective_go.html)
- 使用`gofmt`格式化代码
- 添加适当的注释
- 编写单元测试

### Vue代码规范

- 遵循[Vue官方风格指南](https://cn.vuejs.org/v2/style-guide/)
- 使用ESLint检查代码质量
- 组件名使用多个单词，避免与HTML元素冲突
- 组件属性使用驼峰命名法

## 提交信息规范

提交信息应该清晰描述更改内容，建议使用以下格式：

```
<类型>: <描述>

[可选的详细描述]

[可选的关闭问题引用]
```

类型可以是：
- feat: 新功能
- fix: 修复bug
- docs: 文档更改
- style: 不影响代码含义的更改（空格、格式化等）
- refactor: 既不修复bug也不添加功能的代码更改
- perf: 提高性能的代码更改
- test: 添加或修正测试
- chore: 对构建过程或辅助工具的更改

例如：
```
feat: 添加用户注册功能

实现了用户注册表单和后端API

Closes #123
```

## 代码审查

所有提交都需要通过代码审查才能合并到主分支。代码审查的目的是：

- 确保代码质量
- 发现潜在问题
- 共享知识
- 保持代码风格一致

## 测试

提交前请确保：

1. 所有现有测试通过
2. 为新功能添加测试
3. 为修复的bug添加测试

## 文档

如果您的更改影响了用户体验或API，请同时更新相关文档。

## 问题和讨论

如有任何问题或需要讨论，请使用GitHub Issues功能。
