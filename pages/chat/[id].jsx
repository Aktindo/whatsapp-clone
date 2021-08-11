import Head from "next/head";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { ChatScreen, NewChat, Sidebar, UserInfo } from "../../components";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import EmailValidator from "email-validator";

const Chat = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
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
    <div className="main-container flex overflow-y-hidden">
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar activeChat={chat.id} />
      <NewChat
        onInputChange={(e) => setInput(e.target.value)}
        onInputConfirm={createChat}
      />
      <div className="chat-container flex-1 overflow-x-hidden overflow-y-scroll h-screen scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        <ChatScreen
          chat={chat}
          messages={messages}
          onHeaderClick={() => setUserInfoOpen(!userInfoOpen)}
        />
      </div>
      <UserInfo
        chat={chat}
        onCloseButtonClick={() => setUserInfoOpen(false)}
        hidden={!userInfoOpen}
      />
    </div>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chatRes = await ref.get().catch((error) => {
    return { props: { error: error.message } };
  });
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: { messages: JSON.stringify(messages), chat: chat },
  };
}
