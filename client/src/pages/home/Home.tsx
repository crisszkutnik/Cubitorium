import { Accordion, AccordionItem } from "@nextui-org/react";

export function Home() {
  return (
    <div>
      <h1 className="text-4xl py-5 text-accent-dark font-bold text-center mt-6">
        <img className="mx-auto block -mt-2 h-40" src="/public/Logo.png" alt="Logo" />
        Welcome to Cubitorium
      </h1>

      <div className="flex flex-col items-center mt-3 mb-3">
        <p className="text-sm text-xm max-w-sm text-gray-400 text-center">
          Cubitorium is a decentralized Web3 solution created to assist the
          Speedcubers community. Here, you will find several tools to improve
          your skills in this global sport practiced in more than 100 countries
          in the world.
        </p>

        <div className="mt-3 flex items-center">
          <img src="/rubik_gif.gif" alt="Rubik's Cube" className="h-10" />
          <p className="mr-4 ml-4">Experience the best way to...</p>
        </div>
      </div>

      <Accordion variant="splitted" className="mx-auto text-center max-w-sm" disabledKeys={["4"]} >
        <AccordionItem
          key="1"
          aria-label="2"
          title={
            <span>
              Improve your{" "}
              <span className="text-green-700 font-bold">
                cube-solving skills
              </span>
            </span>
          }
        >
          <p className="text-sm text-left text-gray-500 mr-25 -mt-3 mb-2">
            Learning from others Speedcubers solutions
          </p>
        </AccordionItem>

        <AccordionItem
          key="2"
          aria-label="2"
          title={
            <span>
              Learn about{" "}
              <span className="text-purple-600 font-bold">new algorithms</span>
            </span>
          }
        >
          <p className="text-sm text-left text-gray-500 mr-25 -mt-3 mb-2">
            Checking our great <b>Algorithms</b> page in which you could find
            all the uploaded algorithms by the community.
          </p>
        </AccordionItem>

        <AccordionItem
          key="3"
          aria-label="3"
          title={
            <span>
              Contribute to the{" "}
              <span className="text-blue-600 font-bold">community</span>
            </span>
          }
        >
          <p className="text-sm text-left text-gray-500 mr-25 -mt-3 mb-2">
            Creating and posting your own algorithms
          </p>
        </AccordionItem>

        <AccordionItem
          key="4"
          aria-label="Accordion 4"
          title="(Coming Soon!) We are working with an advanced, optimized and high-level performant Machine Learning model to improve this entire page"
        >
          3
        </AccordionItem>
      </Accordion>
    </div>
  );
}
