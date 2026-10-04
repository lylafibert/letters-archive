/** @type {import("html-validate").ConfigData} */
export default {
  extends: ["html-validate:recommended"],
  rules: {
    // React writes void elements as <meta /> and some attributes in camelCase (charSet, dateTime).
    "void-style": ["error", { style: "selfclose" }],
    "attr-case": ["error", { style: ["lowercase", "camelcase"] }],
    // A search-snippet guideline; full descriptive titles serve screen-reader users better.
    "long-title": "off",
  },
};
