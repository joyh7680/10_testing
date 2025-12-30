import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoInput from "@/components/04_TodoInput";
import userEvent from "@testing-library/user-event";

// "TodoInput 컴포넌트 테스트"라는 이름의 테스트 그룹
describe("TodoInput 컴포넌트 테스트", () => {
  // “입력창(input)과 버튼(button)이 화면에 보인다”를 테스트 설명
  test("입력창과 버튼이 렌더링된다", () => {
    // 예전에는 즉석에서 mock 함수를 넘겼을 가능성
    // render(<TodoInput onSubmit={jest.fn()} />);

    // onSubmit props로 전달할 가짜 함수
    const mockOnSubmit = jest.fn();
    render(<TodoInput onSubmit={mockOnSubmit} />);

    // "할 일 입력"이라는 label과 연결된 input이 DOM 안에 존재하는지 확인
    expect(screen.getByLabelText("할 일 입력")).toBeInTheDocument();
    // 역할이 button이고 화면에 보이는 텍스트가 "추가"인 버튼이 존재하는지 확인
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
  });

  // async 이 테스트는 비동기 테스트
  // userEvent.type()는 내부적으로 여러 이벤트를 비동기적으로 발생시키기 때문에 async / await이 반드시 필요
  test("입력값을 변경할 수 있다", async () => {
    // onSubmit props로 전달할 가짜 함수
    // jest.fn() :  가짜 함수(mock function) 를 만드는 Jest API
    const mockOnSubmit = jest.fn();

    // 실제 브라우저처럼 테스트 환경 구성
    render(<TodoInput onSubmit={mockOnSubmit} />);

    // <label htmlFor="todo-input">할 일 입력</label>
    const input = screen.getByLabelText("할 일 입력");

    // 실제 사용자 행동을 시뮬레이션하는 객체
    /*
      userEvent.type은
      “사람이 마우스로 클릭하고 → 커서를 놓고 → 키보드로 타이핑하는 모든 과정”을
      브라우저 이벤트 단위로 쪼개서 그대로 흉내 낸 것
    */
    const user = userEvent.setup();

    // 입력 동작: 호버 => 클릭 => 포커스 => 키다운 => 입력 => 키업 
    // 포커스 = 입력 가능한 상태 (ex: input 테두리가 파랗게 변함 )
    // 키다운 = 키를 누르는 순간
    // 입력 : input 이벤트 = 값이 실제로 바뀔 때
    // 키업 = 키에서 손을 뗄 때
    await user.type(input, "곧 밥먹기");

    // fireEvent.change(input, { target: { value: "테스트 할 일" } });
    //fireEvent → “값만 바꿔치기”
    // userEvent → “사람이 실제로 타이핑”

    // 결과 검증 : 즉, state 업데이트가 정상적으로 되었는지 검증
    expect(input).toHaveValue("곧 밥먹기");
  });

  test("폼 제출 시 onSubmit이 호출되고 입력값이 초기화된다", async () => {
    const mockOnSubmit = jest.fn();
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText("할 일 입력");
    const submitBtn = screen.getByRole("button", { name: "추가" });

    // 입력(타이핑) 후 추가 버튼 클릭
    const user = userEvent.setup();
    await user.type(input, "곧 밥먹기");
    await user.click(submitBtn);

    // onSubmit으로 전달한 mock 함수가 1회 호출되는지, 올바른 값이 전달되는지
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith("곧 밥먹기");
  });

  test("타이핑 시 Enter키가 눌려지면 onSubmit이 호출된다", async () => {
    const mockOnSubmit = jest.fn();
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText("할 일 입력");

    const user = userEvent.setup();
    //특수키: {Enter}, {Tab}, {Escape}, {Backspace}
    await user.type(input, "곧 밥먹기{Enter}");

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith("곧 밥먹기");
  });

  test("공백만 입력하고 제출하면 onSubmit이 호출되지 않는다", async () => {
    const mockOnSubmit = jest.fn();
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText("할 일 입력");
    const submitBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "   "); // 공백만 입력
    await user.click(submitBtn); // 제출

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("제출 후 입력 필드는 초기화된다", async () => {
    const mockOnSubmit = jest.fn();
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText("할 일 입력");
    const submitBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "곧 밥먹기");
    await user.click(submitBtn);

    expect(input).toHaveValue(""); // 제출 후 input 초기화
  });
});
