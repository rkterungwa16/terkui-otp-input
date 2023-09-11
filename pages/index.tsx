import Head from "next/head";

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
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OtpInput
          numberOfInputs={5}
          handleCurrentValue={(value) => {
            console.log("value -->>", value);
          }}
        />
      </div>
    </>
  );
}
