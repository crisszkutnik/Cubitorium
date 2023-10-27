import { Accordion, AccordionItem, Button, Link } from '@nextui-org/react';
import { useState, useEffect } from 'react';

export function Home() {
  // Background changer
  const backgroundImages = ['bg5.jpg', 'bg6.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg1.jpg', 'bg0.jpg'];
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  useEffect(() => {
    const backgroundInterval = setInterval(() => {
      setCurrentBackgroundIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 10000);

    return () => {
      clearInterval(backgroundInterval);
    };
  }, []);


  const currentBackground = backgroundImages[currentBackgroundIndex];

  return (
    <div className="relative h-screen -mt-6">
      
      <div className="absolute inset-0 -z-10">
        <img
          src={`/public/${currentBackground}`}
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="">
        {/* Welcome to cubitorium */}
        <h1 className="text-4xl py-5 text-accent-dark font-bold text-center mt-6">
          <img
            className="mx-auto block -mt-2 h-40"
            src="/public/Logo.png"
            alt="Logo"
          />
          Welcome to Cubitorium
        </h1>

        {/* Description */}
        <div className="flex flex-col items-center mt-1 mb-3">
          <p className="text-sm text-xm max-w-sm text-gray-600 text-center font-bold">
            Cubitorium is a decentralized Web3 solution created to assist the
            Speedcubers community. Here, you will find several tools to improve
            your skills in this global sport practiced in more than 100
            countries in the world.
          </p>
          <Link href="/guide">
          <Button color="secondary" variant="shadow" className="mt-4 text-gray-100 text-lg font-bold" href="/guide">
              GET STARTED!
          </Button>  
          </Link>

          <p className="text-sm text-xm max-w-sm text-gray-600 text-center mt-5">
          Before you start exploring the capabilities of our application, we <b>strongly recommend </b>reading the guide above.
          </p>

          {/* Experience the best way to... */}
          <div className="mt-5 flex items-center">
            <p className="mr-4 ml-4 text-lg">Experience the best way to...</p>
          </div>
        </div>

        {/* Items / Accordions  - things that cubitorium does*/}
        <Accordion
          variant="splitted"
          className="mx-auto text-center max-w-sm"
          disabledKeys={['4']}
        >

          {/* Improve your cube-solving skills */}
          <AccordionItem
            key="1"
            aria-label="2"
            title={
              <span>
                Improve your{' '}
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
                Learn about{' '}
                <span className="text-purple-600 font-bold">
                  new algorithms
                </span>
              </span>
            }
          >
            <p className="text-sm text-left text-gray-500 mr-25 -mt-3 mb-2">
              Checking our Algorithms page in which you could find all the
              uploaded algorithms by the community.
            </p>
          </AccordionItem>

          {/* Contribute to the community */}
          <AccordionItem
            key="3"
            aria-label="3"
            title={
              <span>
                Contribute to the{' '}
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
            title="Coming Soon!"
          
          ></AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
