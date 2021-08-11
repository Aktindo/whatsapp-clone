import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const Message = ({ user, message, newDay }) => {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = ({ children }) =>
    user === userLoggedIn.email ? (
      <div
        className="message-element px-2 py-1 pb-7 w-max rounded-lg m-3 relative text-right ml-auto bg-chatbubble-primary dark:bg-secondary"
        style={{ minWidth: "105px" }}
      >
        {children}
      </div>
    ) : (
      <div
        className="message-element px-2 py-1 pb-7 w-max rounded-lg m-3 relative text-left bg-base-100 whitespace-nowrap"
        style={{ minWidth: "105px" }}
      >
        {children}
      </div>
    );

  dayjs.extend(relativeTime);
  return (
    <div className="main-container cursor-default grid">
      <TypeOfMessage>
        {message?.message}{" "}
        <span
          className={`w-full timestamp text-gray-500 dark:text-gray-300 p-2 text-xs absolute bottom-0 break-words ${
            userLoggedIn.email === user
              ? "text-right right-0 ml-2"
              : "text-left left-0 mr-2"
          }`}
        >
          {message?.timestamp
            ? dayjs(message.timestamp.getTime())
                .fromNow()
                .replace("a few seconds ago", "Just now")
            : "..."}
        </span>
      </TypeOfMessage>
    </div>
  );
};

export { Message };
