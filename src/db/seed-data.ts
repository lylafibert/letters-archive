// The sample archive, from data/sources/letters.md and docs/dates.md.
// All people, places and letters are fictional.
import type { Correspondent, DateSource } from "../model/types";

export const PLACES = {
  hollinsford: "Hollinsford",
  kelstowHall: "Kelstow Hall, near Hollinsford",
  lindmouth: "Lindmouth",
  meridian: "On board the Meridian, off Port Aldwick",
  portAldwick: "Port Aldwick",
  wexcombe: "Wexcombe",
} as const;

export const CORRESPONDENTS = {
  augustinFerrier: { name: "Augustin Ferrier", kind: "person" },
  claraAshdown: { name: "Clara Ashdown", kind: "person" },
  edmundAshdown: { name: "Edmund Ashdown", kind: "person" },
  elizaMarrable: { name: "Eliza Marrable", kind: "person" },
  hannahPenhallow: { name: "Hannah Penhallow", kind: "person" },
  josiahPenhallow: { name: "Josiah Penhallow", kind: "person" },
  overseersOfThePoor: { name: "The Overseers of the Poor, Wexcombe", kind: "organisation" },
  thomasMarrable: { name: "Thomas Marrable", kind: "person" },
} as const satisfies Record<string, Omit<Correspondent, "id">>;

export type PlaceKey = keyof typeof PLACES;
export type CorrespondentKey = keyof typeof CORRESPONDENTS;

export type SeedLetter = {
  id: string;
  sender: CorrespondentKey;
  recipient: CorrespondentKey | null;
  origin: PlaceKey | null;
  destination: PlaceKey | null;
  date: { text: string; source: DateSource; edtf: string } | null;
  /** One line per line of the letter: salutation, body, closing, signature. */
  transcription: readonly string[];
};

