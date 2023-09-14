import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  selectSets2,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { Selector } from '../../components/Selector';

enum QueryParams {
  TYPE = 'type',
  SUBTYPE = 'subtype',
}

/*
  OBS: Part of this file is hardcoded because right now we are
  only supporting 3x3 cubes
*/

export function TopSelector() {
  const sets2 = useAlgorithmsStore(selectSets2);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('3x3');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');

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
  }, [searchParams, sets2]);

  const getSubtypeValue = (type: string | null) => {
    /*
    
    let arr;

    (if (type) {
      arr = algorithmsSubtypes[type];
    } else {
      arr = algorithmsSubtypes[algorithmsType[0]];
    }

    return arr ? arr[0] : undefined;*/
    if (sets2.length === 0) {
      return '';
    }
    type;
    return sets2[0].set_name;
  };

  const shouldUpdateTypeParam = (
    queryType: string | null,
    params: URLSearchParams,
  ) => {
    if (!queryType) {
      // params.set(QueryParams.TYPE, algorithmsType[0]);
      params.set(QueryParams.TYPE, '3x3');
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

    const value = getSubtypeValue(queryType);

    if (value) {
      params.set(QueryParams.SUBTYPE, value);
      return true;
    }

    return false;
  };

  const onSelectorChange = (newValue: string) => {
    searchParams.set(QueryParams.TYPE, newValue);

    const value = getSubtypeValue(newValue);

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

  return (
    <Selector
      selectors={['3x3']}
      subselectors={{
        '3x3': sets2.length === 0 ? [] : sets2.flatMap((s) => s.set_name),
      }}
      selectedSelector={selectedType}
      selectedSubselector={selectedSubtype}
      onSelectorChange={onSelectorChange}
      onSubselectorChange={onSubselectorChange}
    />
  );
}
