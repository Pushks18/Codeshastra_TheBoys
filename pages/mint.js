import { ConnectWallet, Web3Button, useUser } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../lib/constants";
import { useRouter } from "next/router";

const Mint = () => {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();
  return (
    <div>
      <h1>Mint</h1>
      <ConnectWallet />
      <Web3Button
        contractAddress={CONTRACT_ADDRESS}
        action={(contract) => contract.erc1155.claim(0, 1)}
        onSuccess={() => router.push("/")}
      >
        Claim NFT
      </Web3Button>
    </div>
  );
};

export default Mint;
