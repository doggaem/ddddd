const userInfo = JSON.parse(localStorage.getItem("user-info"));
const ptag = document.querySelector('.avail p');
const buyButton = document.getElementById('buyButton'); // buy 버튼 요소 선택

// userInfo에서 가격 가져오기
const price = userInfo ? userInfo.price : 0; // userInfo에서 가격을 가져오고, 없으면 0으로 설정
console.log("상품 가격:", price); // 가격 확인 로그

// 서버에서 포인트 값을 가져오는 함수
function getPointsFromDatabase() {
    if (!userInfo) return; // userInfo가 없으면 실행 중단

    const username = localStorage.getItem('username'); // username을 가져오기

    fetch(`https://adimal.kro.kr:3000/user/points?username=${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // JSON으로 변환
        })
        .then(data => {
            console.log("서버에서 가져온 포인트:", data.points); // 가져온 포인트 로그

            if (data.points !== undefined) {
                const remainingPoints = data.points - price; // 남은 포인트 계산
                console.log("남은 포인트:", remainingPoints); // 남은 포인트 로그

                // 남은 포인트를 천 단위 구분 기호로 포맷
                const formattedRemainingPoints = remainingPoints.toLocaleString();

                if (remainingPoints < 0) {
                    ptag.textContent = "포인트 부족";
                    buyButton.classList.remove('available');
                    buyButton.classList.add('disabled'); // 버튼 비활성화 클래스 추가
                } else {
                    ptag.textContent = "교환 후 포인트 : " + formattedRemainingPoints + "p";
                    buyButton.classList.remove('disabled'); // 버튼 활성화 클래스 제거
                    buyButton.classList.add('available');

                    // 포인트가 충분한 경우 buy 버튼 클릭 시 구매 요청
                    buyButton.onclick = () => buyProduct(username);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching points from database:', error);
        });
}

// 상품 구매 요청 함수
function buyProduct(username) {
    const productId = userInfo ? userInfo.productId : null; // 상품 ID 가져오기

    if (!productId) {
        console.error("상품 ID가 없습니다.");
        return;
    }

    fetch('https://adimal.kro.kr:3000/api/buy-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: username, productId }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // 서버에서 받은 메시지 알림
        if (data.remainingPoints !== undefined) {
            console.log(`남은 포인트: ${data.remainingPoints}`);
            ptag.textContent = "구매 후 남은 포인트: " + data.remainingPoints.toLocaleString() + "p";
        }
    })
    .catch(error => {
        console.error('구매 요청 중 오류 발생:', error);
        alert('구매 요청 중 오류가 발생했습니다.');
    });
}

// 호출 예시
getPointsFromDatabase();
