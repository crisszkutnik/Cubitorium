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
import { useUserStore } from '../../modules/store/userStore';
import { SolutionAccount } from '../../modules/types/solution.interface';
import { decompress } from '../../modules/utils/compression';

interface Props {
  casePk: string | PublicKey;
  solutionAcc: SolutionAccount;
}

export function Like({ casePk, solutionAcc }: Props) {
  const solution = decompress(solutionAcc.account.moves);
  const solutionPk = solutionAcc.publicKey.toString();

  const [likeSolution, likeAccount, removeLike] = useLikeStore((state) => [
    state.likeSolution,
    selectLikeForSolution(solutionPk)(state),
    state.removeLike,
  ]);

  const isLogged = useUserStore((state) => state.isLogged);

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
      await removeLike(casePk, solutionAcc);
      success('Solution disliked successfully');
    } catch (e) {
      console.error(e);
      error('Failed to dislike solution', e);
    }
  };

  const onClickLike = async () => {
    try {
      await likeSolution(casePk, solutionAcc);
      success('Solution liked successfully');
    } catch (e) {
      console.error(e);
      error('Failed to like solution', e);
    }
  };

  return (
    <div className={'flex' + (!isLogged ? ' invisible' : '')}>
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center mr-4 hover:text-amber-400 w-14"
      >
        <FontAwesomeIcon
          className={
            likeAccount ? 'text-amber-400' : 'text-black hover:text-amber-400'
          }
          icon={likeAccount ? faStarSolid : faStarRegular}
        />
        <p className="text-black">{likeAccount ? 'Liked' : 'Like'}</p>
      </button>
      <LearningStatus
        casePk={casePk}
        solution={solution}
        likeAccount={likeAccount}
      />
    </div>
  );
}
