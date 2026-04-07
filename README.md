This repo demonstrates a name collision bug with vitest 4.1.3

The test is triggered with the following conditions:
- Using typescript
- With "useDefineForClassFields" turned on in the tsconfig
- Mocking a class with a method
- In a file that imports a function whose name matches the method

Given a test that looks like this:
```ts
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
```

vitest gets confused and thinks the `myMethod` property key of MyClass in the mock is referencing the `myMethod` function imported from `./my-method`.
As a result, it tries to hoist the import above the mock in a way where myMethod is accessed as a property from the imported module.
This causes a ReferenceError for an uninitialized property access, as `./my-method` depends on the `./MyClass` mock, which hasn't had a chance to run yet.

A workaround is to enclose the class property in a computed property syntax:
```ts
vi.mock("./MyClass", () => ({
  MyClass: class {
    ["myMethod"] = myMethodMock;
  },
}));
```
