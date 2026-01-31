// StudentCourseList.jsx - 学生课程选择界面（带状态显示）
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentCourseList.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

function StudentCourseList({ username }) {
    const [coursesWithStatus, setCoursesWithStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCoursesWithStatus();
    }, []);

    const loadCoursesWithStatus = async () => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/api/student/courses-with-status?student_id=${username}`
            );
            setCoursesWithStatus(res.data);
            setLoading(false);
        } catch (error) {
            console.error('加载课程失败:', error);
            setLoading(false);
        }
    };

    const startOrContinueCourse = async (courseData) => {
        try {
            // 如果已有记录，继续；否则启动新的
            if (courseData.student_exp_id) {
                // 已有记录，直接进入 JupyterLab
                window.location.href = `http://localhost:8888/lab?token=training2024`;
            } else {
                // 首次启动
                const res = await axios.post(
                    `${API_BASE_URL}/api/student-experiments/start/${courseData.course.id}?student_id=${username}`
                );
                window.location.href = res.data.jupyter_url;
            }
        } catch (error) {
            console.error('启动失败:', error);
            alert('启动失败，请重试');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            '未开始': { text: '未开始', color: '#909399', icon: '' },
            '进行中': { text: '进行中', color: '#faad14', icon: '' },
            '已提交': { text: '已提交', color: '#52c41a', icon: '' },
            '已评分': { text: '已评分', color: '#1890ff', icon: '' }
        };
        return badges[status] || badges['未开始'];
    };

    if (loading) {
        return <div className="student-loading">加载中...</div>;
    }

    return (
        <div className="student-course-list">
            <header className="student-header">
                <h1>我的课程</h1>
                <div className="student-info">
                    <span>{username}</span>
                    <button onClick={() => window.location.reload()}>退出</button>
                </div>
            </header>

            <main className="student-main">
                {coursesWithStatus.length === 0 ? (
                    <div className="empty-state">
                        <p>暂无可用课程</p>
                    </div>
                ) : (
                    <div className="course-grid">
                        {coursesWithStatus.map(item => {
                            const badge = getStatusBadge(item.status);
                            const isIncomplete = item.status === '未开始' || item.status === '进行中';

                            return (
                                <div key={item.course.id} className={`course-card ${isIncomplete ? 'incomplete' : ''}`}>
                                    <div className="course-difficulty" style={{
                                        backgroundColor:
                                            item.course.difficulty === '初级' ? '#52c41a' :
                                                item.course.difficulty === '中级' ? '#faad14' : '#f5222d'
                                    }}>
                                        {item.course.difficulty}
                                    </div>

                                    {isIncomplete && (
                                        <div className="reminder-badge" title="待完成">
                                        </div>
                                    )}

                                    <h3>{item.course.title}</h3>
                                    <p>{item.course.description}</p>

                                    <div className="course-meta">
                                        <div className="course-tags">
                                            {item.course.tags.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="status-badge" style={{ backgroundColor: badge.color }}>
                                            {badge.text}
                                        </div>
                                    </div>

                                    {item.score !== null && (
                                        <div className="score-display">
                                            得分: {item.score}分
                                        </div>
                                    )}

                                    <button
                                        className="start-btn"
                                        onClick={() => startOrContinueCourse(item)}
                                    >
                                        {item.status === '未开始' ? '开始学习' : '进入 JupyterLab'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default StudentCourseList;
