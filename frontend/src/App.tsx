import { RouterProvider } from "react-router";

import routes from "./routes/AppRoutes.js";
import { Provider } from "react-redux";
import store from "./store/store";
const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
};
export default App;
