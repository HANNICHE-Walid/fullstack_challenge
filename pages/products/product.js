import Link from "next/link";

export default function FirstPost() {
  return (
    <>
      <h1>products</h1>
      <a href="https://www.freecodecamp.org/">
        <button disabled>freeCodeCamp</button>
      </a>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </>
  );
}
