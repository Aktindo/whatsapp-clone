import {
  CodeIcon,
  HeartIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

const UserInfo = ({ chat, onCloseButtonClick, hidden }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const removeChat = () => {
    db.collection("chats").doc(chat.id).delete();
    router.push("/");
  };

  return (
    <section
      className={`main-container h-screen transition duration-300 ease-in-out transform translate-x-full ${
        hidden ? "hidden" : "translate-x-0"
      }`}
    >
      <div className="header bg-base-200 sticky z-40 top-0 flex items-center p-4 h-20 border-b-2 border-gray-200 dark:border-base-200 shadow-sm">
        <button
          onClick={onCloseButtonClick}
          className="btn-error btn-sm text-gray-100 btn-circle btn mr-2"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <p className="font-poppins text-lg font-medium">Contact Information</p>
      </div>
      <div className="info bg-base-100 relative w-full h-screen">
        <div className="mt-10 grid justify-center">
          {recipient ? (
            <div className="info__recipient-avatar avatar z-50 justify-center">
              <div className="w-20 h-20 ring ring-primary dark:ring-secondary ring-offset-2 dark:ring-offset-0 rounded-full">
                <img
                  src={recipient?.photoURL}
                  alt={recipientEmail + "'s" + " Avatar"}
                />
              </div>
            </div>
          ) : (
            <div className="info__recipient-avatar avatar placeholder justify-center">
              <div className="bg-neutral text-neutral-content w-20 h-20 ring ring-primary dark:ring-secondary ring-offset-2 dark:ring-offset-0 rounded-full">
                <span className="text-2xl">
                  {recipientEmail[0].toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <p className="font-poppins mt-3 text-lg font-medium text-center">
            {recipient ? recipient.username : recipientEmail}
          </p>
          <p className="text-gray-500 dark:text-gray-300 text-center">
            haha bio go brr
          </p>
          {recipient ? (
            recipient.email === "akshit.singla.dps@gmail.com" ? (
              <div
                className="badge flex cursor-default badge-primary dark:badge-secondary mt-2 tooltip"
                data-tip="This is the official account of the developer."
              >
                <CodeIcon className="w-4 h-4 mr-1" /> Developer Team
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <div className="danger mt-10 grid justify-center">
            <button
              className="btn btn-error text-gray-100 rounded-none"
              onClick={removeChat}
            >
              <TrashIcon className="w-5 h-5 mr-0.5" /> Delete Chat
            </button>
          </div>
          <div className="border-t-2 border-gray-300 dark:border-gray-600 my-5"></div>
          <div className="developer">
            <p className="font-poppins text-center font-medium">
              Developer Notes
            </p>
            <p className="text-gray-500 dark:text-gray-300 text-center">
              Version: v0.0.1-alpha
              <br />
              Build: 1000
              <br />
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="border-t-2 border-gray-300 dark:border-gray-600 my-5"></div>
          <p className="flex">
            Made with <HeartIcon className="w-6 h-6 text-error mx-1" /> by
            <a
              href="https://aktindo.me"
              rel="_noreferrer"
              target="_blank"
              className="link link-primary dark:link-secondary link-hover ml-1"
            >
              @aktindo
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export { UserInfo };
