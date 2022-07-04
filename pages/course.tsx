import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CourseHeadProps } from "./[...page]";
import Tags from "../src/components/Tag";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface AllCourseProps {
  list: CourseHeadProps[];
}

interface sortOptionsInterface {
  label: string;
  method: (a: CourseHeadProps, b: CourseHeadProps) => number;
}

const sortOptions: sortOptionsInterface[] = [
  {
    label: "Newest",
    method: (a: CourseHeadProps, b: CourseHeadProps): number =>
      new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime(),
  },
  {
    label: "Oldest",
    method: (a: CourseHeadProps, b: CourseHeadProps) =>
      new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime(),
  },
  {
    label: "A-Z",
    method: (a: CourseHeadProps, b: CourseHeadProps) =>
      a.title.localeCompare(b.title),
  },
  {
    label: "Z-A",
    method: (a: CourseHeadProps, b: CourseHeadProps) =>
      b.title.localeCompare(a.title),
  },
];

const AllCoursePage = (props: AllCourseProps) => {
  const router = useRouter();
  const [sortType, setSortType] = useState<sortOptionsInterface | undefined>(
    undefined
  );
  const [filter, setFilter] = useState<string[]>([]);
  const [courseList, setCourseList] = useState<CourseHeadProps[]>(props.list);

  useEffect(() => {
    setSortType(sortOptions[0]);
  }, []);

  useEffect(() => {
    if (router.query.tags) {
      const tags = router.query.tags;
      if (typeof tags === "string") setFilter([tags]);
      else setFilter(tags);
    }
  }, [router]);

  useEffect(() => {
    let newList = props.list.filter((course) =>
      filter.every((tag) => course.tags.includes(tag))
    );
    if (sortType !== undefined) newList.sort(sortType.method);

    setCourseList(newList);
  }, [sortType, filter]);

  return (
    <div className="">
      <h1 className="mb-10 text-5xl font-extrabold text-emerald-400">
        Explore courses
      </h1>
      <div className="pl-10">
        <label htmlFor="sortMethod">
          Sort by:
          <select
            id="sortMethod"
            name="sortMethod"
            onChange={(e) => {
              setSortType(
                sortOptions.find((option) => option.label === e.target.value)
              );
            }}
            className="border rounded-sm border-gray-500 p-1 m-3 bg-transparent placeholder-gray-500 focus:outline-none"
          >
            {sortOptions.map((option, index) => {
              return (
                <option key={index} value={option.label}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 auto-rows-fr sm:grid-cols-2 max-w-md sm:max-w-none mx-auto my-10 py-10 border-y-2 border-slate-500">
        {courseList.map((topic, index) => {
          return (
            <Link href={topic.link.link} key={index}>
              <div className="flex flex-col justify-between border border-slate-500 rounded-md m-4 hover:scale-110 transition-all duration-300 cursor-pointer">
                <div>
                  <div className="relative w-full aspect-video">
                    <Image
                      className="rounded-t-md"
                      src="/test.jpg"
                      layout="fill"
                      objectFit="cover"
                      objectPosition={"50% 50%"}
                    />
                  </div>
                  <div className="p-4">
                    <p className="underline text-white text-right sm:text-left">
                      {topic.link.title}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0 flex flex-col text-xs text-right">
                  <p>
                    <Tags names={topic.tags} />
                  </p>
                  <p>
                    {topic.authors.map((author, index) => {
                      return (
                        <span key={index}>
                          <Link href={author.link}>{author.name}</Link>
                          {index < topic.authors.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                  </p>
                  <p>
                    {`${new Date(topic.dateModified).toLocaleDateString(
                      "en-EN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}`}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const courseList = fs.readdirSync("courses");
  const list = courseList.map((course) => {
    const lessonPath = path.join("courses", course, "index.mdx");
    const meta = matter(fs.readFileSync(lessonPath, "utf8")).data;
    const stats = fs.statSync(lessonPath);
    return {
      title: meta.title,
      courseId: course,
      link: {
        title: meta.title,
        link: `/${course}`,
      },
      tags: meta.tags,
      dateModified: stats.mtime.toUTCString(),
      dateCreated: stats.birthtime.toUTCString(),
      authors: meta.authors,
    };
  });
  return {
    props: {
      list,
    },
  };
};

export default AllCoursePage;
