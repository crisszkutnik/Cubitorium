import { faCheck, faCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { PublicKey } from '@solana/web3.js';
import {
  LearningStatus as LearningStatusEnum,
  ParsedLikeCertificateAccount,
} from '../../modules/types/likeCertificate.interface';
import { useAlertContext } from '../context/AlertContext';
import {
  selectPendingLearningStatusTx,
  useLikeStore,
} from '../../modules/store/likeStore';
import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';

interface Props {
  casePk: string | PublicKey;
  solutionPk: string | PublicKey;
  solution: string;
  likeAccount?: ParsedLikeCertificateAccount;
  isLiked: boolean;
}

export function LearningStatus({
  casePk,
  solutionPk,
  solution,
  likeAccount,
  isLiked,
}: Props) {
  const { success, error } = useAlertContext();
  const [setLearningStatus, pendingTx] = useLikeStore(
    (state) => [
      state.setLearningStatusTx,
      selectPendingLearningStatusTx(solutionPk)(state),
    ],
    shallow,
  );

  const getColourAndText = (status: string | undefined) => {
    switch (status) {
      case LearningStatusEnum.Learning:
        return { colour: 'warning', text: LearningStatusEnum.Learning };

      case LearningStatusEnum.Learnt:
        return { colour: 'success', text: LearningStatusEnum.Learnt };

      default:
        return { colour: 'danger', text: LearningStatusEnum.NotLearnt };
    }
  };

  const status = useMemo(() => {
    if (pendingTx && pendingTx.learningStatusValue) {
      return pendingTx.learningStatusValue;
    }

    return likeAccount?.account.parsedLearningStatus;
  }, [likeAccount, pendingTx]);

  const getChip = (status: string | undefined) => {
    const { colour, text } = getColourAndText(status);

    return (
      <Chip
        variant="flat"
        classNames={{ content: 'w-20' }}
        color={colour as 'success' | 'danger' | 'warning'}
      >
        {text}
      </Chip>
    );
  };

  const onSetStatus = async (status: LearningStatusEnum) => {
    try {
      await setLearningStatus(casePk, solution, status);
      success('Learning status set correctly');
    } catch (e) {
      console.error(e);
      error('Failed to set learning status', e);
    }
  };

  const classes = 'text-left flex items-center py-1 px-2 rounded-full';

  return (
    <button
      className={
        'flex flex-col items-center justify-center' +
        (isLiked ? '' : ' invisible')
      }
    >
      <Popover placement="bottom" showArrow={true}>
        <PopoverTrigger>{getChip(status)}</PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col text-left w-24">
            <button
              onClick={() => onSetStatus(LearningStatusEnum.Learnt)}
              className={classes + ' hover:bg-green-100'}
            >
              <FontAwesomeIcon
                className="text-success w-3 pr-1"
                icon={faCheck}
              />
              <p>Learnt</p>
            </button>
            <button
              onClick={() => onSetStatus(LearningStatusEnum.Learning)}
              className={classes + ' hover:bg-warning-100'}
            >
              <FontAwesomeIcon
                className="text-warning w-3 pr-1"
                icon={faCircle}
              />
              <p>Learning</p>
            </button>
            <button
              onClick={() => onSetStatus(LearningStatusEnum.NotLearnt)}
              className={classes + ' hover:bg-danger-100'}
            >
              <FontAwesomeIcon
                className="text-danger w-3 pr-1"
                icon={faXmark}
              />
              <p>Not learnt</p>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </button>
  );
}
