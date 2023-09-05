/* @refresh reload */
import { render } from "solid-js/web";
import { AppContextProvider, useAppContext } from "./logic/context";

import "./index.css";
import App from "./App";

render(() => (
    <AppContextProvider><App /></AppContextProvider>
), document.getElementById("root"));
