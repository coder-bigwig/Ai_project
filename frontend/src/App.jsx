// App.jsx - 简化登录入口 + 角色路由
import React, { useState } from 'react';
import axios from 'axios';
import TeacherDashboard from './TeacherDashboard';
import StudentCourseList from './StudentCourseList';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            alert('请输入用户名');
            return;
        }

        if (password !== '123456') {
            alert('密码错误！默认密码：123456');
            return;
        }

        setIsLoading(true);

        try {
            // 检查用户角色
            const roleRes = await axios.get(`${API_BASE_URL}/api/check-role?username=${username}`);
            console.log('Role API response:', roleRes.data);
            setUserRole(roleRes.data.role);
            setIsLoggedIn(true);
            console.log('User role set to:', roleRes.data.role);
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 已登录：根据角色渲染不同界面
    if (isLoggedIn) {
        console.log('Rendering for role:', userRole);
        if (userRole === 'teacher') {
            console.log('Rendering TeacherDashboard');
            return <TeacherDashboard username={username} />;
        } else {
            console.log('Rendering StudentCourseList');
            return <StudentCourseList username={username} />;
        }
    }

    // 未登录：显示登录表单
    return (
        <div className="simple-login-container">
            <div className="simple-login-card">
                <div className="simple-login-header">
                    <h1>福州理工学院编程平台</h1>
                </div>

                <form onSubmit={handleLogin} className="simple-login-form">
                    <div className="simple-form-group">
                        <label>👤 账号</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入账号"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="simple-form-group">
                        <label>🔒 密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="simple-form-remember">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                            />
                            <span>记住密码</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="simple-login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? '登录中...' : '登录'}
                    </button>
                </form>

                <div className="simple-login-footer">
                    <p>手机上使用RDP扫描左侧二维码或自动在电脑中启动：</p>
                    <div className="simple-footer-links">
                        <a href="#">1. 支持上网IP账户自动在电脑启动时打印！</a>
                        <a href="#">2. 在登录时RDP密钥将也并列到电脑桌面启动类型!</a>
                        <a href="#">3. 遇到无法连接情况可关闭此网页后重启!</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
