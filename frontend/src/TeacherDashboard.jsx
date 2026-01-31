// TeacherDashboard.jsx - 教师管理后台
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

function TeacherDashboard({ username }) {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [studentProgress, setStudentProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        loadCourses();
        loadStudentProgress();
    }, []);

    const loadCourses = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/teacher/courses?teacher_username=${username}`);
            setCourses(res.data);
            setLoading(false);
        } catch (error) {
            console.error('加载课程失败:', error);
            setLoading(false);
        }
    };

    const loadStudentProgress = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/teacher/progress?teacher_username=${username}`);
            setStudentProgress(res.data);
        } catch (error) {
            console.error('加载进度失败:', error);
        }
    };

    const togglePublish = async (courseId, currentStatus) => {
        try {
            await axios.patch(
                `${API_BASE_URL}/api/teacher/courses/${courseId}/publish?teacher_username=${username}&published=${!currentStatus}`
            );
            loadCourses();
            alert(currentStatus ? '已取消发布' : '已发布');
        } catch (error) {
            console.error('操作失败:', error);
            alert('操作失败');
        }
    };

    const deleteCourse = async (courseId) => {
        if (!window.confirm('确定删除该课程吗？')) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/experiments/${courseId}`);
            loadCourses();
            alert('删除成功');
        } catch (error) {
            console.error('删除失败:', error);
            alert('删除失败');
        }
    };

    const createCourse = async (formData) => {
        try {
            const courseData = {
                ...formData,
                created_by: username
            };
            await axios.post(`${API_BASE_URL}/api/experiments`, courseData);
            setShowCreateForm(false);
            loadCourses();
            alert('创建成功');
        } catch (error) {
            console.error('创建失败:', error);
            alert('创建失败');
        }
    };

    return (
        <div className="teacher-dashboard">
            <header className="teacher-header">
                <h1>教师管理后台</h1>
                <div className="teacher-info">
                    <span>{username}</span>
                    <button onClick={() => window.location.reload()}>退出</button>
                </div>
            </header>

            <nav className="teacher-nav">
                <button
                    className={activeTab === 'courses' ? 'active' : ''}
                    onClick={() => setActiveTab('courses')}
                >
                    课程管理
                </button>
                <button
                    className={activeTab === 'progress' ? 'active' : ''}
                    onClick={() => setActiveTab('progress')}
                >
                    学生进度
                </button>
            </nav>

            <main className="teacher-main">
                {activeTab === 'courses' && (
                    <CourseManagement
                        courses={courses}
                        loading={loading}
                        onTogglePublish={togglePublish}
                        onDelete={deleteCourse}
                        onShowCreate={() => setShowCreateForm(true)}
                    />
                )}

                {activeTab === 'progress' && (
                    <StudentProgress progress={studentProgress} />
                )}
            </main>

            {showCreateForm && (
                <CreateCourseModal
                    onClose={() => setShowCreateForm(false)}
                    onCreate={createCourse}
                />
            )}
        </div>
    );
}

function CourseManagement({ courses, loading, onTogglePublish, onDelete, onShowCreate }) {
    if (loading) return <div className="loading">加载中...</div>;

    return (
        <div className="course-management">
            <div className="course-header">
                <h2>我的课程</h2>
                <button className="create-btn" onClick={onShowCreate}>+ 创建课程</button>
            </div>

            <div className="course-list">
                {courses.length === 0 ? (
                    <div className="empty">暂无课程</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>课程名称</th>
                                <th>难度</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.title}</td>
                                    <td>{course.difficulty}</td>
                                    <td>
                                        <span className={`status ${course.published ? 'published' : 'draft'}`}>
                                            {course.published ? '已发布' : '草稿'}
                                        </span>
                                    </td>
                                    <td>{new Date(course.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => onTogglePublish(course.id, course.published)}>
                                            {course.published ? '取消发布' : '发布'}
                                        </button>
                                        <button className="danger" onClick={() => onDelete(course.id)}>
                                            删除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function StudentProgress({ progress }) {
    return (
        <div className="student-progress">
            <h2>学生完成情况</h2>
            {progress.length === 0 ? (
                <div className="empty">暂无数据</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>学生账号</th>
                            <th>课程ID</th>
                            <th>状态</th>
                            <th>开始时间</th>
                            <th>提交时间</th>
                            <th>分数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {progress.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.student_id}</td>
                                <td>{item.experiment_id}</td>
                                <td>{item.status}</td>
                                <td>{item.start_time ? new Date(item.start_time).toLocaleString() : '-'}</td>
                                <td>{item.submit_time ? new Date(item.submit_time).toLocaleString() : '-'}</td>
                                <td>{item.score !== null ? `${item.score}分` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function CreateCourseModal({ onClose, onCreate }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: '初级',
        tags: '',
        notebook_path: '',
        published: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        };
        onCreate(data);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>创建课程</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>课程名称</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>课程描述</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>难度</label>
                        <select
                            value={formData.difficulty}
                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                        >
                            <option value="初级">初级</option>
                            <option value="中级">中级</option>
                            <option value="高级">高级</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>标签（逗号分隔）</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Python, 数据分析"
                        />
                    </div>
                    <div className="form-group">
                        <label>Notebook路径</label>
                        <input
                            type="text"
                            value={formData.notebook_path}
                            onChange={e => setFormData({ ...formData, notebook_path: e.target.value })}
                            placeholder="course/example.ipynb"
                            required
                        />
                    </div>
                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                            />
                            立即发布
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose}>取消</button>
                        <button type="submit">创建</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeacherDashboard;
