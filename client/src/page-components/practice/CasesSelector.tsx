import { ButtonWrapper } from "../../components/ButtonWrapper";
import { TwistyPlayer } from "./TwistyPlayer";

export function CasesSelector() {

    function handleShowCases() {
    }

    return (
        <div className="">
            <div className="flex flex-row py-3 justify-center gap-2">
                <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select None" />
                <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select All" />
            </div>
            <div className="flex flex-col gap-2">
                <Case/>
                <Case/>
                <Case/>
                <Case/>
            </div>
        </div>
    );
}

export function Case() {
    function handleShowCases() {
    }
    return (
        <div className="flex flew-row items-center w-full border-2 border-accent-dark rounded p-2 cursor-pointer" onClick={handleShowCases}>
            <TwistyPlayer puzzle="3x3x3" algorithm="R U2 R' U' R U' R'" size="60"></TwistyPlayer>
            <p className="pl-2">Aa</p>
        </div>
    );
}