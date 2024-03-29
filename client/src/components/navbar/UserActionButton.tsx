import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getName } from '../../modules/utils/userDisplayUtils';
import {
  loggedUserSelector,
  useUserStore,
} from '../../modules/store/userStore';
import {
  selectPrivilegeForUser,
  usePrivilegeStore,
} from '../../modules/store/privilegeStore';

export function UserActionButton() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownMargin, setDropdownMargin] = useState(0);
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const user = useUserStore(loggedUserSelector);
  const privilege = usePrivilegeStore(
    selectPrivilegeForUser(wallet?.publicKey),
  );

  const onClick = () => {
    setOpen(!open);
  };

  const clickAction = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const values = [
    {
      text: 'My profile',
      onClick: () => clickAction('/userinfo/' + wallet?.publicKey),
    },
    {
      text: 'My info',
      onClick: () => clickAction('/userinfo'),
    },
    {
      text: 'My solutions',
      onClick: () => clickAction('/userinfo/solves'),
    },
    {
      text: 'Admin panel',
      onClick: () => clickAction('/adminpanel'),
      requiresAuth: true,
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
          'flex h-full items-center relative pr-3 z-50' +
          (open ? ' drop-shadow' : '')
        }
      >
        <hr className="h-5/6 rounded w-px bg-black/5" />
        <button
          onClick={onClick}
          className="ml-2 flex items-center cursor-pointer"
        >
          {user?.profileImgSrc ? (
            <img
              className="w-6 h-6 rounded-full object-cover"
              src={user.profileImgSrc}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
          <p className="mx-3">{getName(user)}</p>
          <FontAwesomeIcon icon={open ? faCaretDown : faCaretUp} />
        </button>
        {open && (
          <div
            ref={dropdownRef}
            style={{ bottom: `-${dropdownMargin}px` }}
            className="flex absolute bg-white flex-col w-full bottom-0"
          >
            {values
              .filter((v) => {
                if (v.requiresAuth && !privilege) {
                  return false;
                }

                return true;
              })
              .map(({ text, onClick }, index) => (
                <button
                  key={index}
                  className={
                    'py-2 hover:bg-accent-primary hover:text-white' +
                    (index !== values.length - 1
                      ? ' border-b border-black/5'
                      : '')
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
