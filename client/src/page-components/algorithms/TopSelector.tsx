import { useSearchParams } from 'react-router-dom';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import {
  PuzzleType,
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { Selector } from '../../components/Selector';

enum QueryParams {
  TYPE = 'type',
  SUBTYPE = 'subtype',
}

interface Props {
  selectedType: string;
  setSelectedType: Dispatch<SetStateAction<string>>;
  selectedSubtype: string;
  setSelectedSubtype: Dispatch<SetStateAction<string>>;
}

export function TopSelector({
  selectedType,
  selectedSubtype,
  setSelectedType,
  setSelectedSubtype,
}: Props) {
  const [sets, setsMap] = useAlgorithmsStore((state) => [
    state.sets,
    state.setsMap,
  ]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const queryType = searchParams.get(QueryParams.TYPE);
    const querySubtype = searchParams.get(QueryParams.SUBTYPE);

    const typeParamChanged = shouldUpdateTypeParam(queryType, searchParams);

    const subtypeParamChanged = shouldUpdateSubtypeParam(
      querySubtype,
      queryType,
      searchParams,
    );

    if (typeParamChanged || subtypeParamChanged) {
      setSearchParams(searchParams);
    }
  }, [searchParams, sets]);

  const getSubtypeValue = (type: PuzzleTypeKey | null) => {
    if (sets.length === 0) {
      return '';
    }

    if (type === null) {
      return sets[0].setName;
    }

    return setsMap[type][0].setName;
  };

  const shouldUpdateTypeParam = (
    queryType: string | null,
    params: URLSearchParams,
  ) => {
    if (!queryType) {
      params.set(QueryParams.TYPE, PuzzleType['3x3']);
      return true;
    }

    if (queryType && queryType !== selectedType) {
      setSelectedType(queryType);
    }

    return false;
  };

  const shouldUpdateSubtypeParam = (
    querySubtype: string | null,
    queryType: string | null,
    params: URLSearchParams,
  ) => {
    if (querySubtype && querySubtype !== selectedSubtype) {
      setSelectedSubtype(querySubtype);
      return false;
    }

    const value = getSubtypeValue(queryType as PuzzleTypeKey | null);

    if (value) {
      params.set(QueryParams.SUBTYPE, value);
      return true;
    }

    return false;
  };

  const onSelectorChange = (newValue: string) => {
    searchParams.set(QueryParams.TYPE, newValue);

    const value = getSubtypeValue(newValue as PuzzleTypeKey);

    if (value) {
      searchParams.set(QueryParams.SUBTYPE, value);
    } else {
      searchParams.delete(QueryParams.SUBTYPE);
    }

    setSearchParams(searchParams);
  };

  const onSubselectorChange = (newValue: string) => {
    searchParams.set(QueryParams.SUBTYPE, newValue);
    setSearchParams(searchParams);
  };

  const subselectors = useMemo(() => {
    const ret: Record<string, string[]> = {};

    PuzzleTypeKeys.forEach((key) => {
      ret[key] = setsMap[key].map((s) => s.setName);
    });

    return ret;
  }, [setsMap]);

  return (
    <Selector
      selectors={PuzzleTypeKeys}
      subselectors={subselectors}
      selectedSelector={selectedType}
      selectedSubselector={selectedSubtype}
      onSelectorChange={onSelectorChange}
      onSubselectorChange={onSubselectorChange}
    />
  );
}
