import TodoList from "@/components/05_TodoList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TodoList 컴포넌트 테스트", () => {
  test("초기에는 할 일 목록이 비어있다", () => {
    render(<TodoList />);
    expect(screen.getByText("할 일이 없습니다")).toBeInTheDocument();
  });

  test("할 일을 추가할 수 있다.", async () => {
    render(<TodoList />);

    const input = screen.getByLabelText("할 일 입력");
    const addBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "첫번째 할 일");
    await user.click(addBtn);

    // 할 일이 목록에 추가되었는지 확인
    expect(screen.getByText("첫번째 할 일")).toBeInTheDocument();
    expect(screen.queryByText("할 일이 없습니다")).not.toBeInTheDocument();
  });

  test("할 일을 완료 처리할 수 있다", async () => {
    render(<TodoList />);

    const input = screen.getByLabelText("할 일 입력");
    const addBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "할 일");
    await user.click(addBtn);

    // checkbox 요소 찾기 : getByRole('checkbox', { name: aria-label값 })
    const checkbox = screen.getByRole("checkbox", { name: "할 일 완료 표시" });
    await user.click(checkbox);

    // 특정 요소의 가장 가까운 xx 부모 요소 찾기 : 요소.closest('xx')
    const todoItem = checkbox.closest("li");

    // 요소가 특정 Class를 가지고 있는지 확인 : toHaveClass('Class명')
    expect(todoItem).toHaveClass("line-through");
    // 요소가 체크되었는지 확인 : toBeChecked()
    expect(checkbox).toBeChecked();
  });

  test("완료된 할 일을 다시 활성화할 수 있다", async () => {
    render(<TodoList />);

    const input = screen.getByLabelText("할 일 입력");
    const addBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "할 일");
    await user.click(addBtn);

    // 완료 처리
    const checkbox = screen.getByRole("checkbox", { name: "할 일 완료 표시" });
    await user.click(checkbox);
    const todoItem = checkbox.closest("li");
    expect(todoItem).toHaveClass("line-through");
    expect(checkbox).toBeChecked();

    // 다시 활성화
    await user.click(checkbox);
    expect(todoItem).not.toHaveClass("line-through");
    expect(checkbox).not.toBeChecked();
  });

  test("할 일을 삭제할 수 있다", async () => {
    render(<TodoList />);

    // 할 일 추가
    const input = screen.getByLabelText("할 일 입력");
    const addBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "할 일");
    await user.click(addBtn);

    // 할 일 삭제
    const deleteBtn = screen.getByRole("button", { name: "할 일 삭제" });
    await user.click(deleteBtn);

    expect(screen.queryByText("할 일")).not.toBeInTheDocument();
  });

  test("필터링이 정상적으로 동작한다.", async () => {
    // 렌더링
    render(<TodoList />);

    // 여러 할 일 추가 (할일1, 할일2, 할일3)
    const input = screen.getByLabelText("할 일 입력");
    const addBtn = screen.getByRole("button", { name: "추가" });

    const user = userEvent.setup();
    await user.type(input, "할 일1");
    await user.click(addBtn);
    await user.type(input, "할 일2");
    await user.click(addBtn);
    await user.type(input, "할 일3");
    await user.click(addBtn);

    // 하나를 완료 처리로 변경
    const checkbox = screen.getByRole("checkbox", { name: "할 일1 완료 표시" });
    await user.click(checkbox);

    // '활성' 필터 클릭 => getByRole('button', {name: /활성/})
    const activeFilter = screen.getByRole("button", { name: /활성/ });
    await user.click(activeFilter);

    // 활성 상태인 할일들만 보여지는지 확인
    expect(screen.queryByText("할 일1")).not.toBeInTheDocument();
    expect(screen.getByText("할 일2")).toBeInTheDocument();
    expect(screen.getByText("할 일3")).toBeInTheDocument();

    // '완료' 필터 클릭
    const completedFilter = screen.getByRole("button", { name: /완료/ });
    await user.click(completedFilter);

    // 완료 상태인 할일만 보여지는지 확인
    expect(screen.getByText("할 일1")).toBeInTheDocument();
    expect(screen.queryByText("할 일2")).not.toBeInTheDocument();
    expect(screen.queryByText("할 일3")).not.toBeInTheDocument();

    // '전체' 필터 클릭
    const allFilter = screen.getByRole("button", { name: /전체/ });
    await user.click(allFilter);

    // 모든 할일이 보여지는지 확인
    expect(screen.getByText("할 일1")).toBeInTheDocument();
    expect(screen.getByText("할 일2")).toBeInTheDocument();
    expect(screen.getByText("할 일3")).toBeInTheDocument();
  });
});
