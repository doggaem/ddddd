document.addEventListener('DOMContentLoaded', () => {
    var productlist = document.querySelector('.history'); // .history 클래스를 선택
    const username = localStorage.getItem('username'); // 여기서 username을 정의해야 합니다.

    // 제품 요소 생성 함수
    function createProductElement(change, reason, date, balance) {
        var item = document.createElement('div'); // .item 요소 생성
        item.classList.add('item');
        item.style.cursor = 'pointer'; // 커서 포인터 설정

        // 금액 표시 요소 생성
        var chargeElement = document.createElement('p');
        chargeElement.textContent = `Change: ${change}`;
        item.appendChild(chargeElement); // 금액을 .item에 추가

        // 제품 정보 div 생성
        var infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        // 이유(reason) 요소 생성
        var reasonElement = document.createElement('p');
        reasonElement.textContent = `Reason: ${reason}`; // 이유 설정
        infoDiv.appendChild(reasonElement); // .info에 이유 추가

        // 날짜(date) 요소 생성
        var dateElement = document.createElement('p');
        dateElement.textContent = `Date: ${new Date(date).toLocaleString()}`; // 날짜 설정
        infoDiv.appendChild(dateElement); // .info에 날짜 추가

        // 잔액(balance) 요소 생성
        var balanceValue = balance !== undefined ? balance : 0; // 잔액이 없을 때 0으로 설정
        var balanceElement = document.createElement('p');
        balanceElement.textContent = `Balance: ${balanceValue.toLocaleString()}`;
        infoDiv.appendChild(balanceElement); // .info에 잔액 추가

        // .item에 .info 추가
        item.appendChild(infoDiv);

        return item; // 생성된 .item 요소 반환
    }

    // 제품 목록에 제품 추가 함수
    function addProduct(change, reason, date, balance) {
        var productElement = createProductElement(change, reason, date, balance); // 제품 요소 생성
        productlist.appendChild(productElement); // .item을 .history에 추가
    }

    // API에서 특정 유저의 기록 가져오기
    fetch(`https://adimal.kro.kr:3000/api/user/histories?username=${username}`)
        .then(response => {
            if (!response.ok) throw new Error("기록을 불러오는 데 실패했습니다.");
            return response.json();
        })
        .then(data => {
            console.log(data); // 서버에서 받은 데이터를 콘솔에 출력
            data.forEach(item => {
                addProduct(item.change, item.reason, item.date, item.balance); // 데이터 속성에 맞게 수정
            });
        })
        .catch(error => {
            console.error(error);
            alert("기록을 불러오는 데 실패했습니다. 다시 시도해 주세요.");
        });
});
