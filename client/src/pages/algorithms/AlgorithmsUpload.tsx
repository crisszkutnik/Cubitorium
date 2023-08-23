import { DefaultLayout } from "../../components/DefaultLayout";
import { LeftPanel } from "../../page-components/algorithms/LeftPanel";
import { TopSelector } from "../../page-components/algorithms/TopSelector";
import { RightPanel } from "../../page-components/algorithms/rightPanel/RightPanel";

export function AlgorithmsUpload() {
  return (
    <DefaultLayout column={true}>
      <h1 className="text-4xl py-6 text-accent-dark font-bold">Algorithms Upload</h1>
      <TopSelector />
      <div className="flex mt-3">
        <LeftPanel />
        <RightPanel />
      </div>
    </DefaultLayout>
  );
}
