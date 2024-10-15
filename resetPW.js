document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('password').value;

    try {
        const response = await fetch('https://adimal.kro.kr:3000/user/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('비밀번호가 성공적으로 재설정되었습니다.');
            // 추가적인 동작
        } else {
            alert(`비밀번호 재설정 오류: ${data.message}`);
        }
    } catch (error) {
        console.error('비밀번호 재설정 오류:', error);
        alert('서버에 문제가 발생했습니다.');
    }
});
