import { DefaultLayout } from "../../components/DefaultLayout";
import { StopWatch } from "../../page-components/practice/StopWatch";
import { Performance } from "../../page-components/practice/Performance";

export function Practice() {
    return (
        <DefaultLayout column={true}>
            <h1 className="text-4xl py-6 text-accent-dark font-bold">Practice</h1>

            <StopWatch />
            <Performance />

            
        </DefaultLayout>
    );
  }
  