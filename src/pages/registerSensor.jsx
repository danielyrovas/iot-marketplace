import { createForm } from '@felte/solid';
import { createSignal, For, Show } from "solid-js";
import { reporter } from '@felte/reporter-solid';
// import { useAppContext } from "../logic/context";
import { TextInput } from "../components/basic";
import { createStore } from 'solid-js/store';

export default function RegisterSensor() {
    // const [state, { updateConfig }] = useAppContext();
    const [extraNodes, setExtraNodes] = createStore([]);
    const [data, setData] = createSignal('');
    const { form, errors, setFields, createSubmitHandler } = createForm({
        validate(values) {
            const errors = {};
            return errors;
        },
        onSubmit: (values) => {
            console.log(JSON.stringify(values));
            console.log(JSON.stringify(extraNodes));
            setData(JSON.stringify(values, null, 2));
            // updateConfig("wallet_key", values.wallet_key);
            // setViewEdit(false);
        },
        extend: reporter,
    });

    const realSubmit = createSubmitHandler({
        onSubmit: (values) => console.log('Alternative onSubmit', JSON.stringify(values, null, 2)),
    });

    return (
        <div>
            <form use: form>
                <div class="flex flex-col place-items-center m-4">
                    <TextInput
                        class="w-[40rem]"
                        label="Name"
                        name="name"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Cost per minute"
                        name="costPerMinute"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Cost per KB"
                        name="costPerKB"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Integration broker"
                        name="integrationBroker"
                    />
                    <h1 class="text-2xl font-bold text-center">RDF Triples</h1>
                </div>
                <For each={extraNodes}>
                    {(_, i) => {
                        return (
                            <div class="flex flex-col place-items-center m-2">
                                <h1 class="text-center divider">RDF Triple {i() + 1}</h1>
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Subject ${i() + 1}`}
                                    name={`extraNodes.${i()}.rdfSubject`}

                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Predicate ${i() + 1}`}
                                    name={`extraNodes.${i()}.rdfPredicate`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Object ${i() + 1}`}
                                    name={`extraNodes.${i()}.rdfObject`}
                                />
                            </div>
                        )
                    }}
                </For>
                <div class="flex flex-col place-items-center m-2">
                    <div class="flex flex-row justify-end w-[40rem] ">
                        <Show when={extraNodes.length > 1}>
                            <button class="btn btn-primary p-4" onClick={
                                () => {
                                    setExtraNodes(extraNodes.slice(0, -1));
                                }}>
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </Show>
                        <button class="btn p-4 ml-4" onClick={
                            () => setExtraNodes([...extraNodes, {}])}>
                            Add RDF Triple<i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="flex justify-center m-4">
                    <button class="btn" type="submit" onClick={realSubmit}>
                        Register Sensor <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </form>
            <pre>{data()}</pre>
        </div>
    );
}
