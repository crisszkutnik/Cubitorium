import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";

export function UserActionButton() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownMargin, setDropdownMargin] = useState(0);
  const navigate = useNavigate();

  const onClick = () => {
    setOpen(!open);
  };

  const clickAction = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const values = [
    {
      text: "My info",
      onClick: () => clickAction("/userinfo"),
    },
    {
      text: "My solves",
      onClick: () => clickAction("/userinfo/solves"),
    },
  ];

  useEffect(() => {
    if (!dropdownRef.current) {
      return;
    }

    setDropdownMargin(dropdownRef.current.clientHeight);
  }, [dropdownRef, open]);

  return (
    <>
      <div
        className={
          "flex h-full items-center relative pr-3 z-50" +
          (open ? " drop-shadow" : "")
        }
      >
        <hr className="h-5/6 rounded w-px bg-black/5" />
        <button
          onClick={onClick}
          className="ml-2 flex items-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faUser} />
          <p className="mx-3">Unknown user</p>
          <FontAwesomeIcon icon={open ? faCaretDown : faCaretUp} />
        </button>
        {open && (
          <div
            ref={dropdownRef}
            style={{ bottom: `-${dropdownMargin}px` }}
            className="flex absolute bg-white flex-col w-full bottom-0"
          >
            {values.map(({ text, onClick }, index) => (
              <button
                key={index}
                className={
                  "py-2 hover:bg-accent-primary hover:text-white" +
                  (index !== values.length - 1
                    ? " border-b border-black/5"
                    : "")
                }
                onClick={onClick}
              >
                {text}
              </button>
            ))}
            <WalletDisconnectButton />
          </div>
        )}
      </div>
      {open && (
        <div
          className="absolute bottom-0 left-0 w-full h-full z-40"
          onClick={onClick}
        ></div>
      )}
    </>
  );
}
