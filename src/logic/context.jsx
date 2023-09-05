import { createContext, createResource, createSignal, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import Wallet from "senshamartproject/wallet/wallet";
import ChainUtil from "senshamartproject/util/chain-util";
import { load_config } from "./config";

export const AppContext = createContext();

const sleep = ms => new Promise(r => setTimeout(r, ms));

export function AppContextProvider(props) {
    const [state, setState] = createStore({
        loading: true,
        config: {},
        keyPair: {},
        wallet: {},
    });

    const appState = [state];

    onMount(async () => {
        // await sleep(3000);
        const config = await load_config();
        setState("config", config);
        const keyPair = ChainUtil.deserializeKeyPair(config.wallet_key);
        setState("keyPair", keyPair);
        const wallet = new Wallet(keyPair);
        setState("wallet", wallet);

        setState("loading", false); // finished all main loading activity
    });

    return (
        <AppContext.Provider value={appState}>
            {props.children}
        </AppContext.Provider>
    );
}

export function useAppContext() { return useContext(AppContext); }
