// import { getUser } from "./api/auth/[...thirdweb]";
// import checkBalance from "../utils/checkbalance";
// import { ThirdwebSDK } from "@thirdweb-dev/sdk";
// import { useEffect } from "react";
// import { useRouter } from "next/router";

// const Upload = () => {
//   return (
//     <section class="text-gray-100 body-font w-full relative">
//       <div class="container  p-10 py-20 bg-gray-800 flex sm:flex-nowrap flex-wrap justify-center">
//         <div class=" w-full mx-32">
//           <h2 class="text-gray-100 text-center text-3xl mb-1 font-medium title-font">
//             Upload Course
//           </h2>
//           <div class="relative mb-4">
//             <label
//               for="name"
//               class="leading-7 text-2xl text-bold text-gray-100"
//             >
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
//             />
//           </div>

//           <div class="relative mb-4">
//             <label
//               for="message"
//               class="leading-7 text-2xl text-bold text-gray-100"
//             >
//               Description
//             </label>
//             <textarea
//               id="message"
//               name="message"
//               class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
//             ></textarea>
//           </div>
//           <button class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
//             Button
//           </button>
//           <p class="text-xs text-gray-500 mt-3">
//             Chicharrones blog helvetica normcore iceland tousled brook viral
//             artisan.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Upload;

// export async function getServerSideProps(context) {
//   const user = await getUser(context.req);
//   if (!user) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const secretKey = process.env.THIRDWEB_SECRET_KEY;

//   if (!secretKey) {
//     throw new Error("No Secret Key found");
//   }

//   console.log(process.env.PRIVATE_KEY);

//   const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "sepolia", {
//     secretKey: process.env.THIRDWEB_SECRET_KEY,
//   });

//   const tokenBalance = await checkBalance(sdk, user.address);

//   if (tokenBalance.toNumber() === 0) {
//     return {
//       redirect: {
//         destination: "/mint",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { userAddress: user.address },
//   };
// }
