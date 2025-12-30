import { render, screen } from "@testing-library/react";
import Title from "../components/01_Title";

describe("Title 컴포넌트", () => {
  //A(Arrange, 준비) => A(act, 행동) => a(assert, 검증)패턴
  test('화면에 "환영합니다!" 텍스트가 표시된다.', () => {
    // arrange (준비) : 컴포넌트를 가상 DOM에 렌더링
    render(<Title />);

    //act 행동 : 텍스트 대상의 요소 찾기
    const titleElement = screen.getByText("환영합니다!");

    //assert (검증): 요소가 DOM트리에 존재하는지 확인
    expect(titleElement).toBeInTheDocument;
  });

  test("h1 태그로 렌더링된다.", () => {
    render(<Title />);

    const headingElement = screen.getByRole("heading", { level: 1 });

    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent("환영합니다!");

    // 이게 다 뭐람? @@
  });
});
