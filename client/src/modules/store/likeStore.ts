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
import { useUserStore } from './userStore';
import { SolutionAccount } from '../types/solution.interface';
import { decompress } from '../utils/compression';
import { TooManyPendingTransactions } from '../utils/TooManyPendingTransactions';

export enum TransactionType {
  LIKE_ADD = 'like_add',
  LIKE_REMOVE = 'like_remove',
  LEARNING_STATUS = 'learningStatus',
}

export interface PendingTransaction {
  type: TransactionType;
  solutionPda: PublicKey;
  solutionAccount?: SolutionAccount;
  learningStatusValue?: LearningStatus;
}

interface LikeStoreState {
  likesMap: Record<string, ParsedLikeCertificateAccount>;
  loadingState: LoadingState;
  remainingTransactions: PendingTransaction[];
  setLoadingState: (loadingState: LoadingState) => void;
  loadLikes: () => Promise<void>;
  loadIfNotLoaded: () => Promise<void>;
  likeSolutionTx: (
    casePublicKey: string | PublicKey,
    solutionAcc: SolutionAccount,
  ) => Promise<void>;
  dislikeSolutionTx: (
    casePublicKey: string | PublicKey,
    solutionAcc: SolutionAccount,
  ) => Promise<void>;
  setLearningStatusTx: (
    casePublicKey: string | PublicKey,
    solution: string,
    learningStatus: LearningStatus,
  ) => Promise<void>;
  clearTxs: () => void;
  commitTxs: () => Promise<void>;
  reset: () => void;
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

export const selectPendingLikeOrDislikeTx = (
  solutionPda: string | PublicKey,
) => {
  return (state: LikeStoreState) => {
    const pk = getPKFromStringOrObject(solutionPda);

    return state.remainingTransactions.find(
      (t) =>
        (t.type === TransactionType.LIKE_ADD ||
          t.type === TransactionType.LIKE_REMOVE) &&
        t.solutionPda.equals(pk),
    );
  };
};

export const selectPendingLearningStatusTx = (
  solutionPda: string | PublicKey,
) => {
  return (state: LikeStoreState) => {
    const pk = getPKFromStringOrObject(solutionPda);

    return state.remainingTransactions.find(
      (t) =>
        t.type === TransactionType.LEARNING_STATUS && t.solutionPda.equals(pk),
    );
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
    remainingTransactions: [],
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
    likeSolutionTx: async (
      casePublicKey: string | PublicKey,
      solutionAcc: SolutionAccount,
    ) => {
      const solution = decompress(solutionAcc.account.moves);

      const solutionPda = getSolutionPda(
        casePublicKey,
        solution,
        web3Layer.programId,
      );

      const pendingTxs = get().remainingTransactions;

      const existsDislike = pendingTxs.find(
        (t) =>
          t.type === TransactionType.LIKE_REMOVE &&
          t.solutionPda.equals(solutionPda),
      );

      if (existsDislike) {
        set({
          remainingTransactions: pendingTxs.filter((t) => t !== existsDislike),
        });
        return;
      }

      if (pendingTxs.length >= 6) {
        throw new TooManyPendingTransactions();
      }

      const obj: PendingTransaction = {
        type: TransactionType.LIKE_ADD,
        solutionPda,
        solutionAccount: solutionAcc,
      };

      set({ remainingTransactions: [...pendingTxs, obj] });
    },
    dislikeSolutionTx: async (
      casePublicKey: string | PublicKey,
      solutionAcc: SolutionAccount,
    ) => {
      const solution = decompress(solutionAcc.account.moves);

      const solutionPda = getSolutionPda(
        casePublicKey,
        solution,
        web3Layer.programId,
      );

      const pendingTxs = get().remainingTransactions;

      const existsLike = pendingTxs.find(
        (t) =>
          t.type === TransactionType.LIKE_ADD &&
          t.solutionPda.equals(solutionPda),
      );

      const existsLearningStatus = pendingTxs.find(
        (t) =>
          t.type === TransactionType.LEARNING_STATUS &&
          t.solutionPda.equals(solutionPda),
      );

      let newTxs = [...pendingTxs];

      if (existsLike || existsLearningStatus) {
        newTxs = newTxs.filter((t) => {
          return t !== existsLike && t !== existsLearningStatus;
        });
      }

      if (!existsLike) {
        if (pendingTxs.length >= 6) {
          throw new TooManyPendingTransactions();
        }

        const obj: PendingTransaction = {
          type: TransactionType.LIKE_REMOVE,
          solutionPda,
          solutionAccount: solutionAcc,
        };

        newTxs.push(obj);
      }

      set({ remainingTransactions: newTxs });
    },
    setLearningStatusTx: async (
      casePublicKey: string | PublicKey,
      solution: string,
      learningStatus: LearningStatus,
    ) => {
      const solutionPda = getSolutionPda(
        casePublicKey,
        solution,
        web3Layer.programId,
      );

      const likePda = getLikePda(
        web3Layer.loggedUserPK,
        solutionPda,
        web3Layer.programId,
      );

      const { remainingTransactions: pendingTxs, likesMap } = get();

      const originalValue = likesMap[likePda.toString()];

      const newTxs = pendingTxs.filter(
        (t) =>
          t.type !== TransactionType.LEARNING_STATUS ||
          !t.solutionPda.equals(solutionPda),
      );

      if (
        !originalValue ||
        originalValue.account.parsedLearningStatus !== learningStatus
      ) {
        // Check also if we removed a pending learning status transaction in the filter
        if (pendingTxs.length >= 6 && newTxs.length === pendingTxs.length) {
          throw new TooManyPendingTransactions();
        }

        const obj: PendingTransaction = {
          type: TransactionType.LEARNING_STATUS,
          solutionPda,
          learningStatusValue: learningStatus,
        };

        newTxs.push(obj);
      }

      set({ remainingTransactions: newTxs });
    },
    clearTxs: () => {
      set({ remainingTransactions: [] });
    },
    commitTxs: async () => {
      const { remainingTransactions } = get();
      await web3Layer.commitLikesTransactions(remainingTransactions);

      const newLikesMap = {
        ...get().likesMap,
      };

      const authorDiff: Record<string, number> = {};

      const solutionDiff: Record<string, number> = {};

      for (const tx of remainingTransactions) {
        const likePda = getLikePda(
          web3Layer.loggedUserPK,
          tx.solutionPda,
          web3Layer.programId,
        );
        const likeKey = likePda.toString();

        if (tx.type === TransactionType.LIKE_ADD) {
          const acc = await web3Layer.loadLike(likePda);

          newLikesMap[likeKey] = acc;

          if (tx.solutionAccount) {
            const authorKey = tx.solutionAccount.account.author.toString();
            const solutionKey = tx.solutionAccount.publicKey.toString();

            if (!authorDiff[authorKey]) {
              authorDiff[authorKey] = 0;
            }

            if (!solutionDiff[solutionKey]) {
              solutionDiff[solutionKey] = 0;
            }

            authorDiff[authorKey]++;
            solutionDiff[solutionKey]++;
          }
        } else if (tx.type === TransactionType.LIKE_REMOVE) {
          delete newLikesMap[likeKey];

          if (tx.solutionAccount) {
            const authorKey = tx.solutionAccount.account.author.toString();
            const solutionKey = tx.solutionAccount.publicKey.toString();

            if (!authorDiff[authorKey]) {
              authorDiff[authorKey] = 0;
            }

            if (!solutionDiff[solutionKey]) {
              solutionDiff[solutionKey] = 0;
            }

            authorDiff[authorKey]--;
            solutionDiff[solutionKey]--;
          }
        } else if (tx.learningStatusValue) {
          newLikesMap[likeKey].account.learningStatus = getRawLearningStatus(
            tx.learningStatusValue,
          );
          newLikesMap[likeKey].account.parsedLearningStatus =
            tx.learningStatusValue;
        }
      }

      set({ remainingTransactions: [], likesMap: newLikesMap });
      useSolutionStore.getState().processSolutionLikesBulk(solutionDiff);
      useUserStore.getState().processLikesBulk(authorDiff);
    },
    reset: () => {
      set({
        likesMap: {},
        loadingState: LoadingState.NOT_LOADED,
        remainingTransactions: [],
      });
    },
  }),
  Object.is,
);
