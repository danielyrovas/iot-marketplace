import {
	createContext,
	createResource,
	createSignal,
	onMount,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import Wallet from "senshamartproject/wallet/wallet";
import ChainUtil from "senshamartproject/util/chain-util";
import Blockchain from "senshamartproject/blockchain/blockchain";
import BlockchainProp from "senshamartproject/network/blockchain-prop";
import { fs, invoke } from "@tauri-apps/api";
import { Command } from "@tauri-apps/api/shell";
import { emit, listen } from "@tauri-apps/api/event";

("use strict");

export const AppContext = createContext();

export function AppContextProvider(props) {
	const [state, setState] = createStore({
		config: null,
		api: "http://localhost:4000",
		// TODO: add peer: 136.186.108.241:3002
	});

	const updateConfig = (key, value) => {
		const update = {};
		update[key] = value;
		setState("config", update);
		invoke("save_config", { config: state.config });
	};

	const appState = [state, { updateConfig }];

	onMount(async () => {
		const config = await invoke("load_config");
		setState("config", config);
	});

	return (
		<AppContext.Provider value={appState}>{props.children}</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