export const LETTERS: readonly SeedLetter[] = [
  {
    id: "MAR/001",
    sender: "elizaMarrable",
    recipient: "thomasMarrable",
    origin: "hollinsford",
    destination: "portAldwick",
    date: { text: "14th March 1821", source: "dateline", edtf: "1821-03-14" },
    transcription: [
      "My dear Brother,",
      "The thaw has come at last and the lane to the mill is a river. Mother bids me say the parcel arrived safe, though the jar of quince was broken in it.",
      "Write soon — your affectionate sister,",
      "Eliza Marrable",
    ],
  },
  {
    id: "MAR/002",
    sender: "elizaMarrable",
    recipient: "thomasMarrable",
    origin: null,
    destination: null,
    date: { text: "c. 1820", source: "catalogue", edtf: "1820~" },
    transcription: [
      "Dear Tom,",
      "I enclose the receipt you asked after. Do not let Mr Ferrier persuade you to the Lindmouth scheme until you have seen the books yourself.",
      "E. M.",
    ],
  },
  {
    id: "MAR/003",
    sender: "thomasMarrable",
    recipient: "elizaMarrable",
    origin: "portAldwick",
    destination: "hollinsford",
    date: { text: "Michaelmas 1828", source: "dateline", edtf: "1828-09-29" },
    transcription: [
      "Dear Eliza,",
      "The Meridian is come in with her hold half empty and the rest spoilt. I fear we shall not see the profit Ferrier promised. Say nothing to Mother.",
      "Thomas",
    ],
  },
  {
    id: "MAR/004",
    sender: "augustinFerrier",
    recipient: "thomasMarrable",
    origin: "lindmouth",
    destination: "portAldwick",
    date: { text: "1826 or 1827", source: "dateline", edtf: "[1826,1827]" },
    transcription: [
      "Sir,",
      "I have the honour to acknowledge your subscription of forty pounds to the Lindmouth Harbour Company, and remain your obedient servant,",
      "Augustin Ferrier, M.D.",
    ],
  },
  {
    id: "MAR/005",
    sender: "elizaMarrable",
    recipient: "thomasMarrable",
    origin: "hollinsford",
    destination: "portAldwick",
    date: { text: "late 1830s", source: "catalogue", edtf: "1837/1839" },
    transcription: [
      "Dear Tom,",
      "I hear from Edmund that you have been aboard the Meridian again. Come to us at Hollinsford and let us see you are well.",
      "Your sister,",
      "Eliza A[shton?]",
    ],
  },
  {
    id: "PEN/001",
    sender: "josiahPenhallow",
    recipient: "hannahPenhallow",
    origin: "wexcombe",
    destination: "kelstowHall",
    // Dated only "Saturday"; the recipient's endorsement "recd. 12 Aug. 1833" bounds the range.
    date: { text: "Saturday", source: "dateline", edtf: "../1833-08-12" },
    transcription: [
      "Dear Miss Greaves,",
      "I return your volume of ferns with thanks, and with a pressed specimen of my own which I believe to be new to the parish.",
      "Yours very sincerely,",
      "J. Penhallow",
    ],
  },
  {
    id: "PEN/002",
    sender: "hannahPenhallow",
    recipient: "josiahPenhallow",
    origin: "kelstowHall",
    destination: "wexcombe",
    date: { text: "between 1832 and 1835", source: "catalogue", edtf: "1832/1835" },
    transcription: [
      "Dear Mr Penhallow,",
      "Your fern is certainly new to me, and I think to Mr Ashdown also, to whom I have taken the liberty of showing it.",
      "Hannah Greaves",
    ],
  },
  {
    id: "PEN/003",
    sender: "hannahPenhallow",
    recipient: "claraAshdown",
    origin: "wexcombe",
    destination: "hollinsford",
    date: { text: "spring 1843", source: "dateline", edtf: "1843-21" },
    transcription: [
      "My dear Clara,",
      "The primroses are thick in the churchyard and Josiah has begun a list of them by the wall. Do come before they are over.",
      "Your loving friend,",
      "Hannah Penhallow",
    ],
  },
  {
    id: "PEN/004",
    sender: "josiahPenhallow",
    recipient: "overseersOfThePoor",
    origin: null,
    destination: "wexcombe",
    date: { text: "1840s", source: "catalogue", edtf: "184X" },
    transcription: [
      "Gentlemen,",
      "I must again press upon you the condition of the cottages below the bridge, which are not fit for any Christian family.",
      "Josiah Penhallow, Vicar",
    ],
  },
  {
    id: "ASH/001",
    sender: "claraAshdown",
    recipient: "hannahPenhallow",
    origin: "hollinsford",
    destination: "wexcombe",
    // The dateline gives no year; the postmark (JU 9 1846) does.
    date: { text: "Tuesday 9th June", source: "dateline", edtf: "1846-06-09" },
    transcription: [
      "Dear Mrs Penhallow,",
      "We are back from the coast and the specimens are all pressed. Edmund sends his regards to the fern.",
      "Clara Ashdown",
    ],
  },
  {
    id: "ASH/002",
    sender: "edmundAshdown",
    recipient: "claraAshdown",
    origin: "meridian",
    destination: "hollinsford",
    date: { text: "JY 3 1839", source: "postmark", edtf: "1839-07-03" },
    transcription: [
      "My dearest Clara,",
      "We lie at anchor waiting on the tide. Marrable has come aboard and is very low about his affairs. I shall be home by the week's end.",
      "Ever your",
      "Edmund",
    ],
  },
  {
    id: "ASH/003",
    sender: "claraAshdown",
    recipient: "augustinFerrier",
    origin: "hollinsford",
    destination: "lindmouth",
    date: { text: "?1847", source: "annotation", edtf: "1847?" },
    transcription: [
      "Dear Sir,",
      "My husband is very unwell and asks whether you would be so good as to call when next you are this side of the river.",
      "C. Ashdown",
    ],
  },
  {
    id: "ASH/004",
    sender: "augustinFerrier",
    recipient: null,
    origin: "lindmouth",
    destination: null,
    date: { text: "early 1850s", source: "catalogue", edtf: "1850/1853" },
    transcription: [
      "Madam,",
      "I return the herbarium sheets with my thanks. I am sorry to hear the house is to be sold.",
      "A. Ferrier",
    ],
  },
  {
    id: "FER/001",
    sender: "augustinFerrier",
    recipient: "hannahPenhallow",
    origin: "lindmouth",
    destination: "wexcombe",
    date: { text: "Christmas Eve 1851", source: "dateline", edtf: "1851-12-24" },
    transcription: [
      "Dear Mrs Penhallow,",
      "I write to tell you before you should hear it from another that our friend Mrs Ashdown is gone to her sister's at Port Aldwick, and is much recovered.",
      "A. Ferrier",
    ],
  },
  {
    id: "FER/002",
    sender: "augustinFerrier",
    recipient: "thomasMarrable",
    origin: null,
    destination: "portAldwick",
    date: { text: "before 1840", source: "catalogue", edtf: "../1839" },
    transcription: [
      "Marrable —",
      "The Company's accounts will bear any inspection you care to make. I will not answer such a letter again.",
      "Ferrier",
    ],
  },
];
