import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import { OtpInput } from "../src";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Terk UI OTP input" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OtpInput
        numberOfInputs={5}
        handleCurrentValue={(value) => {
          console.log("value -->>", value);
        }}
      />
    </>
  );
}
