import { DeviceMobileIcon } from "@heroicons/react/outline";
import { WifiIcon } from "@heroicons/react/solid";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";

// Components
import { Sidebar } from "../components";
import { NewChat } from "../components";
import { auth, db } from "../firebase";

import EmailValidator from "email-validator";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function Home() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email);
  const [input, setInput] = useState("");

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({ users: [user.email, input] });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (doc) =>
        doc.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className="bg-base-100 text-base-content flex font-inter">
      <Head>
        <title>Home | Whatsapp Clone</title>
        <link rel="icon" href="/WhatsApp_Logo.webp" />
      </Head>

      <Sidebar />
      <NewChat
        onInputChange={(e) => setInput(e.target.value)}
        onInputConfirm={createChat}
      />
      <div className="info-container flex-1 h-screen bg-base-200 grid justify-center items-center">
        <div className="info-container__info">
          <div className="flex justify-center">
            <WifiIcon className="w-36 h-36 text-primary dark:text-secondary" />
          </div>
          <p className="text-3xl text-center font-poppins">You are connected</p>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300">
            Feel free to chat with anyone you wish!
          </p>
        </div>
      </div>
    </div>
  );
}
