import { getUser } from "./api/auth/[...thirdweb]";
import checkBalance from "../utils/checkbalance";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { uploadFileToIPFS } from "../pinata";
import { Web3Button } from "@thirdweb-dev/react";
import { CONTRACT_CERTIFY_ADDRESS } from "../lib/constants";
import { ethers, BigNumber } from "ethers";

const Upload = () => {
  const [imageHash, setImageHash] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [pdfHash, setPdfHash] = useState("");
  const [certificateHash, setCertificateHash] = useState("");

  const handleImage = async (e) => {
    const imageResponse = await uploadFileToIPFS(e.target.files[0]);
    setImageHash(imageResponse.pinataURL);
  };

  const handlePdf = async (e) => {
    const pdfResponse = await uploadFileToIPFS(e.target.files[0]);
    setPdfHash(pdfResponse.pinataURL);
  };

  const handleCertificate = async (e) => {
    const certificateResponse = await uploadFileToIPFS(e.target.files[0]);
    setCertificateHash(certificateResponse.pinataURL);
  };

  function isDecimal(number) {
    return number.includes(".");
  }

  const adjustPrice = (number) => {
    if (isDecimal(number)) {
      setPrice(ethers.utils.parseUnits(number.toString(), "ether"));
    } else {
      setPrice(number);
    }
  };

  useEffect(() => {
    console.log(price);
  }, [price]);

  return (
    <section class="text-gray-100 body-font w-full relative">
      <div class="container  p-10 py-20 bg-gray-800 flex sm:flex-nowrap flex-wrap justify-center">
        <div class=" w-full mx-32">
          <h2 class="text-gray-100 text-center text-3xl mb-1 font-medium title-font">
            Upload Course
          </h2>
          <div class="relative mb-4">
            <label
              for="name"
              class="leading-7 text-2xl text-bold text-gray-100"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div class="relative mb-4">
            <label
              for="message"
              class="leading-7 text-2xl text-bold text-gray-100"
            >
              Description
            </label>
            <textarea
              id="message"
              name="message"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
          <div class="relative mb-4">
            <label
              for="message"
              class="leading-7 text-2xl text-bold text-gray-100"
            >
              Price
            </label>
            <input
              id="message"
              name="message"
              type="number"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                adjustPrice(e.target.value);
              }}
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            ></input>
          </div>
          <label>Upload Thumbnail</label>
          <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handleImage}
          ></input>
          <label>Upload PDF</label>
          <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handlePdf}
          ></input>
          <label>Upload Certificate</label>
          <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handleCertificate}
          ></input>
          {(imageHash === "") | (pdfHash === "") | (certificateHash === "") ? (
            <button
              disabled={
                (imageHash === "") | (pdfHash === "") | (certificateHash === "")
                  ? true
                  : false
              }
              class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Upload
            </button>
          ) : (
            <Web3Button
              contractAddress={CONTRACT_CERTIFY_ADDRESS}
              action={(contract) =>
                contract.call("createCourse", [
                  price,
                  title,
                  description,
                  imageHash,
                  pdfHash,
                  certificateHash,
                ])
              }
              onSuccess={(e) => console.log(e)}
            >
              Upload Data
            </Web3Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Upload;

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
