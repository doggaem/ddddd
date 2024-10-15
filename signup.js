document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 아이디와 이메일 형식 검증
    let errorMsg = '';
    const usernameRegex = /^[a-zA-Z0-9]{4,7}$/; // 4~7자 사이의 알파벳 대소문자 및 숫자만 허용
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 기본적인 이메일 형식 검증

    if (!usernameRegex.test(username)) {
        errorMsg += '아이디에는 특수문자가 들어갈 수 없습니다. ';
    }
    if (!emailRegex.test(email)) {
        errorMsg += '이메일 형식이 올바르지 않습니다. ';
    }

    // 비밀번호 형식 검증
    // 비밀번호 형식 검증 수정
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/; // 8자 이상, 알파벳, 숫자, 특수문자를 포함해야 함
// 8자 이상, 알파벳과 숫자를 포함해야 함
    const consecutiveCharRegex = /(.)\1{3,}/; // 4개 이상의 연속된 문자 확인

    if (!passwordRegex.test(password)) {
        errorMsg += '비밀번호는 6자 이상이어야 하며, 알파벳과 숫자,특수문자를 포함해야 합니다. ';
    }
    if (consecutiveCharRegex.test(password)) {
        errorMsg += '비밀번호에 4개 이상의 연속된 문자가 포함될 수 없습니다. ';
    }
    if (username.includes(password) || email.includes(password)) {
        errorMsg += '비밀번호는 아이디나 이메일 주소와 같을 수 없습니다. ';
    }

    // 에러 메시지가 있을 경우 표시하고 요청 중지
    if (errorMsg) {
        document.getElementById('errorMsg').textContent = errorMsg.trim();
        return; // 요청 중지
    }

    try {
        const response = await fetch('https://adimal.kro.kr:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = 'loginpage.html'; // 회원가입 성공 시 로그인 페이지로 이동
        } else {
            document.getElementById('errorMsg').textContent = data.message; // 서버로부터 받은 에러 메시지 출력
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        document.getElementById('errorMsg').textContent = '회원가입에 실패했습니다. 다시 시도해주세요';
    }
});

//-교환하기 버튼 누르면 서버에 연결해서 가격정보만 가져오고 연산실행