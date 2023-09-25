import { Accordion, AccordionItem } from "@nextui-org/react";

export function Home() {
  const listItems = [
    "Improve your cube-solving skills",
    "Learn about new algorithms",
    "Contribute to the community creating your own algorithms",
  ];

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
          <Accordion variant="splitted" className="mx-auto text-center column" style={{ maxWidth: "400px" }} disabledKeys={["4"]} >
            <AccordionItem key="1" aria-label="Accordion 1" title="Improve your cube-solving skills">
                asdasd
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Learn about new algorithms" >
                asdasda
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Contribute to the community creating your own algorithms" >
              3
            </AccordionItem>
            <AccordionItem key="4" aria-label="Accordion 4" title="Something that we don't provide or is in TODO status? IDK " >
              3
            </AccordionItem>
          </Accordion>
        </div>
      
  );
}
