import { createSignal } from "solid-js";
import { TextInput } from "../components/basic";
import { save_config, load_config } from "../logic/config";
import { createForm } from '@felte/solid';
import { reporter } from '@felte/reporter-solid';

export default function Settings() {
    const [key, setKey] = createSignal("");
    const [viewEdit, setViewEdit] = createSignal(false);
    const [saveMsg, setSaveMsg] = createSignal("");
    const [loadMsg, setLoadMsg] = createSignal("");

    async function save() {
        setSaveMsg(await save_config({ wallet_key: key() }));
    }
    async function load() {
        console.log('loading');
        setLoadMsg(JSON.stringify(await load_config()));
    }

    const { form, errors } = createForm({
        validate(values) {
            const errors = {};
            if (!values.wallet_key) {
            } else if (values.email.length < 5) {
                errors.wallet_key = 'your wallet key does not look correct';
            }
            return errors;
        },
        onSubmit: (values) => {
            setLoadMsg(JSON.stringify(values));
        },
        extend: reporter
    });
    return (
        <div class="m-[10px]">
            {load()}
            <div class="flex-row justify-between">
                {!viewEdit() &&
                    <button class="btn" onClick={() => setViewEdit(true)}>
                        Edit
                        <i class="fa-regular fa-pen-to-square" />
                    </button>
                }
                {viewEdit() &&
                    <form class="flex justify-center m-4" use: form>
                        <TextInput
                            label="Wallet Key"
                            name="wallet_key"
                            class="w-[30rem]" />
                        <input class="btn m-4" type="submit" value="Save" />
                    </form>
                }
            </div>

            {/* <p>{saveMsg()}</p> */}
            {/* <h1>Current Config:</h1> */}
            {/* <p>{loadMsg()}</p> */}
        </div>
    );
}
