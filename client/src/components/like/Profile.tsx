import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../../modules/web3/utils';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@nextui-org/react';

interface Props {
  author: PublicKey | string;
}

export function Profile({ author }: Props) {
  const navigate = useNavigate();

  const onUserProfileClick = () => {
    navigate('/userinfo/' + getStringFromPKOrObject(author));
  };

  return (
    <div className="mr-4">
      <Tooltip content="Go to the profile of the submitter">
        <button
          className="flex flex-col items-center justify-center"
          onClick={onUserProfileClick}
        >
          <FontAwesomeIcon icon={faUser} />
          <p>Author</p>
        </button>
      </Tooltip>
    </div>
  );
}
