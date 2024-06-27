import React, { useEffect } from "react";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc721";

export const StakeRewards = () => {
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
    );
    
    const {
        data: stakedInfo,
        refetch: refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            refetchStakedInfo();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [refetchStakedInfo]);

    const formatBalance = (balance: number | string | bigint) => {
        // Round balance to 2 decimal places
        const roundedBalance = Number(balance).toFixed(2);
        // Add commas to separate thousands
        return roundedBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div style={{ width: "100%", margin: "20px 0", display: "flex", flexDirection: "column" }}>
            {!isTokenBalanceLoading && tokenBalance && (
                <p>Giraffe Wallet Balance: {formatBalance(toEther(BigInt(tokenBalance.toString())))}</p>
            )}
            <h2 style={{ marginBottom: "20px"}}>Giraffe Rewards Balance: {stakedInfo && formatBalance(toEther(BigInt(stakedInfo[1].toString())))}</h2>
            <TransactionButton
                transaction={() => (
                    prepareContractCall({
                        contract: STAKING_CONTRACT,
                        method: "claimRewards",
                    })
                )}
                onTransactionConfirmed={() => {
                    alert("Rewards claimed!");
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