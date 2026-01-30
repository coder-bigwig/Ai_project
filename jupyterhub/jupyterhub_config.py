import os

# Base Config
c.JupyterHub.bind_url = 'http://0.0.0.0:8000'
c.JupyterHub.db_url = os.environ.get('HUB_DB_URL', 'postgresql://jupyterhub:changeme@postgres/jupyterhub')

# Auth - DummyAuthenticator (任意用户名可登录)
from jupyterhub.auth import DummyAuthenticator
c.JupyterHub.authenticator_class = DummyAuthenticator
c.Authenticator.admin_users = {'admin', 'teacher1'}
c.JupyterHub.admin_access = True

# 使用 SimpleSpawner 但配置服务代理到共享 JupyterLab
# 所有用户登录后都访问同一个 JupyterLab 实例
from jupyterhub.spawner import SimpleLocalProcessSpawner

class SharedLabSpawner(SimpleLocalProcessSpawner):
    """自定义 Spawner，所有用户重定向到共享 JupyterLab"""
    
    async def start(self):
        """不实际启动进程，返回共享 Lab 的 URL"""
        # 返回共享 JupyterLab 的地址
        return ('jupyterlab-shared', 8888)
    
    async def poll(self):
        """总是返回 None 表示服务器正在运行"""
        return None
    
    async def stop(self):
        """不需要停止任何东西"""
        return

c.JupyterHub.spawner_class = SharedLabSpawner

# 配置代理到共享 JupyterLab
c.JupyterHub.default_url = '/user/shared'

# 将共享 Lab 注册为服务
c.JupyterHub.services = [
    {
        'name': 'shared',
        'url': 'http://jupyterlab-shared:8888',
        'admin': True,
    }
]

# 日志
c.JupyterHub.log_level = 'INFO'
c.Spawner.debug = False
