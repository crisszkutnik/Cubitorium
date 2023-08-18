import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAlgorithmsStore } from "../../modules/store/algorithmsStore";
import { Selector } from "../../components/Selector";

enum QueryParams {
  TYPE = "type",
  SUBTYPE = "subtype",
}

export function TopSelector() {
  const { algorithmsType, algorithmsSubtypes } = useAlgorithmsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");

<<<<<<< HEAD
=======
  useEffect(() => {
    const queryType = searchParams.get(QueryParams.TYPE);
    const querySubtype = searchParams.get(QueryParams.SUBTYPE);

    const typeParamChanged = shouldUpdateTypeParam(queryType, searchParams);

    const subtypeParamChanged = shouldUpdateSubtypeParam(
      querySubtype,
      queryType,
      searchParams
    );

    if (typeParamChanged || subtypeParamChanged) {
      setSearchParams(searchParams);
    }
  }, [searchParams]);

>>>>>>> main
  const getSubtypeValue = (type: string | null) => {
    let arr;

    if (type) {
      arr = algorithmsSubtypes[type];
    } else {
      arr = algorithmsSubtypes[algorithmsType[0]];
    }

    return arr ? arr[0] : undefined;
  };

<<<<<<< HEAD
  useEffect(() => {
    let changedParams = false;

    const type = searchParams.get(QueryParams.TYPE);
    if (type && type !== selectedType) {
      setSelectedType(type);
    } else {
      changedParams = true;
      searchParams.set(QueryParams.TYPE, algorithmsType[0]);
    }

    const subtype = searchParams.get(QueryParams.SUBTYPE);
    if (subtype && subtype !== selectedSubtype) {
      setSelectedSubtype(subtype);
    } else {
      const value = getSubtypeValue(type);

      if (value) {
        changedParams = true;
        searchParams.set(QueryParams.SUBTYPE, value);
      }
    }

    if (changedParams) {
      setSearchParams(searchParams);
    }
  }, [searchParams]);
=======
  const shouldUpdateTypeParam = (
    queryType: string | null,
    params: URLSearchParams
  ) => {
    if (!queryType) {
      params.set(QueryParams.TYPE, algorithmsType[0]);
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
    params: URLSearchParams
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
>>>>>>> main

  const onSelectorChange = (newValue: string) => {
    searchParams.set(QueryParams.TYPE, newValue);

    const value = getSubtypeValue(newValue);

    if (value) {
      searchParams.set(QueryParams.SUBTYPE, value);
<<<<<<< HEAD
=======
    } else {
      searchParams.delete(QueryParams.SUBTYPE);
>>>>>>> main
    }

    setSearchParams(searchParams);
  };

  const onSubselectorChange = (newValue: string) => {
    searchParams.set(QueryParams.SUBTYPE, newValue);
    setSearchParams(searchParams);
  };

  return (
    <Selector
      selectors={algorithmsType}
      subselectors={algorithmsSubtypes}
      selectedSelector={selectedType}
      selectedSubselector={selectedSubtype}
      onSelectorChange={onSelectorChange}
      onSubselectorChange={onSubselectorChange}
    />
  );
}
