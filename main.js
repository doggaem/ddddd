const username = localStorage.getItem('username');

// 서버에서 포인트 값을 가져오는 함수
console.log('Current username:', username); // username 로그

function getPointsFromDatabase() {
    if (!username) return; // username이 없으면 실행 중단

    fetch(`https://adimal.kro.kr:3000/user/points?username=${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // JSON으로 변환
        })
        .then(data => {
            if (data.points !== undefined) {
                // 전역 변수에 포인트 값 저장
                animatePoints(data.points)

                // 로컬 스토리지에 포인트 값 저장
                localStorage.setItem('points', data.points);
            }
        })
        .catch(error => {
            console.error('Error fetching points from database:', error);
        });
}

// 사용자 인사말 표시
if (username) {
    document.getElementById('greetingUser').textContent = username + "님";
} else {
    document.getElementById('greetingUser').innerHTML = '<a href="loginpage.html">로그인해주세요</a>';
}

// 포인트 애니메이션
const duration = 1000; // 1초
const pointsElement = document.querySelector('.points h2'); // 포인트 표시 요소

function animatePoints(target) {
    const startTime = performance.now(); // 애니메이션 시작 시간
    const incrementTime = 1000 / 60; // 60fps (초당 60프레임)
    const incrementAmount = target / (duration / incrementTime); // 증가량 계산

    function update() {
        const currentTime = performance.now(); // 현재 시간
        const elapsedTime = currentTime - startTime; // 경과 시간

        // 현재 포인트 계산
        let currentPoints = Math.min(incrementAmount * (elapsedTime / incrementTime), target);
        
        // 포인트를 천의 자리마다 쉼표로 형식화하고 소수점 제거
        pointsElement.textContent = Math.floor(currentPoints).toLocaleString(); // 소수점 제거 및 쉼표 추가

        // 애니메이션이 완료되지 않았으면 계속 업데이트
        if (currentPoints < target) {
            requestAnimationFrame(update);
        } else {
            pointsElement.textContent = target.toLocaleString(); // 최종 목표 포인트 설정
        }
    }

    // 애니메이션 시작
    requestAnimationFrame(update);
}

// 로그아웃 함수
function logout() {
    localStorage.clear();
    location.href = "index.html";
}

// 로그인 체크 및 페이지 리다이렉트
function checkLogin(redirectPage) {
    const username = localStorage.getItem('username');
    
    if (!username) {
        // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
        location.href = "loginpage.html";
    } else {
        // 로그인되어 있으면 지정된 페이지로 이동
        location.href = redirectPage;
    }
}

// 페이지 로드 시 포인트 가져오기 및 애니메이션 시작
window.onload = () => {
    getPointsFromDatabase();
};
