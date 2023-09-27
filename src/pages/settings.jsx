import { createSignal } from "solid-js";
import { TextInput } from "../components/basic";
import { createForm } from "@felte/solid";
import { reporter, ValidationMessage } from "@felte/reporter-solid";
import { useAppContext } from "../logic/context";
import { fetch } from '@tauri-apps/api/http';
import ChainUtil from "senshamartproject/util/chain-util";

export default function Settings() {
    const [state, { updateConfig }] = useAppContext();
    const [viewEdit, setViewEdit] = createSignal(false);
    const { form, errors, setFields } = createForm({
        validate(values) {
            const errors = {};
            if (!values.wallet_key) {
            } else if (
                values.wallet_key.length < 60 ||
                values.wallet_key.length > 65
            ) {
                errors.wallet_key = "your wallet key does not look correct";
            }
            return errors;
        },
        onSubmit: (values) => {
            console.log(JSON.stringify(values));
            updateConfig("wallet_key", values.wallet_key);
            setViewEdit(false);
        },
        extend: reporter,
        initialValues: {
            wallet_key: state.config.wallet_key,
        },
    });
    const generate_key = () => {
        const key = ChainUtil.serializeKeyPair(ChainUtil.genKeyPair());
        setFields("wallet_key", key, true);
    };
    const [publicKey, setPublicKey] = createSignal("");

    fetch(`${state.api}/public-key`).then((key) => {
        // fetch(`${state.api}/public-key`).then((key) => {
        if (key.ok) {
            setPublicKey(key.data);
        }
    })
    if (state.config.wallet_key === "") {
        fetch(`${state.api}/key-pair`).then((key) => {
            // fetch(`${state.api}/public-key`).then((key) => {
            if (key.ok) {
                updateConfig("wallet_key", key.data);
            }
        })
    }

    return (
        <div class="m-[10px]">
            <div class="flex-row justify-between">
                <Show when={!viewEdit()}>
                    <div class="flex justify-center m-4">
                        <TextInput
                            label="Wallet Key"
                            name="wallet_key"
                            class="w-[37rem]"
                            disabled={true}
                            value={state.config.wallet_key}
                        />
                        {/* TODO: Public key (about page?) */}
                    </div>
                    <div class="flex justify-center m-4">
                        <button type="button" class="btn" onClick={() => setViewEdit(true)}>
                            Edit <i class="fa-regular fa-pen-to-square" />
                        </button>
                    </div>

                    <div class="flex justify-center m-4">
                        <TextInput
                            label="Your Public Key"
                            name="publicKey"
                            class="w-[37rem]"
                            disabled={true}
                            value={publicKey()}
                        />
                    </div>
                </Show>
                <Show when={viewEdit()}>
                    <div>
                        <form use: form>
                            <div class="flex justify-center m-4">
                                <TextInput
                                    label="Wallet Key"
                                    name="wallet_key"
                                    class="w-[37rem]"
                                />
                            </div>
                            <div class="flex justify-center m-4">
                                <button class="btn" type="submit">
                                    Save <i class="fa-regular fa-floppy-disk" />
                                </button>
                            </div>
                        </form>
                        <div class="flex justify-center m-4">
                            <button type="button" class="btn" onClick={generate_key}>
                                Generate New Key <i class="fa-solid fa-rotate" />
                            </button>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}
