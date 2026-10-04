import { screen } from "@testing-library/react";
import { renderAtPath } from "../../../tests/support/render";
import { Pager } from "./pager";

describe("Pager", () => {
  it("links to the previous and next pages with their titles", () => {
    renderAtPath(
      <Pager
        label="Previous and next letters"
        previous={{ path: "letters/mar-001/", title: "First letter" }}
        next={{ path: "letters/mar-003/", title: "Third letter" }}
      />,
      "letters/mar-002/",
    );
    const navigation = screen.getByRole("navigation", { name: "Previous and next letters" });
    expect(navigation).toContainElement(screen.getByRole("link", { name: /Previous.*First letter/ }));
    expect(screen.getByRole("link", { name: /Next.*Third letter/ })).toHaveAttribute("href", "../../letters/mar-003/");
  });

  it("marks the links as previous and next for browsers and assistive technology", () => {
    renderAtPath(<Pager label="Pages" previous={{ path: "a/", title: "A" }} next={{ path: "b/", title: "B" }} />);
    expect(screen.getByRole("link", { name: /A$/ })).toHaveAttribute("rel", "prev");
    expect(screen.getByRole("link", { name: /B$/ })).toHaveAttribute("rel", "next");
  });

  it("renders nothing when there is neither a previous nor a next page", () => {
    const { container } = renderAtPath(<Pager label="Pages" />);
    expect(container).toBeEmptyDOMElement();
  });
});
