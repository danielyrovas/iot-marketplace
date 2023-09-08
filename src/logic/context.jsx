import { createContext, createResource, createSignal, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import Wallet from "senshamartproject/wallet/wallet";
import ChainUtil from "senshamartproject/util/chain-util";
import { load_config, save_config } from "./config";

export const AppContext = createContext();

export function AppContextProvider(props) {
    const [state, setState] = createStore({
        loading: true,
        config: {},
        keyPair: {},
        wallet: {},
    });

    const updateConfig = (key, value) => {
        console.log(JSON.stringify(state.config));
        let update = {};
        update[key] = value;
        setState("config", update);
        console.log(JSON.stringify(state.config));
        save_config(state.config);
        reload().then(console.log('finished reloading'));
    }

    const reload = (async () => {
        setState("loading", true); // force user not to interact with UI

        const keyPair = ChainUtil.deserializeKeyPair(state.config.wallet_key);
        setState("keyPair", keyPair);
        const wallet = new Wallet(keyPair);
        setState("wallet", wallet);

        setState("loading", false); // finished all main loading activity
    })

    const appState = [state, { updateConfig }];

    onMount(async () => {
        const config = await load_config();
        setState("config", config);
        await reload();
    });

    return (
        <AppContext.Provider value={appState}>
            {props.children}
        </AppContext.Provider>
    );
}

export function useAppContext() { return useContext(AppContext); }
