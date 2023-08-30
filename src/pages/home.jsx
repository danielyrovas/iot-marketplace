import { invoke } from "@tauri-apps/api/tauri";
import { createSignal } from "solid-js";
import { TextInput } from "../components/basic";

export default function About() {
    const [key, setKey] = createSignal("");
    const [saveMsg, setSaveMsg] = createSignal("");
    const [loadMsg, setLoadMsg] = createSignal("");

    async function save() {
        setSaveMsg(await invoke("save_config", { config: { wallet_key: key() } }));
    }
    async function load() {
        setLoadMsg(JSON.stringify(await invoke("load_config")));
    }

    return (
        <div class="m-[10px]">
            <p></p>
            <div class="flex-row justify-between">
                <div class="flex justify-center m-4">
                    <TextInput
                        label="Wallet Key"
                        name="wallet_key"
                        class="w-[30rem]"
                        onChange={(e) => setKey(e.currentTarget.value)}
                    />
                </div>
                <div class="flex justify-center m-4">
                    <button class="btn" type="button" onClick={() => save()}>
                        Save
                    </button>
                </div>
                <div class="flex justify-center m-4">
                    <button class="btn" type="button" onClick={() => load()}>
                        Load Config
                    </button>
                </div>
            </div>

            <p>{saveMsg()}</p>
            <h1>Config:</h1>
            <p>{loadMsg()}</p>
        </div>
    );
}
