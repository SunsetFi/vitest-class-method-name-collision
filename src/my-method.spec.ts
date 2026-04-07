import { MyClass } from "./MyClass";

const { myMethodMock } = vi.hoisted(() => ({
  myMethodMock: vi.fn(),
}));

vi.mock("./MyClass", () => ({
  MyClass: class {
    myMethod = myMethodMock;
  },
}));

import { myMethod } from "./my-method";

describe("myMethod", () => {
  it("should call MyClass.myMethod", () => {
    myMethodMock.mockReturnValue("Mocked Hello, World!");
    const result = myMethod();
    expect(myMethodMock).toHaveBeenCalled();
    expect(result).toBe("Mocked Hello, World!");
  });
});
