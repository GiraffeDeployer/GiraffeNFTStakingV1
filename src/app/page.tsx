import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { Staking } from "../../components/Staking"; // Assuming Staking is default exported

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      margin: "20px auto",
      maxWidth: "90%", // Adjust as needed
    }}>
      <h1>Welcome to Giraffe NFT Minting & Staking App</h1>
      <ConnectEmbed
        client={client}
        chain={chain}
      />
      <Staking />
    </div>
  );
}
