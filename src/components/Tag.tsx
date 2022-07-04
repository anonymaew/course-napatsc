import Link from "next/link";

const Tag = (props: { name: string }) => {
  return (
    <Link href={`/course?tags=${props.name}`}>
      <span className="underline">{props.name}</span>
    </Link>
  );
};

const Tags = (props: { names: string[] }) => {
  return (
    <>
      {props.names.map((name, index) => (
        <span key={index}>
          <Tag name={name} />
          {index < props.names.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
};

export default Tags;
