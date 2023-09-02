// import { invoke } from "@tauri-apps/api/tauri";
import { createSignal } from "solid-js";
import { TextInput } from "../components/basic";
import { save_config, load_config } from "../logic/config";
import { clear_field_message, set_field_message } from "../logic/form";

export default function Settings() {
    const [key, setKey] = createSignal("");
    const [saveMsg, setSaveMsg] = createSignal("");
    const [loadMsg, setLoadMsg] = createSignal("");

    async function save() {
        setSaveMsg(await save_config({ wallet_key: key() }));
    }
    async function load() {
        setLoadMsg(JSON.stringify(await load_config()));
    }

    const wallet_key_handler = (event) => {
        const e = event.currentTarget;
        setKey(e.value)
        if (key().length > 0 && key().length < 60) {
            set_field_message(e, "Key is too short");
        } else if (key().length > 80) {
            set_field_message(e, "Key is too long");
        } else {
            clear_field_message(e)
        }
    }

    return (
        <div class="m-[10px]">
            <div class="flex-row justify-between">
                <div class="flex justify-center m-4">
                    <TextInput
                        label="Wallet Key"
                        name="wallet_key"
                        class="w-[30rem]"
                        key={key()}
                        onChange={wallet_key_handler}
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
