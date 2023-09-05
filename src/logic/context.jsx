import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AppContext = createContext();

export function ContextProvider(props) {
    const [config, setConfig] = createStore({
        wallet_key: ""
    });
    const appState = [
        config, {}
    ];

    return (
        <AppContext.Provider value={appState}>
            {props.children}
        </AppContext.Provider>
    );
}

export function useAppContext() { return useContext(AppContext); }
