import React, { useEffect, useState } from "react";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";

const StakeRewards = () => {
    const account = useActiveAccount();
    const [tokenBalanceFormatted, setTokenBalanceFormatted] = useState("");
    const [rewardsFormatted, setRewardsFormatted] = useState("");

    const {
        data: tokenBalance,
        isLoading: isTokenBalanceLoading,
        refetch: refetchTokenBalance,
    } = useReadContract(
        balanceOf,
        {
            contract: REWARD_TOKEN_CONTRACT,
            owner: account?.address || "",
        }
    )
    
    const {
        data: stakedInfo,
        refetch: refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""],
    });

    useEffect(() => {
        refetchStakedInfo();
        refetchTokenBalance();
        const interval = setInterval(() => {
            refetchStakedInfo();
            refetchTokenBalance();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tokenBalance) {
            const formatted = toEther(BigInt(tokenBalance.toString())).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            setTokenBalanceFormatted(formatted);
        }
    }, [tokenBalance]);

    useEffect(() => {
        if (stakedInfo && stakedInfo[1]) {
            const formatted = toEther(BigInt(stakedInfo[1].toString())).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            setRewardsFormatted(formatted);
        }
    }, [stakedInfo]);

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
            {!isTokenBalanceLoading && (
                <p>Giraffe Balance: {tokenBalanceFormatted}</p>
            )}
            <h2 style={{ marginBottom: "20px"}}>Giraffe Rewards: {rewardsFormatted}</h2>
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
