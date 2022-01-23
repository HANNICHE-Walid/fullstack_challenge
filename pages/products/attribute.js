import Link from "next/link";
import API from "../../src/api";
import { useEffect, useState } from "react";

export default function FirstPost() {
  useEffect(() => {
    const init = async () => {
      try {
        const res1 = await API.get("/attributes");
        console.log(res1.data);
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);
  return (
    <>
      <h1>attributes</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <button
        onClick={() => {
          const rdc = async () => {
            try {
              const res1 = await API.post("/attributes", null, {
                params: { random: true },
              });
              console.log(res1.data);
            } catch (err) {
              console.log(err);
            }
          };
          rdc();
        }}
      >
        create 30
      </button>

      <button
        onClick={() => {
          const rdc = async () => {
            try {
              const res1 = await API.delete("/attributes");
              console.log(res1.data);
            } catch (err) {
              console.log(err);
            }
          };
          rdc();
        }}
      >
        delete all
      </button>
    </>
  );
}
