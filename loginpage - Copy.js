document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://adimal.kro.kr:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // 토큰을 로컬 스토리지에 저장
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('points', data.points);

            // 로그인 성공 후 페이지 이동
            window.location.href = 'index.html';
        } else {
            document.getElementById('errorMsg').textContent = '아이디나 비밀번호가 올바르지 않습니다';
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        document.getElementById('errorMsg').textContent = '로그인에 실패했습니다. 다시 시도해주세요';
    }
});
