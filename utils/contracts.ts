import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";

const nftContractAddress = "0xc0B5e71c51A1b39b47419B75F26A2492ee73d6F0";
const rewardTokenContractAddress = "0x5E9aFBD222cBbc1ECF3e2cEc79eb94c761d6CA86";
const stakingContractAddress = "0x0cB931c1c5df4c036F874F89335edeFD72E9F25F";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress
});

export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress
});

export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: stakingABI
});
