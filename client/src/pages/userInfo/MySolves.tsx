import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { UserInfoLayout } from "../../components/layout/UserInfoLayout";

export function MySolves() {
  return (
    <UserInfoLayout>
      <div className="flex flex-col mb-4 bg-white drop-shadow w-full">
        <div className="flex flex-col justify-between p-4">
          <div className="flex">
            <Select
              type="primary"
              values={["Free pairs", "Free pairs"]}
              title="Algorithm type"
              onChange={() => {}}
              className="w-full mr-2"
            />
            <Select
              type="secondary"
              values={["Free pairs", "Free pairs"]}
              title="Algorithm type"
              onChange={() => {}}
              className="w-full ml-1 mr-1"
            />
            <Select
              type="tertiary"
              values={["Free pairs", "Free pairs"]}
              title="Algorithm type"
              onChange={() => {}}
              className="w-full ml-1 mr-1"
            />
            <Select
              type="tertiary"
              values={["Free pairs", "Free pairs"]}
              title="Algorithm type"
              onChange={() => {}}
              className="w-full ml-2"
            />
          </div>
          <div className="flex justify-end mt-3">
            <Button text="Apply filters" />
          </div>
        </div>
        <hr className="w-full h-px bg-black/5 rounded border-none" />
        <div className="p-4 w-full flex flex-col items-center">
          <table className="text-left w-full mb-3">
            <thead>
              <tr>
                <th>Date submitted</th>
                <th>Solution</th>
                <th>Type</th>
                <th>Case</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {Array(10).fill(
                <tr>
                  <td className="py-2">24/08/2023</td>
                  <td className="py-2">R F L' U X Y Z</td>
                  <td className="py-2">3x3</td>
                  <td className="py-2">F2L 1</td>
                  <td className="py-2">50</td>
                </tr>
              )}
            </tbody>
          </table>
          <Button text="+ Load more" type="secondary" />
        </div>
      </div>
    </UserInfoLayout>
  );
}
