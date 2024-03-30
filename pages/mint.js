import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../lib/constants";

const Mint = () => {
  return (
    <div>
      <h1>Mint</h1>
      <ConnectWallet />
      <Web3Button
        contractAddress={CONTRACT_ADDRESS}
        action={(contract) => contract.erc1155.claim(0, 1)}
      >
        Claim NFT
      </Web3Button>
    </div>
  );
};

export default Mint;
