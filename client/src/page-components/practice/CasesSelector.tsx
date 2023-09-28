import { ButtonWrapper } from "../../components/ButtonWrapper";
import { TwistyPlayer } from "./TwistyPlayer";
import { shallow } from 'zustand/shallow';
import { useCaseStore } from "../../modules/store/caseStore"
import { PuzzleTypeKey } from "../../modules/store/algorithmsStore"
import { Case } from "../../modules/types/case.interface"

interface Props {
    selectedPuzzle: PuzzleTypeKey;
    selectedSet: string;
}

export function CasesSelector({selectedPuzzle, selectedSet}: Props) {

    const cases = useCaseStore(
        (state) => state.cases,
        shallow,
    );

    function handleShowCases() {
    }

    return (
        <div className="">
            <div className="flex flex-row py-3 justify-center gap-2">
                <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select None" />
                <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select All" />
            </div>
            <div className="flex flex-col gap-2">
                {cases.filter((c) => c.account.set === selectedSet).map((c) => (
                    <ItemCase selectedPuzzle={selectedPuzzle} caseDetail={c.account}/>
                ))}
            </div>
        </div>
    );
}

interface CaseProps {
    selectedPuzzle: PuzzleTypeKey;
    caseDetail: Case;
}

export function ItemCase({selectedPuzzle, caseDetail}: CaseProps) {
    function handleShowCases() {
    }
    return (
        <div className="flex flew-row items-center w-full border-2 border-accent-dark rounded p-2 cursor-pointer" onClick={handleShowCases}>
            <TwistyPlayer puzzle={selectedPuzzle} algorithm={caseDetail.setup} size="60"></TwistyPlayer>
            <p className="pl-2">{caseDetail.id}</p>
        </div>
    );
}