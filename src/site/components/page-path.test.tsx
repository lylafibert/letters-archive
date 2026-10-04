import { screen } from "@testing-library/react";
import { renderAtPath } from "../../../tests/support/render";
import { SiteLink } from "./page-path";

describe("SiteLink", () => {
  it("links relative to the current page", () => {
    renderAtPath(<SiteLink to="correspondents/">Correspondents</SiteLink>, "letters/mar-001/");
    expect(screen.getByRole("link", { name: "Correspondents" })).toHaveAttribute("href", "../../correspondents/");
  });

  it("passes other attributes through to the link", () => {
    renderAtPath(
      <SiteLink to="letters/mar-002/" rel="next">
        Next
      </SiteLink>,
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("rel", "next");
  });
});
