import test, { expect } from "@playwright/test";

// 테스트 코드 작성 후 => npx playwright test 04_checkout --ui 모드로 실행
test('전체 구매 프로세스(홈페이지 접속 → 상품선택 → 장바구니 → 주문 → 완료) 테스트', async ({page}) => {

  // 1. 홈페이지 접속 
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('환영합니다');

  // 2. 상품 선택
  // 2_1) 상품 목록 페이지로 이동 
  await page.getByRole('link', {name: '상품 보기'}).click();
  await expect(page).toHaveURL('/products');
  await expect(page.getByRole('article')).toHaveCount(12);

  // 2_2) 상품 검색 
  await page.getByPlaceholder('상품 검색').fill('키보드');
  await page.getByRole('button', {name: '검색'}).click();
  await expect(page.getByRole('article')).toHaveCount(3);

  // 2_3) 상품선택
  await page.getByRole('article').first().click();
  await expect(page).toHaveURL(/\/products\/\d+/);
  await expect(page.getByRole('button', {name: '장바구니 담기'})).toBeVisible();

  // 3. 장바구니
  // 3_1) 장바구니에 추가 
  await page.getByRole('button', {name: '장바구니 담기'}).click();
  await expect(page.getByText('장바구니에 추가되었습니다')).toBeVisible();
  await expect(page.getByText('장바구니에 추가되었습니다')).toBeHidden();

  // 3_2) 장바구니 페이지로 이동
  await page.getByRole('link', {name: '장바구니'}).click();
  await expect(page).toHaveURL('/cart');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('장바구니');

  // 4. 주문
  // 4_1) 주문페이지로 이동 
  await page.getByRole('button', {name: '구매하기'}).click();
  await expect(page).toHaveURL('/checkout');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('주문/결제');

  // 4_2) 주문정보(배송정보, 결제정보) 입력
  await page.getByLabel('받는 사람').fill('홍길동');
  await page.getByLabel('연락처').fill('010-1234-5678');
  await page.getByLabel('주소').fill('서울시 강남구 테헤란로 123');
  await page.getByLabel('카드 번호').fill('1234-5678-9012-3456');
  await page.getByLabel('만료일').fill('12/26');
  await page.getByLabel('CVC').fill('123');

  // 4_3) 주문하기 (결제하기)
  await page.getByRole('button', {name: '결제하기'}).click();

  // 5. 주문완료 확인 
  await expect(page).toHaveURL(/\/order\/\d+/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('주문이 완료되었습니다');
  await expect(page.getByTestId('order-number')).toBeVisible();


})