import { useAuth } from "./context/auth";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
})
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  history: memoryHistory,
  basepath: '/poultry-web/',
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

export default App;
