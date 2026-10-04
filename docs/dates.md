# Dates

Each letter's date is recorded in three forms:

| Field | Example | Produced by |
|---|---|---|
| `date_text` | `1826 or 1827` | as found (dateline, postmark, catalogue…), for display |
| `date_edtf` | `[1826,1827]` | the cataloguer, in [EDTF](https://www.loc.gov/standards/datetime/) (ISO 8601-2) |
| `date_earliest` / `date_latest` | `1826-01-01` / `1827-12-31` | `edtfToRange` (`src/dates/edtf-to-range.ts`), for sorting and querying |

## How EDTF becomes a range

Parsing and base bounds come from [`@edtf-ts/core`](https://github.com/BobPritchett/edtf-ts)
(pinned to an exact version, as it is pre-1.0). `edtfToRange` adds:

| EDTF | Meaning | Range |
|---|---|---|
| `1821-03-14` / `1844-02` / `1843` | day / month / year | that day / month / year |
| `184X` | decade | 1840-01-01 – 1849-12-31 |
| `1832/1835` | interval | both endpoints inclusive |
| `[1826,1827]`, `{1826,1827}` | one of / all of | first to last member |
| `../1839`, `/1839` | open / unknown start | earliest `null` |
| `1839/..`, `1839/` | open / unknown end | latest `null` |
| `1847?` | uncertain | ±1 unit of precision (1846–1848) |
| `1820~` | approximate | ±2 units (1818–1822) |
| `1820%` | both | ±3 units (1817–1823) |
| `1843-21` … `1843-24` | spring … winter | Mar–May, Jun–Aug, Sep–Nov, Dec–Feb (winter runs into the next year) |

- Widening uses whole calendar units of the date's own precision: `1844-02~` is
  December 1843 – April 1844. The margins are the library's search-padding
  multipliers.
- Not widened: qualifiers on interval endpoints (`1820~/1825`) or on single
  components (`1820-?03`).
- Invalid or impossible input (`spring 1843`, `1843-02-30`) throws an
  error with the input in the message.

## Cataloguing conventions (text → EDTF)

- **early / mid / late decade**: an interval of the first / middle / last
  years, e.g. early 1850s → `1850/1853`, late 1830s → `1837/1839`.
- **"before X"**: `../(X-1)`. "Before 1840" excludes 1840.
- **Feast days**: their fixed date (Michaelmas → `MM-09-29`, Christmas Eve →
  `MM-12-24`). Movable feasts (Easter, Whitsun) are out of scope.
- **Evidence other than the dateline**: a postmark gives the exact day. A
  receipt endorsement gives the latest possible day (`../1833-08-12`).
- **Circa and doubt**: "c. 1820" → `1820~`, and a pencilled "?1847" → `1847?`.

The EDTF chosen for each sample letter, with a note where the evidence is
unusual, is in [`src/db/seed-data.ts`](../src/db/seed-data.ts).
