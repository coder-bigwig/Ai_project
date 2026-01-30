// App.jsx - 主应用入口

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import StudentPortal from './StudentPortal';
import TeacherPortal from './TeacherPortal';
import './App.css';

function App() {
    const [userRole, setUserRole] = useState('student'); // 'student' or 'teacher'
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 简单登录处理
    const handleLogin = (role, name) => {
        setUserRole(role);
        setUsername(name);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <Router>
            <div className="app-container">
                <nav className="main-nav">
                    <div className="nav-content">
                        <div className="nav-brand">
                            <span className="nav-brand-icon">🎓</span>
                            <span>实训平台</span>
                        </div>

                        <div className="nav-links">
                            {userRole === 'student' ? (
                                <>
                                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        实验中心
                                    </NavLink>
                                    <NavLink to="/my-experiments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        我的实验
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        实验管理
                                    </NavLink>
                                    <NavLink to="/submissions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        提交审阅
                                    </NavLink>
                                    <NavLink to="/statistics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                        数据统计
                                    </NavLink>
                                </>
                            )}
                        </div>

                        <div className="nav-user">
                            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
                            <span>{username}</span>
                            <button className="logout-btn" onClick={handleLogout}>退出</button>
                        </div>
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        {userRole === 'student' ? (
                            <>
                                <Route path="/" element={<StudentPortal username={username} />} />
                                <Route path="/my-experiments" element={<StudentPortal username={username} tab="my-experiments" />} />
                            </>
                        ) : (
                            <>
                                <Route path="/" element={<TeacherPortal username={username} />} />
                                <Route path="/submissions" element={<TeacherPortal username={username} tab="submissions" />} />
                                <Route path="/statistics" element={<TeacherPortal username={username} tab="statistics" />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

// 登录页面组件
function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            alert('请输入用户名');
            return;
        }

        setIsLoading(true);

        // 模拟登录延迟
        await new Promise(resolve => setTimeout(resolve, 800));

        // 验证密码
        if (password !== '123456') {
            alert('密码错误！默认密码：123456');
            setIsLoading(false);
            return;
        }

        onLogin(role, username);
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">🎓</div>
                        <h1>AI 实验平台</h1>
                        <p className="subtitle">智能化实训教学系统</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>用户名</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="请输入用户名"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>密码</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="请输入密码"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="role-label">选择身份</label>
                            <div className="role-cards">
                                <div
                                    className={`role-card ${role === 'student' ? 'active student' : 'student'}`}
                                    onClick={() => setRole('student')}
                                >
                                    <div className="role-card-icon">👨‍🎓</div>
                                    <div className="role-card-content">
                                        <h4>学生登录</h4>
                                        <p>完成实验，获取反馈</p>
                                    </div>
                                    <div className="role-check">✓</div>
                                </div>
                                <div
                                    className={`role-card ${role === 'teacher' ? 'active teacher' : 'teacher'}`}
                                    onClick={() => setRole('teacher')}
                                >
                                    <div className="role-card-icon">👨‍🏫</div>
                                    <div className="role-card-content">
                                        <h4>教师登录</h4>
                                        <p>发布实验，评分管理</p>
                                    </div>
                                    <div className="role-check">✓</div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`login-btn ${isLoading ? 'loading' : ''} ${role}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    <span className="btn-text">登录中...</span>
                                </>
                            ) : (
                                <>
                                    <span className="btn-text">立即登录</span>
                                    <span className="btn-arrow">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="demo-hint">💡 演示账号：任意用户名，密码留空即可</p>
                    </div>
                </div>

                <div className="login-features">
                    <div className="feature-item">
                        <span className="feature-icon">💻</span>
                        <h3>在线编程环境</h3>
                        <p>基于 JupyterLab 的专业开发平台</p>
                        <div className="feature-badge">云端部署</div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🤖</span>
                        <h3>AI 智能助手</h3>
                        <p>实时代码分析与智能辅导系统</p>
                        <div className="feature-badge">AI驱动</div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <h3>智能评分系统</h3>
                        <p>自动化实验管理与成绩追踪</p>
                        <div className="feature-badge">全自动</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
