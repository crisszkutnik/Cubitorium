import { DefaultLayout } from "../../../components/DefaultLayout";
import { CubeSelectorPanel } from "./CubeSelectorPanel";
import { ResolutionInput } from "./ResolutionInput";
import { ScrambleDisplay } from "../../../components/ScrambleDisplay";

export function AlgorithmsUpload() {

  return (
    <div>
      <DefaultLayout column={true}>
      <ScrambleDisplay height="20px" event="222"></ScrambleDisplay>
      <h1 className="text-4xl py-6 text-accent-dark font-bold">Upload your Algorithm</h1>
      <CubeSelectorPanel></CubeSelectorPanel>
      <ResolutionInput></ResolutionInput>   
      </DefaultLayout>
    </div>
  );
}
