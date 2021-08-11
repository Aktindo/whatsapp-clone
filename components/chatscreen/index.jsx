import {
  ArrowDownIcon,
  ChevronDownIcon,
  PaperClipIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { Message } from "../index";
import { Picker } from "emoji-mart";
import { LockClosedIcon, MicrophoneIcon } from "@heroicons/react/solid";
import firebase from "firebase";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "../../utils/getRecipientEmail";
import Timeago from "react-timeago";
import FoldingCube from "better-react-spinkit/dist/FoldingCube";

function Chatscreen({ chat, messages, onHeaderClick }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const endOfMessagesRef = useRef(null);

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesSnapshot]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.email,
      message: input,
      photoURL: user.photoURL,
      receiverHasRead: false,
    });

    setInput("");
    scrollToBottom();
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs?.map((message) => {
        return (
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate(),
            }}
          />
        );
      });
    } else {
      return (
        <div className="flex justify-center">
          <FoldingCube color="#25D366" size={30} />
        </div>
      );
    }
  };

  return (
    <div className="main-container">
      <div className="cursor-pointer header bg-base-200 sticky z-40 top-0 flex items-center p-4 h-20 border-b-2 border-gray-200 dark:border-base-200 shadow-sm">
        {recipient ? (
          <div className="header__recipient-avatar avatar">
            <div className="w-12 h-12 rounded-full">
              <img
                src={recipient?.photoURL}
                alt={recipientEmail + "'s" + " Avatar"}
              />
            </div>
          </div>
        ) : (
          <div className="header__recipient-avatar avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 h-12 rounded-full">
              <span className="text-2xl">
                {recipientEmail[0].toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div className="header__information ml-2 flex-1">
          <h3 className="text-xl font-semibold mb-1 font-poppins">
            {recipient ? recipient.username : recipientEmail}
          </h3>
          {recipientSnapshot ? (
            recipient?.lastSeen?.toDate() ? (
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Last active: <Timeago date={recipient?.lastSeen?.toDate()} />
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Last active: Unavailable
              </p>
            )
          ) : (
            "..."
          )}
        </div>
        <div className="header__icons">
          <button onClick={onHeaderClick} className="btn btn-ghost btn-circle">
            <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </button>
          <button
            className="btn btn-circle btn-ghost"
            type="button"
            onClick={scrollToBottom}
          >
            <ArrowDownIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
      </div>
      <div className="message-container p-8 min-h-screen px-5 lg:px-20 bg-chatscreen dark:bg-base-200">
        <div
          className="end-to-end-notification p-2 rounded-md mx-auto max-w-lg"
          style={{ backgroundColor: "#FEF3C5" }}
        >
          <div className="flex dark:text-gray-600">
            <LockClosedIcon className="w-7 text-gray-500 dark:text-gray-600 mr-1" />
            <p className="text-sm">
              Messages are end-to-end encrypted. No one outside of this chat,
              not even WhatsApp, can read or listen to them. Click to learn
              more.
            </p>
          </div>
        </div>
        {showMessages()}
        <div
          className="message-container__end-of-message mt-16 float-left clear-both"
          ref={endOfMessagesRef}
        ></div>
      </div>
      <form className="input-container grid items-center sticky bottom-0 bg-base-200 z-50 p-2 border-transparent">
        <div className="w-full bg-chatscreen border-chatscreen">
          {emojiPickerOpen && (
            <Picker
              title=""
              emoji=""
              style={{
                zIndex: "10",
                marginBottom: "75px",
                position: "fixed",
                bottom: "0",
              }}
              set="facebook"
              onSelect={(emoji) => {
                setInput(input + emoji.native);
                setEmojiPickerOpen(false);
              }}
              color="#25D366"
            />
          )}
        </div>

        <span className="flex">
          <button
            type="button"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            className="btn btn-ghost btn-circle"
          >
            <EmojiHappyIcon className="w-6 h-6 text-gray-500" />
          </button>
          <input
            type="text"
            className="input bg-white dark:bg-base-100 rounded-full flex-1 items-center p-3 sticky mx-2"
            value={input}
            placeholder="Type a message"
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setEmojiPickerOpen(false)}
          />
          <button type="submit" onClick={sendMessage} disabled={!input} hidden>
            Send
          </button>
        </span>
      </form>
    </div>
  );
}

export { Chatscreen as ChatScreen };
