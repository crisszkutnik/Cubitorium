import { DefaultLayout } from "../../../components/layout/DefaultLayout";
import { CubeSelectorPanel } from "./CubeSelectorPanel";
import { ResolutionInput } from "./ResolutionInput";

export function AlgorithmsUpload() {
  return (
      <DefaultLayout column={true}>
        <h1 className="text-4xl py-6 text-accent-dark font-bold">Upload your Algorithm</h1>
        <CubeSelectorPanel></CubeSelectorPanel>
        <ResolutionInput></ResolutionInput>   
      </DefaultLayout>
  );
}

