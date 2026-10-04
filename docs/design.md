# Design decisions

The schema lives in `src/db/migrations/0001_initial.sql`: `letters`, which
reference `correspondents` (people or organisations) and `places`.

## Dates

Historical dates are often vague ("spring 1843", "1826 or 1827", "before
1840"), so each letter stores:

- `date_text`: the date in the words of whoever recorded it, or `NULL` if
  nobody did.
- `date_source`: where `date_text` comes from: `dateline` (the letter itself),
  `postmark`, `endorsement` (a note by the recipient, e.g. "recd. 12 Aug.
  1833"), `annotation` (added later by another hand) or `catalogue` (the
  archivist's date, e.g. "c. 1820"). It is set exactly when `date_text` is.
- `date_edtf`: the cataloguer's reading of the date in
  [EDTF](https://www.loc.gov/standards/datetime/) (ISO 8601-2), the standard
  notation for uncertain dates: "1826 or 1827" is `[1826,1827]`, "before
  1840" is `../1839`, "c. 1820" is `1820~`, "spring 1843" is `1843-21`.
- `date_earliest` / `date_latest`: an inclusive range the letter must fall in,
  as ISO 8601 dates (`YYYY-MM-DD`), derived from `date_edtf` by the date
  module (`src/dates/`). For example, "spring 1843" is `1843-03-01` to
  `1843-05-31`.

ISO dates sort and compare correctly as plain text, so ordering and range
searches need no conversion, and SQLite's date functions understand them. A
`NULL` bound means the range is open on that side: "before 1840" has a latest
date but no earliest. A range always comes from an EDTF value, but an EDTF
value can give no range (`../..`, open at both ends).

The distinction between what the letter says and what was added later is
kept because it is evidence in its own right: readers should be able to tell
a writer's "spring 1843" from an archivist's "1840s". `date_source` describes
`date_text` only, and the range may combine several sources. ASH/001, for
example, is dated "Tuesday 9th June" in its dateline, but its range comes
from the year on the postmark (1846).

EDTF is parsed with [`@edtf-ts/core`](https://github.com/BobPritchett/edtf-ts),
pinned to an exact version as it is pre-1.0. It was chosen over the more
established [`edtf`](https://www.npmjs.com/package/edtf) package because
`edtf` treats seasons as calendar quarters (spring 1843 as January–March) and
ships no TypeScript types.

How each kind of EDTF becomes a range, and how source text is turned into
EDTF, is set out in [`dates.md`](dates.md). Each rule has a test.

## Identifiers

- **Letters** use their catalogue reference (`MAR/001`) as the primary key.
  It is stable, unique and what archivists cite.
- **Correspondents and places** use integer ids assigned by SQLite, because
  their names aren't stable or unique enough to serve as keys.

## Data integrity

The database rejects bad data rather than relying on the import code:

- Tables are `STRICT`, so values of the wrong type are rejected.
- Foreign keys must point at real rows, and a correspondent or place that a
  letter refers to can't be deleted.
- `kind` is limited to `person` or `organisation` by a `CHECK` (SQLite has no
  enum type).
- Dates must be real dates in exactly `YYYY-MM-DD` form, with earliest no later
  than latest, and a range requires an EDTF value. Whether the EDTF itself is
  valid is checked in code, by the date module, not by SQLite.
- Unknown values are `NULL`, never empty strings.

Place names are deliberately not unique: sources spell places differently
("Port Aldwicke" for Port Aldwick), and different places can share a name.

## The site

- **React, rendered at build time.** Components are rendered to static HTML
  with `react-dom/server`, so no JavaScript is sent to the browser. Next.js was
  considered, but would ship a client runtime to pages with no interactivity.
- **Works under any base path.** Every link is relative to the page it is on,
  so the same build works on GitHub Pages (`/letters-archive/`) or elsewhere.
- **Browsing by decade.** A letter appears in every decade its range overlaps,
  marked as _possible_ unless it falls wholly within it, so a decade page never
  misses a letter that may belong there. "1820~" (1818–1822) appears under
  both the 1810s and the 1820s.
- **Accessibility.** Semantic landmarks, a skip link, breadcrumbs and
  `aria-current`, one `h1` per page, `<time datetime>` for single periods, and
  visually hidden labels for compact metadata. Text and links meet WCAG AAA
  contrast in light and dark mode. Nothing relies on colour alone, so
  high-contrast (forced colours) mode works, and there are reduced-motion and
  print styles. Lighthouse scores every page type 100 for accessibility.

## Testing

- Unit tests sit next to the code they test. Integration tests in
  `tests/integration/` cover the schema rules, seeding, queries and the whole
  built site.
- An integration test builds the real archive and validates every page with
  `html-validate` (including its WCAG rules), checks each link and in-page
  anchor resolves, and that every page has one `h1` and its own title.
- Component tests use Testing Library and query by role and accessible name,
  so they check what assistive technology sees rather than markup details.
- Every test must make an assertion (`requireAssertions`).
