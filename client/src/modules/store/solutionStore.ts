import { createWithEqualityFn } from 'zustand/traditional';
import { LoadingState } from '../types/loadingState.enum';
import { SolutionAccount } from '../types/solution.interface';
import { web3Layer } from '../web3/web3Layer';
import { PublicKey } from '@solana/web3.js';
import { getLikePda, getStringFromPKOrObject } from '../web3/utils';
import { CaseAccount } from '../types/case.interface';
import { useLikeStore } from './likeStore';
import { ParsedLikeCertificateAccount } from '../types/likeCertificate.interface';

interface SolutionStoreState {
  solutions: SolutionAccount[];
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadIfNotLoaded: () => Promise<void>;
  loadSolutions: () => Promise<void>;
  addSolution: (selectedCase: CaseAccount, solution: string) => Promise<void>;
}

export function selectSolutionsByCase(casePublicKey: PublicKey | string) {
  const pk = getStringFromPKOrObject(casePublicKey);

  return (state: SolutionStoreState) => {
    return state.solutions.filter((s) => s.account.case.toString() === pk);
  };
}

export function selectSolutionsForAuthorAndCases(
  authorPublicKey: PublicKey | string,
  validCases: CaseAccount[] | undefined,
) {
  const authorPk = getStringFromPKOrObject(authorPublicKey);

  const casesForSet = validCases
    ? validCases.map((c) => c.publicKey.toString())
    : undefined;

  return (state: SolutionStoreState) => {
    return state.solutions.filter(
      (s) =>
        (casesForSet === undefined ||
          casesForSet.includes(s.account.case.toString())) &&
        s.account.author.toString() === authorPk,
    );
  };
}

export function selectLikedSolutionsForCases(
  likesMap: Record<string, ParsedLikeCertificateAccount>,
  validCases: CaseAccount[],
) {
  return (state: SolutionStoreState) => {
    return state.solutions.filter((s) => {
      if (!validCases.some((c) => c.publicKey.equals(s.account.case))) {
        return false;
      }

      const key = getLikePda(
        web3Layer.loggedUserPK,
        s.publicKey,
        web3Layer.programId,
      );

      return likesMap[key.toString()] !== undefined;
    });
  };
}

export function selectLikedSolutionsBySetAndId(
  casePublicKey: PublicKey | string,
) {
  const { likesMap } = useLikeStore.getState();

  const casePk = getStringFromPKOrObject(casePublicKey);

  return (state: SolutionStoreState) => {
    return state.solutions.filter((s) => {
      const pk = getLikePda(
        web3Layer.loggedUserPK,
        s.publicKey,
        web3Layer.programId,
      );

      return (
        likesMap[pk.toString()] !== undefined &&
        s.account.case.toString() === casePk
      );
    });
  };
}

export function selectSolutionsByAuthor(authorPublicKey: PublicKey | string) {
  const authorPk = getStringFromPKOrObject(authorPublicKey);

  return (state: SolutionStoreState) => {
    return state.solutions.filter(
      (s) => s.account.author.toString() === authorPk,
    );
  };
}

export const useSolutionStore = createWithEqualityFn<SolutionStoreState>(
  (set, get) => ({
    solutions: [],
    loadIfNotLoaded: async () => {
      const { loadingState, loadSolutions } = get();

      if (loadingState === LoadingState.NOT_LOADED) {
        loadSolutions();
      }
    },
    loadSolutions: async () => {
      set({ loadingState: LoadingState.LOADING });
      try {
        const solutions = await web3Layer.loadSolutions();
        set({ solutions });
      } catch (e) {
        console.error(e);
      } finally {
        set({ loadingState: LoadingState.LOADED });
      }
    },
    addSolution: async (selectedCase: CaseAccount, solution: string) => {
      await web3Layer.addSolution(selectedCase.publicKey, solution);

      // TODO: Try to add the solution without having to reload the whole state
      await get().loadSolutions();
    },
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
  }),
  Object.is,
);
