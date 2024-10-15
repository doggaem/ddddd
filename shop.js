document.addEventListener('DOMContentLoaded', () => {
    var productlist = document.querySelector('.shop'); // .shop 클래스를 선택

    function createProductElement(imgSrc, name, price, desc, id) {
        var item = document.createElement('div'); // .item 요소 생성
        item.classList.add('item');
        item.style.cursor = 'pointer'; // 커서 포인터 설정

        // 클릭 시 이동 설정 (ID를 사용하여 URL을 설정)
        item.onclick = () => {
            location.href = `itempage.html?id=${id}`; // 클릭한 제품의 ID를 쿼리 파라미터로 전달
        };

        // 이미지 요소 생성
        var imgElement = document.createElement('img');
        imgElement.src = imgSrc; // 이미지 소스 설정
        item.appendChild(imgElement); // 이미지를 .item에 추가

        // 제품 정보 div 생성
        var infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        // 제품 이름 요소 생성
        var itemName = document.createElement('p');
        itemName.classList.add('itemName');
        var nameStrong = document.createElement('strong');
        nameStrong.textContent = name; // 제품 이름 설정
        itemName.appendChild(nameStrong); // strong을 .itemName에 추가
        infoDiv.appendChild(itemName); // .itemName을 .info에 추가

        // 가격 요소 생성
        var priceElement = document.createElement('div');
        priceElement.classList.add('price');
        var priceStrong = document.createElement('p');
        priceStrong.innerHTML = `<strong>${price.toLocaleString()}P</strong>`; // 가격 설정
        priceElement.appendChild(priceStrong); // strong을 가격 div에 추가
        infoDiv.appendChild(priceElement); // 가격을 .info에 추가

        // infoDiv를 .item에 추가
        item.appendChild(infoDiv);

        // 상품 ID 추가
        item.setAttribute('data-product-id', id);

        return item; // 생성된 .item 요소 반환
    }

    function addProduct(img, name, price, desc, id) {
        var productElement = createProductElement(img, name, price, desc, id); // 제품 요소 생성
        productlist.appendChild(productElement); // .item을 .shop에 추가
    }

    // API에서 제품 가져오기
    fetch('https://adimal.kro.kr:3000/api/products')
        .then(response => {
            if (!response.ok) throw new Error("상품 정보를 불러오는 데 실패했습니다.");
            return response.json();
        })
        .then(products => {
            products.forEach(product => {
                // 각 제품을 추가할 때 ID도 포함
                addProduct(product.img, product.name, product.price, product.desc, product.productId);
            });
        })
        .catch(error => {
            console.error(error);
            alert("상품 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
        });

    // 클릭 이벤트 처리
    productlist.addEventListener('click', (event) => {
        const product = event.target.closest('.item');
        if (product) {
            // 데이터 속성에서 상품 ID 가져오기
            const productId = product.getAttribute('data-product-id');
            
            // 상품 ID가 유효한지 확인
            if (productId) {
                // 서버에 요청하여 해당 제품 정보를 가져옴
                fetch(`https://adimal.kro.kr:3000/api/products/${productId}`)
                    .then(response => {
                        if (!response.ok) throw new Error("상품 정보를 불러오는 데 실패했습니다.");
                        return response.json();
                    })
                    .then(productData => {
                        // 상품 ID를 쿼리 파라미터로 추가
                        location.href = `itempage.html?id=${productId}`; // itempage로 이동하며 상품 ID를 전달
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                console.error("유효하지 않은 상품 ID입니다."); // 상품 ID가 유효하지 않을 경우 오류 메시지
            }
        }
    });
});
