import {
  ConnectEmbed,
  ConnectWallet,
  ThirdwebSDK,
  Web3Button,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { CONTRACT_CERTIFY_ADDRESS } from "../lib/constants";
import { getUser } from "./api/auth/[...thirdweb]";
import checkBalance from "../utils/checkbalance";
import { useShowConnectEmbed } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useLogout } from "@thirdweb-dev/react";
import { useEffect } from "react";
import Link from "next/link";
import { cn } from "../utils/cn";
import React from "react";
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
import { Contract } from "ethers";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Joy of Creation",
    description: "Experience the thrill of bringing ideas to life.",
    header: <Skeleton />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
];

const loginOptional = false;
const Profile = ({ userAddress }) => {
  const { logout, isLoading } = useLogout();
  const router = useRouter();

  function onLogout() {
    logout();
    router.push("/login");
  }

  //Get all course
  //   const { contract } = new useContract(CONTRACT_CERTIFY_ADDRESS);

  //   const { data: courses } = useContractRead(contract, "getCourseInfo", [0]);

  //   console.log("courses : ", courses);
  return (
    <>
      <section className="w-full flex justify-center">
        <Web3Button
          contractAddress={CONTRACT_CERTIFY_ADDRESS}
          action={(contract) =>
            contract.call("createCourse", [
              200,
              "ADS",
              "QmcdrLz9b23M67vENAREm6EkhtCUhDGNyuLBLY7J9pXmxx",
              "asdasd",
              "asdasdasd",
            ])
          }
          onSuccess={() => console.log("success")}
        >
          Add
        </Web3Button>
        <div>
          <div class="container px-5 pt-10 mx-auto">
            <div class="flex items-center lg:w-3/5 mx-auto mb-10 border-gray-200 sm:flex-row flex-col">
              <div class="sm:w-20 sm:h-20 h-10 w-10 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                <svg
                  class=" w-12 h-12 text-gray-900 -left-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
                <h2 class="text-gray-100 text-lg title-font font-medium mb-2">
                  Address :{userAddress}
                </h2>
                <div className="flex justify-around">
                  <div>
                    <Link href="#owned">Owned</Link>
                  </div>

                  <div>
                    <Link href="#uploaded">Uploaded</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-2 px-32 ">
        <h1 className="text-4xl font-bold mb-6" id="owned">
          Owned
        </h1>
        <BentoGrid className=" mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
            />
          ))}
        </BentoGrid>
      </div>
      <div className="mt-2 px-32 ">
        <h1 id="uploaded" className="text-4xl font-bold mb-6">
          Uploaded
        </h1>
        <BentoGrid className=" mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
            />
          ))}
        </BentoGrid>
      </div>
    </>
  );
};

export default Profile;

// export default function Profile() {
//   return (
//     <div>
//       <h1>Profile Page</h1>
//       <ConnectWallet />
//     </div>
//   );
// }

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
    props: { userAddress: user.address },
  };
}
