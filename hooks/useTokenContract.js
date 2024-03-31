import CertifyToken from "./CertifyToken.json";
import { ethers } from "ethers";

const ContractABI = CertifyToken.abi;
const ContractAddess = "0x841e4E4cC5cC67BF00e564382F6623022f905bfA";
const Ethereum = typeof window !== "undefined" && window.ethereum;

const useTokenContract = () => {
  const provider = new ethers.providers.Web3Provider(Ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ContractAddess, ContractABI, signer);
  return { contract };
};

export default useTokenContract;
