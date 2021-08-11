const NewChat = ({ onInputChange, onInputConfirm }) => {
  return (
    <div id="new" className="modal">
      <div className="modal-box grid justify-center">
        <p>Please type the email of the user you'd like to chat with...</p>
        <input
          type="text"
          className="input mt-2 input-primary dark:input-secondary input-bordered"
          onChange={onInputChange}
        />
        <div className="modal-action">
          <a
            href="#"
            className="btn btn-primary dark:btn-secondary"
            onClick={onInputConfirm}
          >
            Submit
          </a>
          <a href="#" className="btn btn-error">
            Close
          </a>
        </div>
      </div>
    </div>
  );
};

export { NewChat };
