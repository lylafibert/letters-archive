import { createCorrespondent, createLetter } from "../../tests/fixtures/letters";
import { summariseCorrespondents, summariseDecades } from "./site-data";

const eliza = createCorrespondent({ id: 1, name: "Eliza Marrable" });
const thomas = createCorrespondent({ id: 2, name: "Thomas Marrable" });
const ferrier = createCorrespondent({ id: 3, name: "Augustin Ferrier" });

describe("summariseCorrespondents", () => {
  const elizaToThomas = createLetter({ id: "MAR/001", sender: eliza, recipient: thomas });
  const thomasToEliza = createLetter({ id: "MAR/003", sender: thomas, recipient: eliza });
  const ferrierToUnknown = createLetter({ id: "ASH/004", sender: ferrier, recipient: null });
  const summaries = summariseCorrespondents([elizaToThomas, thomasToEliza, ferrierToUnknown]);

  it("includes everyone who sent or received a letter, sorted by name", () => {
    expect(summaries.map((summary) => summary.correspondent.name)).toEqual([
      "Augustin Ferrier",
      "Eliza Marrable",
      "Thomas Marrable",
    ]);
  });

  it("separates letters sent from letters received", () => {
    const elizaSummary = summaries.find((summary) => summary.correspondent.id === eliza.id);
    expect(elizaSummary?.sent).toEqual([elizaToThomas]);
    expect(elizaSummary?.received).toEqual([thomasToEliza]);
  });

  it("does not count an unknown recipient as a correspondent", () => {
    expect(summaries).toHaveLength(3);
  });
});

describe("summariseDecades", () => {
  const within1830s = createLetter({ id: "PEN/002", dateEarliest: "1832-01-01", dateLatest: "1835-12-31" });
  const spanning = createLetter({ id: "MAR/002", dateEarliest: "1818-01-01", dateLatest: "1822-12-31" });
  const before1840 = createLetter({ id: "FER/002", dateEarliest: null, dateLatest: "1839-12-31" });
  const undated = createLetter({ id: "X/001", dateEarliest: null, dateLatest: null });
  const summaries = summariseDecades([within1830s, spanning, before1840, undated]);

  it("lists every decade any letter may belong to, in order", () => {
    expect(summaries.map((summary) => summary.decade)).toEqual([1810, 1820, 1830]);
  });

  it("counts a letter wholly within a decade as certain", () => {
    expect(summaries.find((summary) => summary.decade === 1830)?.certain).toEqual([within1830s]);
  });

  it("counts a letter that only may belong as possible, in every decade it overlaps", () => {
    expect(summaries.find((summary) => summary.decade === 1810)?.possible).toEqual([spanning]);
    expect(summaries.find((summary) => summary.decade === 1820)?.possible).toEqual([spanning]);
  });

  it("counts a letter with an open start as possible in its latest date's decade", () => {
    expect(summaries.find((summary) => summary.decade === 1830)?.possible).toEqual([before1840]);
  });

  it("leaves undated letters out", () => {
    const allListed = summaries.flatMap((summary) => [...summary.certain, ...summary.possible]);
    expect(allListed).not.toContain(undated);
  });
});
