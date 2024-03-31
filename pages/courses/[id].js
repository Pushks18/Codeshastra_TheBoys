import { useParams } from "next/navigation";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth/[...thirdweb]";
import { ThirdwebSDK } from "@thirdweb-dev/react";
import checkBalance from "../../utils/checkbalance";
import { CONTRACT_CERTIFY_ADDRESS } from "../../lib/constants";
import { useEffect } from "react";
import useTokenContract from "../../hooks/useTokenContract";
import useConnect from "../../hooks/useConnect";
import { ethers } from "ethers";
import Big from "big.js";
import { Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";
import { Document, Page } from "react-pdf";

const IndividualCourse = () => {
  const params = useParams();
  const { connect, account } = useConnect();
  const { contract: x } = useTokenContract();

  const { contract } = new useContract(CONTRACT_CERTIFY_ADDRESS);
  const router = useRouter();

  const { data: course } = useContractRead(contract, "getCourseInfo", [
    params.id,
  ]);

  const { data: enrolledornot } = useContractRead(contract, "checkEnrollment", [
    params.id,
  ]);

  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    console.log(course?.pdfHash);
    if (course?.pdfHash) {
      //   const url = URL.createObjectURL(course?.pdfHash);
      setFileURL(`https://ipfs.io/ipfs/${course.pdfHash}`);
    }
  }, [course]);

  const buy = async (e) => {
    e.preventDefault();
    connect();
    const ethPrice = ethers.utils.parseUnits(
      new Big(ethers.utils.formatEther(course.price)).toString(),
      "ether"
    );
    const transaction = await x.buyCourse(course.courseId, {
      value: ethPrice,
      gasLimit: 3e7,
    });
    await transaction.wait();
  };

  console.log(enrolledornot);
  //   useEffect(() => {
  //     console.log(data.address);
  //   }, []);

  const myCourses = async (e) => {
    e.preventDefault();
    const get = await x.getMyCourses();
    console.log(get);
  };

  return (
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto flex flex-col">
        <div class="lg:w-4/6 mx-auto">
          <div class="rounded-lg h-64 overflow-hidden">
            <img
              alt="content"
              class="object-cover object-center h-full w-full"
              src={`https://ipfs.io/ipfs/` + course?.imageHash}
            />
          </div>
          <div className="flex justify-between items-center px-4">
            <h1 className="text-3xl font-bold text-gray-100 mt-7">
              {course?.title}
            </h1>
            <span className="bg-yellow-400 p-4 my-10 font-bold rounded-lg ">
              Price : {course ? ethers.utils.formatEther(course?.price) : null}{" "}
              ETH
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-300">Description : </h1>
          <h1 className="text-xl">{course?.description}</h1>
          <div className="my-5"></div>
          {enrolledornot ? (
            <button>Already Bought</button>
          ) : (
            <>
              <button
                className="px-8 py-4 font-bold bg-green-400 rounded-lg"
                onClick={buy}
              >
                BUY
              </button>
              {/* <button
                className="px-8 py-4 font-bold ml-4 bg-yellow-400 rounded-lg"
                onClick={myCourses}
              >
                check
              </button> */}
            </>
          )}

          {fileURL && (
            <>
              <h1 className="text-2xl font-bold text-gray-200 mt-8">
                The Content :
              </h1>
              <iframe
                src={fileURL}
                width="100%"
                height="500px"
                className="mt-5 blur-sm"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default IndividualCourse;

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
{
  /* <Web3Button
              contractAddress={CONTRACT_CERTIFY_ADDRESS}
              action={(contract) => contract.call("buyCourse", [params.id])}
              onSuccess={() => console.log("Bought successfully")}
            >
              Buy
            </Web3Button> */
}
