import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    rules: {
      "@next/next/no-css-tags": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off"
    }
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**"]
  }
];

export default config;
