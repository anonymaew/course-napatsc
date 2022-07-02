import matter from "gray-matter";
import path from "path";

export const pathOf = (paths: string[]) => {
  return path.join(...paths);
};

export const getFilePath = (paths: string[]) => {
  return pathOf([
    "courses",
    paths[0],
    (paths[1]?.split("-")[1] || "index") + ".mdx",
  ]);
};
