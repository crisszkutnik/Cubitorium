import { useParams } from 'react-router-dom';
import { DefaultLayout } from '../../components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { getName } from '../../modules/utils/userDisplayUtils';
import { useUserStore, userSelector } from '../../modules/store/userStore';
import moment from 'moment';
import { useEffect } from 'react';
import { useSolutionStore } from '../../modules/store/solutionStore';
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';
import { useCaseStore } from '../../modules/store/caseStore';
import { UserSolutions } from './infoByUserID/UserSolutions';
import { useLikeStore } from '../../modules/store/likeStore';
import { useAlgorithmsStore } from '../../modules/store/algorithmsStore';

export function InfoByUserID() {
  const { id } = useParams();
  const user = useUserStore(userSelector(id || ''));

  const placeholderImg = '/user_placeholder.png';

  const [loadSolutionsIfNotLoaded, solutionsLoadingState] = useSolutionStore(
    (state) => [state.loadIfNotLoaded, state.loadingState],
  );

  const [loadCasesIfNotLoaded, casesLoadingState] = useCaseStore((state) => [
    state.loadIfNotLoaded,
    state.loadingState,
  ]);

  const [loadLikesIfNotLoaded, likesLoadingState] = useLikeStore((state) => [
    state.loadIfNotLoaded,
    state.loadingState,
  ]);

  const [loadSetsIfNotLoaded, setsLoadingState] = useAlgorithmsStore(
    (state) => [state.loadIfNotLoaded, state.loadingState],
  );

  useEffect(() => {
    loadSolutionsIfNotLoaded();
    loadCasesIfNotLoaded();
    loadLikesIfNotLoaded();
    loadSetsIfNotLoaded();
  }, [likesLoadingState]);

  const hasAllRequiredData = () => {
    return (
      solutionsLoadingState === LoadingState.LOADED &&
      casesLoadingState === LoadingState.LOADED &&
      likesLoadingState === LoadingState.LOADED &&
      setsLoadingState === LoadingState.LOADED
    );
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  const getLocation = () => {
    const location = user?.location;

    if (!location) {
      return 'Unknown';
    }

    if (location.length > 40) {
      return location.slice(0, 37) + '...';
    }

    return location;
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col bg-white drop-shadow py-3 px-6 rounded w-1/4 mr-6 h-fit">
        <div className="flex justify-center">
          <img
            src={user?.profileImgSrc || placeholderImg}
            className="rounded-full w-48 h-48"
          />
        </div>
        <h1 className="font-bold text-accent-dark text-2xl mb-4 mt-3">
          {getName(user)}
        </h1>
        <div className="mb-4">
          <h2 className="font-bold text-accent-dark">WCA ID</h2>
          <div className="text-accent-dark">
            {user?.wcaId ? (
              <a
                href={
                  'https://www.worldcubeassociation.org/persons/' + user.wcaId
                }
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {user.wcaId}
                <FontAwesomeIcon
                  className="ml-2 text-sm"
                  icon={faUpRightFromSquare}
                />
              </a>
            ) : (
              <p>Unknown</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="font-bold text-accent-dark">Location</h2>
          <p className="text-accent-dark">{getLocation()}</p>
        </div>
        <div>
          <h2 className="font-bold text-accent-dark">Birthdate (YYYY-MM-DD)</h2>
          <p className="text-accent-dark">{user?.birthdate || 'Unknown'}</p>
        </div>
      </div>
      <div className="flex flex-col bg-white drop-shadow w-3/4 p-4">
        <div className="flex w-full justify-around">
          <div>
            <h1 className="font-bold text-accent-dark text-2xl">Join date</h1>
            <p className="text-accent-dark text-xl">
              {moment(user?.joinTimestamp).format('DD/MM/YYYY')}
            </p>
          </div>
          <div>
            <h1 className="font-bold text-accent-dark text-2xl">
              Solutions uploaded
            </h1>
            <p className="text-accent-dark text-xl">
              {user?.submittedSolutions || 0}
            </p>
          </div>
          <div>
            <h1 className="font-bold text-accent-dark text-2xl">
              Likes received
            </h1>
            <p className="text-accent-dark text-xl">
              {user?.likesReceived || 0}
            </p>
          </div>
        </div>
        <hr className="w-full h-px my-3" />
        <UserSolutions userPk={id || ''} />
      </div>
    </DefaultLayout>
  );
}
