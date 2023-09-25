import { Accordion, AccordionItem } from "@nextui-org/react";

export function Home() {

  return (
    <div className="column">
      <h1 className="text-4xl py-6 text-accent-dark font-bold text-center mt-6">
        Welcome to Cubitorium!
      </h1>
      <img
        className="mx-auto block -mt-4"
        src="/public/Logo.png"
        alt="Logo"
      />
      <h3 className="text-2xl py-6 text-accent-dark text-center -mt-3">
        Experience the best way to...
      </h3>
      {/* por favor cristobal perdoname este inline-styling por favor te lo pido no lo pude hacer andar con max-w-400 por favor te lo pido */}
      {/* te lo pido por favor.... por favor te lo pido */}
          <Accordion variant="splitted" className="mx-auto text-center" style={{maxWidth:"370px"}}disabledKeys={["4"]} >
        
            <AccordionItem key="1" aria-label="2" title={
                <span>
                    Improve your <span className="text-green-700 font-bold">cube-solving skills</span>
                </span>
                }>

                <p className="text-sm text-left text-gray-500 mr-40 -mt-3 mb-2">
                Learning from others Speedcubers solutions 
                </p>
            </AccordionItem>

            <AccordionItem key="2" aria-label="2" title={
                <span>
                    Learn about <span className="text-purple-600 font-bold">new algorithms</span>
                </span>
                }>
                <p className="text-sm text-left text-gray-500 mr-40 -mt-3 mb-2">
                    Checking our great <b>Algorithms</b> page in which you could find all the uploaded algorithms by the community.
                </p>
            </AccordionItem>

            <AccordionItem key="3" aria-label="3" title={
                <span>
                    Contribute to the <span className="text-blue-600 font-bold">community</span>
                </span>
                }>
                <p className="text-sm text-left text-gray-500 mr-40 -mt-3 mb-2">
                    Checking our great <b>Algorithms</b> page in which you could find all the uploaded algorithms by the community.
                </p>
            </AccordionItem>

          

            <AccordionItem key="4" aria-label="Accordion 4" title="we also sell drugs" >
              3
            </AccordionItem>

          </Accordion>
          </div>
  );
}
