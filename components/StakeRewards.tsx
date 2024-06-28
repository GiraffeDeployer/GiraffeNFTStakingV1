import React, { useEffect } from "react";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";

const StakeRewards = () => {
    const account = useActiveAccount();

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
        const interval = setInterval(() => {
            refetchStakedInfo();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (number) => {
        // Check if number is valid
        if (isNaN(number)) return "";
        
        // Round to two decimal places and add commas
        return Number(number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div style={{ width: "100%", margin: "20px 0", display: "flex", flexDirection: "column" }}>
            {!isTokenBalanceLoading && (
                <p>Giraffe Balance: {formatNumber(toEther(BigInt(tokenBalance!.toString())))}</p>
            )}
            <h2 style={{ marginBottom: "20px"}}>Giraffe Rewards: {stakedInfo && formatNumber(toEther(BigInt(stakedInfo[1].toString())))}</h2>
            <TransactionButton
                transaction={() => (
                    prepareContractCall({
                        contract: STAKING_CONTRACT,
                        method: "claimRewards",
                    })
                )}
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
