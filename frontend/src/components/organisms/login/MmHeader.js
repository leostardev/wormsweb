import { useEffect, useState } from "react";
import Logo from "./../../atoms/Logo";
import Button from "./../../atoms/Button";
import "./../../../assets/css/templates/header-login.scss";
import {
  connectWallet,
  getCurrentWalletConnected,
} from "../../../util/interact.js";

function MmHeader() {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a
            target="_blank"
            href={`https://metamask.io/download.html`}
            rel="noreferrer"
          >
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  return (
    <>
      <header>
        <div className="header flex-wrapper">
          <div className="header-left">
            <Logo alt="Space Worms" className="img-logo" />
          </div>
          <div className="header-right">
            <div className="mm-connect-area">
              <Button onClick={connectWalletPressed} className="mm-connect">
                {walletAddress.length > 0 ? (
                  "Conectada: " +
                  String(walletAddress).substring(0, 6) +
                  "..." +
                  String(walletAddress).substring(38)
                ) : (
                  <span>CONECTAR BILLETERA</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default MmHeader;