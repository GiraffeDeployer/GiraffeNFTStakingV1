import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { useEffect } from "react";
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

    const formatBalance = (balance) => {
        if (typeof balance !== 'undefined') {
            return parseFloat(toEther(BigInt(balance.toString()))).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return "";
    };

    return (
        <div style={{ width: "100%", margin: "20px 0", display: "flex", flexDirection: "column" }}>
            {!isTokenBalanceLoading && (
                <p>Giraffe Balance: {formatBalance(tokenBalance)}</p>
            )}
            <h2 style={{ marginBottom: "20px"}}>Giraffe Rewards: {stakedInfo && formatBalance(stakedInfo[1])}</h2>
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
