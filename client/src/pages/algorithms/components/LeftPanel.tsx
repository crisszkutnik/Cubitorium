import { useEffect, useRef, useState } from "react";

export function LeftPanel() {
  const container = useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = useState(0);

  const handleScroll = () => {
    if (container.current) {
      const elementTop = container.current?.getBoundingClientRect().top;

      if (elementTop < 0) {
        setMarginTop(-elementTop + 12);
      } else {
        setMarginTop(0);
      }
    }
  };

  useEffect(() => {
    const f = () => handleScroll();
    window.addEventListener("scroll", f);

    return () => {
      window.removeEventListener("scroll", f);
    };
  }, []);

  return (
    <div ref={container} className="w-1/4 h-fit">
      <div
        style={{ marginTop: `${marginTop}px` }}
        className="bg-gray-100  flex flex-col px-5 py-5 rounded-md"
      >
        <h1 className="font-bold text-accent-dark mb-5 text-2xl">
          First two layers
        </h1>
        <div className="flex">
          <div>
            <h2 className="font-bold text-accent-dark">Cases</h2>
            <p>41</p>
          </div>
          <div className="ml-6">
            <h2 className="font-bold text-accent-dark">Movements average</h2>
            <p>6.8</p>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-accent-dark font-semibold">Select group</p>
          <select className="px-2 py-2 rounded border border-gray-300">
            <option>Free pairs</option>
            <option>Disconnected pairs</option>
            <option>Connected pairs</option>
            <option>Corner in slot</option>
            <option>Edge in slot</option>
            <option>Pieces in slot</option>
          </select>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-accent-dark font-semibold">Select subset</p>
          <div className="px-2 py-2 rounded border border-gray-300 bg-white flex flex-col text-center items-center">
            <img className="w-24 mb-3" src="public/Rubik_placeholder.png" />
            <p className="text-accent-dark font-semibold">Free pairs</p>
            <p className="text-accent-dark font-semibold">0/4</p>
          </div>
        </div>
      </div>
    </div>
  );
}
