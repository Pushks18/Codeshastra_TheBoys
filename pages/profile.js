import { ConnectEmbed, ConnectWallet, ThirdwebSDK } from "@thirdweb-dev/react";
import { getUser } from "./api/auth/[...thirdweb]";
import checkBalance from "../utils/checkbalance";
import { useShowConnectEmbed } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useLogout } from "@thirdweb-dev/react";
import { useEffect } from "react";

const loginOptional = false;
const Profile = () => {
  const { logout, isLoading } = useLogout();
  const router = useRouter();

  function onLogout() {
    logout();
    router.push("/login");
  }

  //after clicking on logout button user should be logged out using the logout function and redirected to login page

  return (
    <section className="w-full flex justify-center">
      <div>
        <h1 className="text-slate-700 text-xl">Profile Page</h1>
        <button
          onClick={() => {
            onLogout();
          }}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </section>
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
    props: {},
  };
}
