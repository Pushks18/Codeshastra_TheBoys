import { ConnectWallet, ThirdwebSDK } from "@thirdweb-dev/react";

import { getUser } from "./api/auth/[...thirdweb]";
import { useRouter } from "next/router";
import checkBalance from "../utils/checkbalance";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { CONTRACT_CERTIFY_ADDRESS } from "../lib/constants";
import { cn } from "../utils/cn";
import React from "react";
import { ethers } from "ethers";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Link from "next/link";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const Feed = () => {
  const { contract } = new useContract(CONTRACT_CERTIFY_ADDRESS);
  const router = useRouter();

  const { data: courses } = useContractRead(contract, "getAllCourses", []);

  console.log("courses : ", courses);

  return (
    <div className="mt-6 px-32 ">
      <h1 className="text-4xl font-bold mb-6">Explore</h1>
      <BentoGrid className=" mx-auto">
        {courses &&
          courses.length > 0 &&
          courses.map((course, i) => {
            const imageUrl = "https://ipfs.io/ipfs/" + course.imageHash;
            console.log(course);
            return (
              <Link href={`/courses/` + course.courseId}>
                <BentoGridItem
                  key={i}
                  title={course.title}
                  price={ethers.utils.formatEther(course.price)}
                  header={imageUrl}
                />
              </Link>
            );
          })}
      </BentoGrid>
    </div>
  );
};

export default Feed;

export async function getServerSideProps(context) {
  const user = await getUser(context.req);
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
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
