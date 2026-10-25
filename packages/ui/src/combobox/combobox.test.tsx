import { render } from "@testing-library/react";
import { Combobox } from "./index";

describe("Combobox Component", () => {
  it("renders without crashing and respects props", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];
    const { getByText } = render(
      <Combobox options={options} selected="2" onSelect={() => {}} placeholder="Select..." />
    );
    expect(getByText("Select...")).toBeDefined();
  });
});
