# JupyterHub 实训平台

基于 JupyterHub 的互动式编程实训平台，集成 AI 编程助手、自动化实验管理和实时监控。

## ✨ 功能特性

- **多用户环境**: 基于 Docker 容器隔离的独立实验环境
- **AI 辅助教学**: 集成 CodeLlama/GPT 为学生提供代码审查、解释和调试建议
- **实验管理**: 教师创建、发布实验，学生在线完成并提交
- **自动化流程**: 自动评分、进度追踪
- **全面监控**: 基于 Prometheus + Grafana 的系统资源和用户活动监控

## 🚀 快速开始

### 前置要求

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/Mac/Linux)
- 建议配置: 4核 CPU, 8GB 内存以上

### 启动平台

1. 克隆或下载本项目
2. 双击运行 `start.bat` (Windows) 或执行 `docker-compose up -d`
3. 等待服务启动（首次启动需要下载镜像，可能需要较长时间）

### 访问地址

| 服务 | 地址 | 默认账号 |
|------|------|----------|
| **统一门户** | http://localhost:8080 | 任意用户名 (开发模式) |
| **JupyterHub** | http://localhost:8003 | - |
| **API 文档** | http://localhost:8001/docs | - |
| **Grafana 监控** | http://localhost:3001 | admin / admin |

## 📂 项目结构

```
.
├── ai-service/          # AI 助手微服务
├── backend/             # 实验管理后端 (FastAPI)
├── frontend/            # 前端门户 (React)
├── jupyterhub/          # JupyterHub 配置
├── monitoring/          # 监控配置 (Prometheus/Grafana)
├── nginx/               # 反向代理配置
├── docker-compose.yml   # 容器编排
└── start.bat            # 启动脚本
```

## 🛠️ 技术栈

- **核心**: JupyterHub, Docker, Python
- **前端**: React, Vite, TailwindCSS (样式)
- **后端**: FastAPI, PostgreSQL, Redis
- **AI**: Ollama, LangChain
- **监控**: Prometheus, Grafana

## 👨‍🏫 教师指南

1. 使用教师账号登录（用户名以 `teacher` 开头，如 `teacher1`）
2. 在"实验管理"页面发布新实验
3. 在"提交审阅"页面查看和评分学生作业

## 👨‍🎓 学生指南

1. 使用学生账号登录（任意非 `teacher` 开头的用户名）
2. 在"可用实验"中选择实验并点击"开始"
3. 系统会自动启动 JupyterLab 环境
4. 完成后点击"提交"按钮

## 🔧 常见问题

**Q: 启动时 Ollama 下载模型很慢？**
A: 取决于网络环境。您可以手动下载模型或配置代理。

**Q: 容器无法启动？**
A: 检查 Docker 资源设置，确保分配了足够的内存（建议 4GB+）。

**Q: 端口冲突？**
A: 确保 80, 8000, 8001, 8002, 3001, 9090 端口未被占用。
