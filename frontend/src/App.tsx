import { RouterProvider } from "react-router";
import { UserProvider } from "./context/UserDataCtx/userContext";
import routes from "./routes/AppRoutes.js";
const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={routes} />
    </UserProvider>
  );
};
export default App;
