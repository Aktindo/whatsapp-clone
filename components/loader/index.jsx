import Image from "next/image";

import { FoldingCube } from "better-react-spinkit";

const Loader = () => {
  return (
    <center className="grid place-items-center h-screen">
      <div className="loader">
        <div className="loader__main mx-auto">
          <Image
            src="/WhatsApp_Logo.webp"
            alt="Whatsapp Logo"
            className="login-container__logo mb-5"
            width={200}
            height={200}
          />
          <FoldingCube color="#25D366" size={60} />
        </div>
      </div>
    </center>
  );
};

export { Loader };
