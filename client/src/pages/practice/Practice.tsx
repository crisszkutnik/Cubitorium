import { DefaultLayout } from "../../components/layout/DefaultLayout";
import { StopWatch } from "../../page-components/practice/StopWatch";
import { PracticeSelector } from "../../page-components/practice/PracticeSelector";


export function Practice() {
    return (
        <DefaultLayout column={true}>
            <h1 className="text-4xl py-6 text-accent-dark font-bold">Practice</h1>
            <div className="flex flex-row">
                <PracticeSelector />
                <StopWatch />
            </div>
            

            
        </DefaultLayout>
    );
  }
  