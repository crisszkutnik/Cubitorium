import { DefaultLayout } from "../../components/layout/DefaultLayout";
import { LeftPanel } from "../../page-components/algorithms/LeftPanel";
import { TopSelector } from "../../page-components/algorithms/TopSelector";
import { RightPanel } from "../../page-components/algorithms/rightPanel/RightPanel";

export function Algorithms() {
  return (
    <DefaultLayout column={true}>
      <h1 className="text-4xl pb-6 text-accent-dark font-bold">Algorithms</h1>
      <TopSelector />
      <div className="flex mt-3">
        <LeftPanel />
        <RightPanel />
      </div>
    </DefaultLayout>
  );
}
