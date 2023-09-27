import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState, useEffect } from "react";

export function Home() {
  // Background changer

  const backgroundImages = ["hm-bg-0.jpg", "hm-bg-1.jpg", "hm-bg-2.jpg"];
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  useEffect(() => {
    // change background
    const changeBackground = () => {
      // Obtener el próximo índice de fondo en la secuencia
      const nextIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
      setCurrentBackgroundIndex(nextIndex);
    };

    // change every 5 seconds (5000 ms)
    const backgroundInterval = setInterval(changeBackground, 1000);

    // clear interval when unmounted
    return () => {
      clearInterval(backgroundInterval);
    };
  }, [currentBackgroundIndex]);

  // get currentBackground
  const currentBackground = backgroundImages[currentBackgroundIndex];
  
  return (
    <div className="relative h-screen -mt-6">

    {/* BACKGROUND */}
    <div className={`absolute bg-cover bg-center opacity-10 inset-0 bg-[url('/${currentBackground}')]`}></div>
  
      <div className="relative z-10">
        
      {/* Welcome to cubitorium */}
      <h1 className="text-4xl py-5 text-accent-dark font-bold text-center mt-6">
        <img className="mx-auto block -mt-2 h-40" src="/public/Logo.png" alt="Logo" />
        Welcome to Cubitorium
      </h1>

      {/* Description */}
      <div className="flex flex-col items-center mt-1 mb-3">
        <p className="text-sm text-xm max-w-sm text-gray-900 text-center">
          Cubitorium is a decentralized Web3 solution created to assist the
          Speedcubers community. Here, you will find several tools to improve
          your skills in this global sport practiced in more than 100 countries
          in the world.
        </p>

      {/* Experience the best way to... */}
        <div className="mt-5 flex items-center">
          <p className="mr-4 ml-4 text-lg">Experience the best way to...</p>
        </div>
      </div>

      {/* Items / Accordions  - things that cubitorium does*/}

      {/* Cube Solving Skills */}
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

        
      {/* Learn About New Algorithms */}
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
            Checking our Algorithms page in which you could find
            all the uploaded algorithms by the community.
          </p>
        </AccordionItem>


      {/* Contribute to the community */}
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
          
        {/* Coming Soon! */}
        <AccordionItem
          key="4"
          aria-label="Accordion 4"
          title="(Coming Soon!) "
        >
        
        </AccordionItem>
      </Accordion>
       {/* Background */}
      </div>
    </div>
  );
}
