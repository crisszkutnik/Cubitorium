import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicKey } from '@solana/web3.js';
import {
  selectLikeForSolution,
  useLikeStore,
} from '../../modules/store/likeStore';
import { useAlertContext } from '../context/AlertContext';
import { LearningStatus } from './LearningStatus';

interface Props {
  casePk: string | PublicKey;
  solutionPk: string | PublicKey;
  solution: string;
}

export function Like({ casePk, solutionPk, solution }: Props) {
  const [likeSolution, likeAccount, removeLike] = useLikeStore((state) => [
    state.likeSolution,
    selectLikeForSolution(solutionPk)(state),
    state.removeLike,
  ]);

  const { success, error } = useAlertContext();

  const onClick = async () => {
    if (likeAccount) {
      await onClickDislike();
    } else {
      await onClickLike();
    }
  };

  const onClickDislike = async () => {
    try {
      await removeLike(casePk, solution);
      success('Solution disliked successfully');
    } catch (e) {
      console.error(e);
      error('Failed to dislike solution');
    }
  };

  const onClickLike = async () => {
    try {
      await likeSolution(casePk, solution);
      success('Solution liked successfully');
    } catch (e) {
      console.error(e);
      error('Failed to like solution');
    }
  };

  return (
    <div className="flex">
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center mr-4"
      >
        <FontAwesomeIcon
          className={likeAccount ? 'text-amber-400' : 'text-black'}
          icon={likeAccount ? faStarSolid : faStarRegular}
        />
        <p>{likeAccount ? 'Liked' : 'Like'}</p>
      </button>
      {likeAccount && (
        <LearningStatus
          casePk={casePk}
          solution={solution}
          likeAccount={likeAccount}
        />
      )}
    </div>
  );
}
