import { createWithEqualityFn } from 'zustand/traditional';
import { LoadingState } from '../types/loadingState.enum';
import { web3Layer } from '../web3/web3Layer';
import { PublicKey } from '@solana/web3.js';
import {
  LearningStatus,
  ParsedLikeCertificateAccount,
} from '../types/likeCertificate.interface';
import {
  getLikePda,
  getPKFromStringOrObject,
  getRawLearningStatus,
  getSolutionPda,
} from '../web3/utils';
import { useSolutionStore } from './solutionStore';

interface LikeStoreState {
  likesMap: Record<string, ParsedLikeCertificateAccount>;
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadLikes: () => Promise<void>;
  loadIfNotLoaded: () => Promise<void>;
  likeSolution: (
    casePublicKey: string | PublicKey,
    solution: string,
    solutionPk: string | PublicKey,
  ) => Promise<void>;
  removeLike: (
    casePublicKey: string | PublicKey,
    solution: string,
    solutionPk: string | PublicKey,
  ) => Promise<void>;
  setLearningStatus: (
    casePublicKey: string | PublicKey,
    solution: string,
    learningStatus: LearningStatus,
  ) => Promise<void>;
}

export const selectLikeForSolution = (solutionPda: string | PublicKey) => {
  return (state: LikeStoreState): ParsedLikeCertificateAccount | undefined => {
    try {
      const key = getLikePda(
        web3Layer.loggedUserPK,
        getPKFromStringOrObject(solutionPda),
        web3Layer.programId,
      );

      return state.likesMap[key.toString()];
    } catch (e) {
      return undefined;
    }
  };
};

/*
  SOLAMENTE SE CARGAN LOS LIKES DEL
  USUARIO LOGUEADO
*/

export const useLikeStore = createWithEqualityFn<LikeStoreState>(
  (set, get) => ({
    likesMap: {},
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
    loadLikes: async () => {
      try {
        set({ loadingState: LoadingState.LOADING });

        const likes = await web3Layer.loadLikesForUser();

        const likesMap: Record<string, ParsedLikeCertificateAccount> = {};

        likes.forEach((l) => (likesMap[l.publicKey.toString()] = l));

        set({ likesMap });
      } catch (e) {
        console.error(e);
      } finally {
        set({ loadingState: LoadingState.LOADED });
      }
    },
    loadIfNotLoaded: async () => {
      const { loadingState, loadLikes } = get();

      if (loadingState === LoadingState.NOT_LOADED) {
        loadLikes();
      }
    },
    likeSolution: async (
      casePublicKey: string | PublicKey,
      solution: string,
      solutionPk: string | PublicKey,
    ) => {
      const solutionPda = getSolutionPda(
        casePublicKey,
        solution,
        web3Layer.programId,
      );

      await web3Layer.likeSolution(solutionPda);

      const likePda = getLikePda(
        web3Layer.loggedUserPK,
        solutionPda,
        web3Layer.programId,
      );

      const acc = await web3Layer.loadLike(likePda);

      const likesMap = {
        ...get().likesMap,
        [likePda.toString()]: acc,
      };

      set({ likesMap });
      useSolutionStore.getState().incrementSolutionLikes(solutionPk);
    },
    removeLike: async (
      casePublicKey: string | PublicKey,
      solution: string,
      solutionPk: string | PublicKey,
    ) => {
      const solutionPda = getSolutionPda(
        casePublicKey,
        solution,
        web3Layer.programId,
      );

      await web3Layer.removeLike(solutionPda);

      const key = getLikePda(
        web3Layer.loggedUserPK,
        solutionPda,
        web3Layer.programId,
      );

      const likesMap = { ...get().likesMap };
      delete likesMap[key.toString()];

      set({ likesMap });
      useSolutionStore.getState().decrementSolutionLikes(solutionPk);
    },
    setLearningStatus: async (
      casePublicKey: string | PublicKey,
      solution: string,
      learningStatus: LearningStatus,
    ) => {
      const solutionPda = getSolutionPda(
        casePublicKey,
        solution,
        web3Layer.programId,
      );

      await web3Layer.setLearningStatus(learningStatus, solutionPda);

      const key = getLikePda(
        web3Layer.loggedUserPK,
        solutionPda,
        web3Layer.programId,
      );

      const likesMap = { ...get().likesMap };

      const mapKey = key.toString();

      likesMap[mapKey].account.learningStatus =
        getRawLearningStatus(learningStatus);
      likesMap[mapKey].account.parsedLearningStatus = learningStatus;

      set({ likesMap });
    },
  }),
  Object.is,
);
