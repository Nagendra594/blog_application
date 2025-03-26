import { createRoot } from "react-dom/client";
import App from "./App";
const rootEle: HTMLElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootEle);

root.render(<App />);
