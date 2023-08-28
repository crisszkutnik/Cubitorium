import { DefaultLayout } from "../../../components/DefaultLayout";
import { CubeSelectorPanel } from "./CubeSelectorPanel";
import { ResolutionInput } from "./ResolutionInput";


export function AlgorithmsUpload() {

  return (
    <div>
      <DefaultLayout column={true}>
      {/* <ScrambleDisplay height="1px" event="444"></ScrambleDisplay> */}
      <h1 className="text-4xl py-6 text-accent-dark font-bold">Upload your Algorithm</h1>
      <CubeSelectorPanel></CubeSelectorPanel>
      <ResolutionInput></ResolutionInput>   
      </DefaultLayout>
    </div>
  );
}
