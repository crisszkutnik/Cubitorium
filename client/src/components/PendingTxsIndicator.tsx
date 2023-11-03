import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@nextui-org/react';
import { useLikeStore } from '../modules/store/likeStore';
import { useAlertContext } from './context/AlertContext';

export function PendingTxsIndicator() {
  const [pendingTxs, clearTxs, commitTxs] = useLikeStore((state) => [
    state.remainingTransactions,
    state.clearTxs,
    state.commitTxs,
  ]);

  const { success, error } = useAlertContext();

  const onClearTxs = () => {
    try {
      clearTxs();
      success('Pending instructions cleared successfully');
    } catch (e) {
      console.error(e);
      error('Fatal error clearing pending instructions');
    }
  };

  const onCommitTxs = async () => {
    try {
      await commitTxs();
      success('Pending instructions committed successfully');
    } catch (e) {
      console.error(e);
      error('Fatal error comitting pending instructions', e);
    }
  };

  if (pendingTxs.length === 0) {
    return <></>;
  }
  //

  return (
    <div className="w-fit h-fit flex flex-col bottom-10 right-10 fixed bg-white drop-shadow-lg p-4 z-50 rounded">
      <div className="flex items-center text-xl">
        <Tooltip
          showArrow={true}
          placement="top"
          content={
            <p className="max-w-md">
              In order to improve user experience we group likes and learning
              status instructions into a single transaction. You can commit or
              cancel them here.
            </p>
          }
        >
          <FontAwesomeIcon className="text-gray-500" icon={faQuestionCircle} />
        </Tooltip>
        <h3 className="ml-2 text-accent-dark">
          You have pending actions waiting to be commited
        </h3>
      </div>

      <div className="flex text-amber-700 bg-amber-100 items-center py-1 px-2 text-sm rounded my-2">
        <FontAwesomeIcon icon={faWarning} />
        <p className="ml-1">
          Be careful! Some functionalities may not fully work without all the
          actions commited!
        </p>
      </div>
      <div>
        <Button onClick={onCommitTxs} color="success" variant="flat">
          Send
        </Button>
        <Button
          onClick={onClearTxs}
          className="ml-3"
          color="danger"
          variant="light"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
