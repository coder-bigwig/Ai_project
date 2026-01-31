"""直接测试教师界面渲染"""
import requests

print("=" * 60)
print("测试访问路径")
print("=" * 60)

# 测试 1: 检查前端是否正常
print("\n1. 测试前端访问...")
try:
    res = requests.get("http://localhost:8080", timeout=3)
    print(f"   ✓ 前端可访问 (状态码: {res.status_code})")
except Exception as e:
    print(f"   ✗ 前端访问失败: {e}")

# 测试 2: 检查角色API
print("\n2. 测试角色API...")
try:
    res = requests.get("http://localhost:8001/api/check-role?username=teacher_001")
    data = res.json()
    print(f"   响应: {data}")
    if data.get('role') == 'teacher':
        print("   ✓ API返回正确: role='teacher'")
    else:
        print(f"   ✗ API返回错误: role='{data.get('role')}'")
except Exception as e:
    print(f"   ✗ API请求失败: {e}")

# 测试 3: 检查教师课程API
print("\n3. 测试教师课程API...")
try:
    res = requests.get("http://localhost:8001/api/teacher/courses?teacher_username=teacher_001")
    courses = res.json()
    print(f"   找到 {len(courses)} 个课程")
    for i, course in enumerate(courses, 1):
        print(f"   {i}. {course['title']}")
    if len(courses) > 0:
        print("   ✓ 教师API正常工作")
    else:
        print("   ✗ 教师API返回空列表")
except Exception as e:
    print(f"   ✗ API请求失败: {e}")

print("\n" + "=" * 60)
print("结论")
print("=" * 60)
print("如果所有测试都通过，问题在于：")
print("1. 浏览器缓存了旧的JavaScript文件")
print("2. 用户需要硬刷新（Ctrl+Shift+R）或清除缓存")
print("\n解决方案：")
print("- 打开浏览器开发者工具 (F12)")
print("- 右键点击刷新按钮，选择 '清空缓存并硬性重新加载'")
print("- 或者使用无痕模式访问 http://localhost:8080")
print("=" * 60)
