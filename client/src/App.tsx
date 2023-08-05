import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { TestPage } from "./pages/test/TestPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello final-thesis</div>,
    },
    {
      path: "/test",
      element: <TestPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
