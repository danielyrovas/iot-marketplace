import { createContext, createResource, createSignal, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import Wallet from "senshamartproject/wallet/wallet";
import ChainUtil from "senshamartproject/util/chain-util";
import { load_config, save_config } from "./config";
import Blockchain from "senshamartproject/blockchain/blockchain";
import BlockchainProp from "senshamartproject/network/blockchain-prop";
import { invoke } from "@tauri-apps/api";

'use strict';

export const AppContext = createContext();

export function AppContextProvider(props) {
    const [state, setState] = createStore({
        loading: true,
        config: null,
        keyPair: null,
        wallet: null,
        blockchain: null,
        chainServer: null,
        raw_persisted_chain: null,
        // TODO: save to disk queue
        // TODO: add peer: 136.186.108.241:3002
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

        // TODO: save if there is an existing chain
        //
        // if (state.blockchain !== null) {
        // Blockchain.saveToDisk(state.config.blockchain_location)
        // }
        const raw_persisted_chain = await invoke("load_blockchain");
        setState("raw_persisted_chain", raw_persisted_chain);
        const loadChain = (location) => {
            return state.raw_persisted_chain;
        }
        const saveChain = (async (location, serialized_chain) => {
            invoke("save_blockchain", { serialized_chain: serialized_chain });
        });
        const blockchain = Blockchain.loadFromDiskOverrideFS(state.config.blockchain_location, saveChain, loadChain);
        const chainServer = new BlockchainProp("Wallet-chain-server", blockchain);
        setState("blockchain", blockchain);
        setState("chainServer", chainServer);

        setState("loading", false); // finished all main loading activity
    });

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
