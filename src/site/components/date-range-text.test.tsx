import { render, screen } from "@testing-library/react";
import { DateRangeText } from "./date-range-text";

describe("DateRangeText", () => {
  it("marks a single period up as a machine-readable time", () => {
    render(<DateRangeText range={{ earliest: "1821-03-14", latest: "1821-03-14" }} />);
    expect(screen.getByText("14 March 1821").tagName).toBe("TIME");
    expect(screen.getByText("14 March 1821")).toHaveAttribute("datetime", "1821-03-14");
  });

  it("renders a range of several periods as plain text", () => {
    const { container } = render(<DateRangeText range={{ earliest: "1837-01-01", latest: "1839-12-31" }} />);
    expect(container).toHaveTextContent("1837–1839");
    expect(container.querySelector("time")).toBeNull();
  });
});
