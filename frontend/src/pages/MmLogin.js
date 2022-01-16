import "../assets/css/templates/mmlogin.scss";
import Button from "../components/atoms/Button";
import metaLogo from "./../assets/img/zorro.png";
import SocialMedia from "../components/molecules/SocialMedia";
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../util/interact.js";
import "assets/css/templates/components/modal.scss";
import { useForm } from "react-hook-form";

function MmLoginPage() {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  const [modalOpen, setModalOpen] = useState(true);
  const [currentModal, setCurrentModal] = useState("almost-there");
  // const [ip, setIP] = useState("");

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

          // once connected, open modal with create account form
          setModalOpen(true);
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
  // the Modal
  const ShowCreateAccountModal = () => {
    // the ip getter note this needs some cors header sent from backend
    const getData = async () => {
      // const res = await axios.get("https://geolocation-db.com/json/");
      // console.log(res.data);
      // setIP(res.data.IPv4);
      // setIP("fake.ip.address.development");
    };
    useEffect(() => {
      getData();
    }, []);
    return (
      <>
        <div className="modal-wrapper">
          <div className="grid place-center">
            <div className="create-account-modal">
              <button
                className="close-modal-button"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                X
              </button>
              {/*  */}
              {/* form starts */}
              {currentModal !== "show-form" ? (
                <>
                  <h1>Ya Casi has llegado</h1>
                  <p className="my-1">
                    Conecta tu cuenta de juego para continuar en el mercado
                  </p>
                  <button
                    className="button"
                    onClick={() => {
                      setCurrentModal("show-form");
                    }}
                  >
                    Crear una nueva cuenta
                  </button>
                </>
              ) : (
                <>
                  <h1>Crear Cuenta</h1>
                  <p className="my-1">
                    Conecta tu cuenta de juego para continuar en el mercado
                  </p>
                  <CreateAccountForm />
                </>
              )}
              {/*  */}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {modalOpen ? <ShowCreateAccountModal /> : ""}
      <div className="vh-100 mm-login">
        <div className="mmlogincenterdiv">
          <h4 className="mmtitle">Conectar Cartera</h4>
          <p className="mmfirstp">
            Conéctese con su billetera disponible o cree una nueva billetera
            para unirse a nuestro mercado
          </p>
          <Button onClick={connectWalletPressed}>
            <img
              src={metaLogo}
              alt="Ingresar con MetaMask"
              width="60"
              className="logo-img"
            />
            <span className="logo-text">
              Iniciar Sesión con <br /> Meta Mask
            </span>
          </Button>
          <p className="mmsecondp">
            No somos propietarios de sus claves privadas y no podemos acceder a
            sus fondos sin su confirmación. Ver término de uso
          </p>
        </div>
        <div className="mediadiv">
          <SocialMedia />
        </div>
      </div>
    </>
  );
}

// form component

const CreateAccountForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const onSubmit = (values) => console.log(values);

  return (
    <form
      className="create-account-form mt-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "INGRESE SU CORREO ELECTRONICO",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Correo invalido",
          },
        })}
      />
      {errors.email && errors.email.message}
      <div className="flex-wrapper justify-center gap-1 my-1">
        <div className="mw-50">
          <input
            type="text"
            placeholder="Ingresa el código"
            {...register("mailcode", {
              required: "Inserte el codigo recibido en la casilla de correo",
            })}
          />
        </div>
        <div>
          <button className="button">Enviar código vía email</button>
        </div>
      </div>
      <button className="button create-acc-button">Crear Cuenta</button>
      <div className="form-terms mt-1">
        Al continuar, acepta los términos de servicio y confirma que ha leído la
        política de privacidad
      </div>
    </form>
  );
};

export default MmLoginPage;