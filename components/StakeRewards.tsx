import React, { useEffect, useState } from "react";
import {
    TransactionButton,
    useActiveAccount,
    useReadContract,
    prepareContractCall,
} from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { toEther } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";

const StakeRewards: React.FC = () => {
    const account = useActiveAccount();
    const [tokenBalance, setTokenBalance] = useState<string>("");
    const [stakedInfo, setStakedInfo] = useState<any>(null);

    const { refetch: refetchTokenBalance } = useReadContract<string>({
        contract: REWARD_TOKEN_CONTRACT,
        query: balanceOf,
        args: [account?.address || ""],
        onData: setTokenBalance,
        pollInterval: 1000,
    });

    const { refetch: refetchStakedInfo } = useReadContract<any>({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        args: [account?.address || ""],
        onData: setStakedInfo,
        pollInterval: 1000,
    });

    useEffect(() => {
        refetchTokenBalance();
        refetchStakedInfo();
    }, [refetchTokenBalance, refetchStakedInfo]);

    const handleClaimRewards = async () => {
        try {
            await prepareContractCall({
                contract: STAKING_CONTRACT,
                method: "claimRewards",
            })();
            alert("Rewards claimed!");
            refetchStakedInfo();
            refetchTokenBalance();
        } catch (error) {
            console.error("Error claiming rewards:", error);
        }
    };

    return (
        <div style={{ width: "100%", margin: "20px 0", display: "flex", flexDirection: "column" }}>
            {tokenBalance === "" ? (
                <p>Loading token balance...</p>
            ) : (
                <p>Giraffe Balance: {toEther(BigInt(tokenBalance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            )}
            {!stakedInfo ? (
                <p>Loading staked info...</p>
            ) : (
                <h2 style={{ marginBottom: "20px"}}>Giraffe Rewards: {toEther(BigInt(stakedInfo[1])).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            )}
            <TransactionButton
                transaction={handleClaimRewards}
                onTransactionConfirmed={() => {
                    alert("Rewards claimed!")
                    refetchStakedInfo();
                    refetchTokenBalance();
                }}
                style={{
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "12px"
                }}
            >
                Claim Rewards
            </TransactionButton>
        </div>
    );
};

export default StakeRewards;
