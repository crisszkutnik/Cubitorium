import { useParams } from "react-router-dom";
import { DefaultLayout } from "../../components/layout/DefaultLayout";
import { Button } from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export function InfoByUserID() {
  const { id } = useParams();
  id;

  return (
    <DefaultLayout>
      <div className="flex flex-col bg-white drop-shadow py-3 px-6 rounded w-1/4 mr-6 h-fit">
        <div className="flex justify-center">
          <img src="/user_placeholder.png" className="rounded-full w-48" />
        </div>
        <h1 className="font-bold text-accent-dark text-2xl mb-4 mt-3">
          Name Surname
        </h1>
        <div className="mb-4">
          <h2 className="font-bold text-accent-dark">WCA ID</h2>
          <a
            href={
              "https://www.worldcubeassociation.org/persons/" + "2013DIPI01"
            }
            className="text-accent-dark hover:underline"
          >
            2013DIPI01
            <FontAwesomeIcon
              className="ml-2 text-sm"
              icon={faUpRightFromSquare}
            />
          </a>
        </div>
        <div className="mb-4">
          <h2 className="font-bold text-accent-dark">Location</h2>
          <p className="text-accent-dark">Buenos Aires, Argentina</p>
        </div>
        <div>
          <h2 className="font-bold text-accent-dark">Birthdate</h2>
          <p className="text-accent-dark">25/03/2001</p>
        </div>
      </div>
      <div className="flex flex-col bg-white drop-shadow w-3/4 p-4">
        <div className="flex w-full justify-around">
          <div>
            <h1 className="font-bold text-accent-dark text-2xl">Join date</h1>
            <p className="text-accent-dark text-xl">01/01/2023</p>
          </div>
          <div>
            <h1 className="font-bold text-accent-dark text-2xl">
              Solutions uploaded
            </h1>
            <p className="text-accent-dark text-xl">60</p>
          </div>
          <div>
            <h1 className="font-bold text-accent-dark text-2xl">
              Votes received
            </h1>
            <p className="text-accent-dark text-xl">500</p>
          </div>
        </div>
        <hr className="w-full h-px my-3" />
        <div
          style={{ height: "40rem" }}
          className="p-4 w-full flex flex-col items-center overflow-y-scroll"
        >
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
              {Array(100).fill(
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
    </DefaultLayout>
  );
}
