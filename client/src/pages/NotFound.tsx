export function NotFound() {
    return (
      <div className="relative h-screen mt-20 text-center">
        <img src="/rubik-sad.png" className="mx-auto" />
        <h1 className="font-semibold text-8xl mt-1">
          4<img src="/404.gif" className="p-0 h-14 w-14 inline-block rounded-full border-8 border-gray-950"/>4
        </h1>
        <h1 className="text-accent-dark font-semibold text-3xl mt-1">
          Not Found
        </h1>
        
        <h3 className="max-w-xs text-center mt-4 mx-auto">
          Similar to mastering the art of solving a Cube, the journey to finding the right path often involves a playful mix of twists and turns.
        </h3>
        <h2 className="text-indigo-700 font-bold mt-5">Keep Searching!</h2>
      </div>
    );
  }
  