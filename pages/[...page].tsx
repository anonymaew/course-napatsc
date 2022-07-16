import Link from "next/link";
import Head from "next/head";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  HashtagIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { useEffect } from "react";
import { useUser } from "../src/functions/Firebase";
import { useRouter } from "next/router";

interface PageParams {
  params: {
    page: string[];
  };
}

interface Hyperlink {
  title: string;
  link: string;
}

enum PropsType {
  Lesson,
  Course,
  AllCourse,
}

interface LessonProps {
  type: PropsType.Lesson;
  title: string;
  courseId: string;
  tags: string[];
  dateModified: string;
  dateCreated: string;
  authors: {
    name: string;
    link: string;
  }[];
  readingTime: string;
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  next: Hyperlink | null;
  prev: Hyperlink | null;
}

export interface CourseHeadProps {
  title: string;
  courseId: string;
  link: Hyperlink;
  tags: string[];
  dateModified: string;
  dateCreated: string;
  authors: {
    name: string;
    link: string;
  }[];
}

interface CourseProps extends CourseHeadProps {
  type: PropsType.Course;
  readingTime: string;
  content: MDXRemoteSerializeResult<Record<string, unknown>>;
  list: {
    topic: Hyperlink;
    subtopic: Hyperlink[];
  }[];
}

interface AllCourseProps {
  type: PropsType.AllCourse;
  list: CourseHeadProps[];
}

const NextImage = (props: any) => {
  return (
    <div className="mx-auto max-w-lg">
      <Image
        {...require(`../courses/${props.courseId}/img/${props.src}`).default}
        alt={props.alt}
      />
      <p className="text-sm text-center text-slate-500">{props.alt}</p>
    </div>
  );
};

export const NextLink = (props: any) => {
  return (
    <Link href={props.href}>
      <a>{props.children}</a>
    </Link>
  );
};

