import { ConnectWallet, ThirdwebSDK } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

import Image from "next/image";
import { getUser } from "./api/auth/[...thirdweb]";
import checkBalance from "../utils/checkbalance";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>You have access!</h1>
        <ConnectWallet />
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  console.log("hello");
  const user = await getUser(context.req);
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  console.log("hello " + user);
  const secretKey = process.env.THIRDWEB_SECRET_KEY;

  if (!secretKey) {
    throw new Error("No Secret Key found");
  }

  console.log(process.env.PRIVATE_KEY);

  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "sepolia", {
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });

  const tokenBalance = await checkBalance(sdk, user.address);

  if (tokenBalance.toNumber() === 0) {
    return {
      redirect: {
        destination: "/mint",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
