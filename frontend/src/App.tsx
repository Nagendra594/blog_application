import { RouterProvider } from "react-router";
import { UserProvider } from "./context/userContext.jsx";

import routes from "./routes/AppRoutes.jsx";
const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={routes} />;
    </UserProvider>
  );
};
export default App;
