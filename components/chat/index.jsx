import { CheckIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import localizedFormat from "dayjs/plugin/localizedFormat";

const Chat = ({ id, users, activeChat }) => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const recipientEmail = getRecipientEmail(users, user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail || "")
  );
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const message = messagesSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  dayjs.extend(localizedFormat);
  return (
    <div
      onClick={enterChat}
      className={`container flex items-center cursor-pointer break-words p-2 hover:bg-base-200 transition duration-300 ease-in-out${
        activeChat === id ? " bg-base-200 hover:bg-base-200" : ""
      }`}
    >
      {recipient ? (
        <div>
          <div className="recipient-avatar avatar m-1 mr-4">
            <div className="w-12 h-12 ring ring-primary dark:ring-secondary ring-offset-2 dark:ring-offset-0 rounded-full">
              <img
                src={recipient?.photoURL}
                alt={recipientEmail + "'s" + " Avatar"}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="recipient-avatar avatar placeholder m-1 mr-4">
          <div className="bg-neutral text-neutral-content w-12 h-12 ring ring-primary dark:ring-offset-0 dark:ring-secondary ring-offset-2 rounded-full">
            <span className="text-2xl font-medium">
              {recipientEmail?.[0].toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <div className="grid w-full">
        <div>
          <span className="font-poppins font-medium text-sm md:text-base">
            {recipient && recipient.username && recipient.username.length
              ? recipient.username
              : recipientEmail}
          </span>
          {message ? (
            <>
              <div className="text-sm text-gray-400 flex items-center justify-between">
                <p className="flex">{message?.message}</p>
                <p className="mb-auto">
                  {message?.timestamp
                    ? dayjs(message.timestamp.toDate()).format("LT")
                    : "..."}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-400 flex items-center justify-between">
                <p className="flex">This chat is encrypted.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { Chat };
