import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import  { Staking } from "../../components/Staking"; // Assuming Staking is default exported

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      <h1>Welcome to Giraffe NFT Minting & Staking App</h1>
      <ConnectEmbed
        client={client}
        chain={chain}
      />
      <Staking />
      <style jsx>{`
        div {
          width: 100%;
          max-width: 500px; /* Adjust as needed */
          margin: 0 auto; /* Center aligns the container */
        }
        h1 {
          font-size: 24px; /* Example font size */
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