export const Youtube = (props: any) => {
  return (
    <div>
      <div>
        <iframe
          width="720"
          height="405"
          src={props.src}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const Authors = (props: { authors: { name: string; link: string }[] }) => {
  return (
    <>
      {props.authors.map((author, index) => {
        return (
          <span key={index}>
            <Link href={author.link}>{author.name}</Link>
            {index < props.authors.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </>
  );
};

export const components = (courseId: string) => ({
  img: (props: any) => <NextImage {...props} courseId={courseId} />,
  a: NextLink,
  Youtube: Youtube,
});

const CoursePage = (props: LessonProps | CourseProps) => {
  const user = useUser();
  const router = useRouter();

  return (
    <article className="prose prose-lg prose-invert prose-headings:text-emerald-400 prose-code:leading-6 prose-code:font-normal prose-code:bg-zinc-700 prose-code:p-1 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-transparent prose-pre:p-0">
      {user === undefined ? (
        <p className="text-center">Loading</p>
      ) : user === null && props.type === PropsType.Lesson ? (
        <>
          <p className="text-center">
            You are not authorized to access lesson pages, please{" "}
            <Link href="/login">login</Link> first.
          </p>
          <div className="my-10 text-center">
            {props.type === PropsType.Lesson ? (
              <Link href={`/${props.courseId}`}>Back to the course page</Link>
            ) : (
              <Link href="/course">Back to the main page</Link>
            )}
          </div>
        </>
      ) : (
        <>
          <header>
            <h1>{props.title}</h1>
            <div className="pl-10 text-sm">
              <HashtagIcon className="inline w-4 t-4 mb-1 mr-4 text-emerald-400" />
              {props.tags.map((tag, index) => {
                return (
                  <span key={index}>
                    <a href={`/tags/${tag}`}>{tag}</a>
                    {index < props.tags.length - 1 ? ", " : ""}
                  </span>
                );
              })}
              <br />
              <time dateTime={props.dateModified}>
                <CalendarIcon className="inline w-4 t-4 mb-1 mr-4 text-emerald-400" />
                {`${new Date(props.dateModified).toLocaleDateString("en-EN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`}
              </time>
              <br />
              <address>
                <UsersIcon className="inline w-4 t-4 mb-1 mr-4 text-emerald-400" />
                <Authors authors={props.authors} />
              </address>
              <ClockIcon className="inline w-4 t-4 mb-1 mr-4 text-emerald-400" />
              {props.readingTime}
            </div>
          </header>
          <main className="my-10 py-10 border-y-2 border-slate-500">
            <MDXRemote
              {...props.content}
              components={components(props.courseId)}
            />
            {props.type === PropsType.Course ? (
              <div>
                <h2>Contents list</h2>
                <ol>
                  {props.list.map((topic, index) => {
                    return (
                      <div key={index}>
                        <li>
                          <Link href={topic.topic.link}>
                            {topic.topic.title}
                          </Link>
                        </li>
                        <ul className="leading-4">
                          {topic.subtopic.map((subtopic, index) => {
                            return (
                              <li key={index}>
                                <Link href={subtopic.link}>
                                  {subtopic.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </ol>
              </div>
            ) : (
              <></>
            )}
          </main>
          <div className="grid grid-flow-col">
            <div className="col-span-3 pr-5">
              {props.type === PropsType.Lesson && props.prev ? (
                <Link href={props.prev.link}>
                  {"Previous: " + props.prev.title}
                </Link>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-3 pl-5 text-right">
              {props.type === PropsType.Lesson && props.next ? (
                <Link href={props.next.link}>
                  {"Next: " + props.next.title}
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="my-10 text-center">
            {props.type === PropsType.Lesson ? (
              <Link href={`/${props.courseId}`}>Back to the course page</Link>
            ) : (
              <Link href="/course">Back to the main page</Link>
            )}
          </div>
        </>
      )}
    </article>
  );
};

export const fileNameToUrl = (fileName: string) => {
  if (fileName === "index.mdx") return "";
  const name = fileName.split(".")[0];
  if (name.length == 2) return `lesson-${name}`;
  else return `lesson-${name.substring(0, 2)}-${name.substring(2)}`;
};

const urlToFilename = (url: string) => {
  if (url === "") return "index.mdx";
  const name = url.split("-").slice(1);
  if (name.length == 1) return `${name[0]}.mdx`;
  else return `${name[0]}${name[1]}.mdx`;
};

export const charactersToReadingTime = (num: number) => {
  const readMax = Math.floor(num / 900) + 1;
  const readMin = Math.floor(num / 1200);
  if (readMin == 0) return `less than 1 minute`;
  else return `${readMin}-${readMax} minutes`;
};

export const getStaticProps = async ({
  params,
}: PageParams): Promise<{ props: LessonProps | CourseProps } | undefined> => {
  const coursePath = path.join("courses", params.page[0]);
  const fileList = fs.readdirSync(coursePath);
  fileList.pop();
  fileList.pop();
  switch (params.page.length) {
    case 1: {
      const lessonPath = path.join(coursePath, "index.mdx");
      const { data: meta, content } = matter(
        fs.readFileSync(lessonPath, "utf8")
      );
      const stats = fs.statSync(lessonPath);
      const mdx = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      });
      let lessonList: { topic: Hyperlink; subtopic: Hyperlink[] }[] = [];
      for (let fileName of fileList) {
        let fileNumber = fileName.split(".")[0];
        if (fileNumber.length == 2)
          lessonList.push({
            topic: {
              title: matter(
                fs.readFileSync(path.join(coursePath, fileName), "utf8")
              ).data.title,
              link: `/${params.page[0]}/${fileNameToUrl(fileName)}`,
            },
            subtopic: [],
          });
        else if (fileNumber.length == 4)
          lessonList[lessonList.length - 1].subtopic.push({
            title: matter(
              fs.readFileSync(path.join(coursePath, fileName), "utf8")
            ).data.title,
            link: `/${params.page[0]}/${fileNameToUrl(fileName)}`,
          });
      }
      return {
        props: {
          type: PropsType.Course,
          link: {
            title: meta.title,
            link: `/${params.page[0]}`,
          },
          title: meta.title,
          courseId: params.page[0],
          tags: meta.tags,
          dateModified: stats.mtime.toUTCString(),
          dateCreated: stats.birthtime.toUTCString(),
          authors: meta.authors,
          readingTime: charactersToReadingTime(content.length),
          content: mdx,
          list: lessonList,
        },
      };
    }

    case 2: {
      const lessonPath = path.join(coursePath, urlToFilename(params.page[1]));
      const orderNumber = fileList.findIndex(
        (file) => file === urlToFilename(params.page[1])
      );
      const { data: meta, content } = matter(
        fs.readFileSync(lessonPath, "utf8")
      );
      const stats = fs.statSync(lessonPath);
      const mdx = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      });
      return {
        props: {
          type: PropsType.Lesson,
          title: meta.title,
          courseId: params.page[0],
          tags: matter(
            fs.readFileSync(path.join(coursePath, "index.mdx"), "utf8")
          ).data.tags,
          dateModified: stats.mtime.toUTCString(),
          dateCreated: stats.birthtime.toUTCString(),
          authors: meta.authors,
          readingTime: charactersToReadingTime(content.length),
          content: mdx,
          next:
            orderNumber !== null && orderNumber !== fileList.length - 1
              ? {
                  title: matter(
                    fs.readFileSync(
                      path.join(coursePath, fileList[orderNumber + 1]),
                      "utf8"
                    )
                  ).data.title,
                  link: `/${params.page[0]}/${fileNameToUrl(
                    fileList[orderNumber + 1]
                  )}`,
                }
              : null,
          prev:
            orderNumber !== null && orderNumber !== 0
              ? {
                  title: matter(
                    fs.readFileSync(
                      path.join(coursePath, fileList[orderNumber - 1]),
                      "utf8"
                    )
                  ).data.title,
                  link: `/${params.page[0]}/${fileNameToUrl(
                    fileList[orderNumber - 1]
                  )}`,
                }
              : null,
        },
      };
    }
    default: {
      return undefined;
    }
  }
};

export const getStaticPaths = async () => {
  let paths: PageParams[] = [];
  fs.readdirSync(path.join("courses")).forEach((course) => {
    fs.readdirSync(path.join("courses", course)).forEach((filename) => {
      if (filename === "img") return;
      const page = fileNameToUrl(filename);
      paths.push({
        params: {
          page: page === "" ? [course] : [course, page],
        },
      });
    });
  });
  return {
    paths: paths,
    fallback: false,
  };
};

export default CoursePage;
