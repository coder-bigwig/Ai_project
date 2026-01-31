"""测试教师登录流程"""
import requests
import json

API_URL = "http://localhost:8001"

def test_teacher_login():
    print("=" * 50)
    print("测试教师登录流程")
    print("=" * 50)
    
    # 测试 1: 检查角色 API
    print("\n1. 测试角色检查 API...")
    username = "teacher_001"
    try:
        res = requests.get(f"{API_URL}/api/check-role?username={username}")
        print(f"   状态码: {res.status_code}")
        print(f"   响应: {json.dumps(res.json(), ensure_ascii=False, indent=2)}")
        
        role_data = res.json()
        if role_data.get('role') == 'teacher':
            print("   ✓ 角色识别正确：教师")
        else:
            print(f"   ✗ 角色识别错误：{role_data.get('role')}")
    except Exception as e:
        print(f"   ✗ 错误: {e}")
    
    # 测试 2: 获取教师课程
    print("\n2. 测试获取教师课程...")
    try:
        res = requests.get(f"{API_URL}/api/teacher/courses?teacher_username={username}")
        print(f"   状态码: {res.status_code}")
        courses = res.json()
        print(f"   课程数量: {len(courses)}")
        for course in courses:
            print(f"   - {course['title']} (发布状态: {course.get('published', 'N/A')})")
    except Exception as e:
        print(f"   ✗ 错误: {e}")
    
    # 测试 3: 测试学生账号
    print("\n3. 测试学生账号角色...")
    student_username = "student_001"
    try:
        res = requests.get(f"{API_URL}/api/check-role?username={student_username}")
        print(f"   状态码: {res.status_code}")
        print(f"   响应: {json.dumps(res.json(), ensure_ascii=False, indent=2)}")
        
        role_data = res.json()
        if role_data.get('role') == 'student':
            print("   ✓ 角色识别正确：学生")
        else:
            print(f"   ✗ 角色识别错误：{role_data.get('role')}")
    except Exception as e:
        print(f"   ✗ 错误: {e}")
    
    print("\n" + "=" * 50)
    print("测试完成")
    print("=" * 50)

if __name__ == "__main__":
    test_teacher_login()
