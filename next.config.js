/** @type {import('next').NextConfig} */
const withImages = require("next-images");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

module.exports = withImages(
  withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    reactStrictMode: false,
  })
);
