import { invoke } from "@tauri-apps/api/tauri";
import ChainUtil from "senshamartproject/util/chain-util";
import { lazy } from "solid-js";

export async function load_config() {
    let config = await invoke("load_config");
    config = await is_valid_or_default(config);
    return config;
}

export async function save_config(config) {
    console.log("saving config to disk", JSON.stringify(config));
    return await invoke("save_config", { config: config });
}

async function is_valid_or_default(config) {
    let cnf = {};
    let contains_generated = false;

    if (config.wallet_key === null || config.wallet_key === "") {
        contains_generated = true;
        cnf.wallet_key = ChainUtil.serializeKeyPair(ChainUtil.genKeyPair());
    } else {
        cnf.wallet_key = config.wallet_key;
    }

    if (contains_generated) {
        await save_config(cnf);
    }
    return cnf;
}
