import { useSearchParams } from "react-router-dom";
import { Selector } from "../../../components/Selector";
import { useAlgorithmsStore } from "../../../modules/store/algorithmsStore";
import { useEffect, useState } from "react";

enum QueryParams {
  TYPE = "type",
  SUBTYPE = "subtype",
}

export function TopSelector() {
  const { algorithmsType, algorithmsSubtypes } = useAlgorithmsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");

  const getSubtypeValue = (type: string | null) => {
    let arr;

    if (type) {
      arr = algorithmsSubtypes[type];
    } else {
      arr = algorithmsSubtypes[algorithmsType[0]];
    }

    return arr ? arr[0] : undefined;
  };

  useEffect(() => {
    let changedParams = false;

    const type = searchParams.get(QueryParams.TYPE);
    if (type) {
      setSelectedType(type);
    } else {
      changedParams = true;
      searchParams.set(QueryParams.TYPE, algorithmsType[0]);
    }

    const subtype = searchParams.get(QueryParams.SUBTYPE);
    if (subtype) {
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

  const onSelectorChange = (newValue: string) => {
    searchParams.set("type", newValue);
    setSearchParams(searchParams);
  };

  const onSubselectorChange = (newValue: string) => {
    searchParams.set("subtype", newValue);
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
