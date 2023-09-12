import { createForm } from '@felte/solid';
import { createSignal, For, Show } from "solid-js";
import { reporter } from '@felte/reporter-solid';
import { useAppContext } from "../logic/context";
import { TextInput } from "../components/basic";
import { createStore } from 'solid-js/store';
import ChainUtil from "senshamartproject/util/chain-util";

const isNumeric = (str) => {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

export default function RegisterSensor() {
    const [state, { updateConfig }] = useAppContext();
    const [extraNodes, setExtraNodes] = createStore([]);
    const [data, setData] = createSignal('');
    const { form, errors, setFields, createSubmitHandler } = createForm({
        validate(values) {

            const errors = {};
            if (!values.name) {
            } else if (values.name.length < 5) {
                errors.name = "please add a descriptive name";
            }
            if (!values.costPerMinute) {
            } else if (!isNumeric(values.costPerMinute)) {
                errors.costPerMinute = "please use integers";
            }
            return errors;
        },
        onSubmit: (values) => {
            // console.log(JSON.stringify(values));
            // console.log(JSON.stringify(extraNodes));
        },
        extend: reporter,
    });

    const realSubmit = createSubmitHandler({
        onSubmit: (values) => {
            console.log('Alternative onSubmit', JSON.stringify(values, null, 2))
            setData(JSON.stringify(values, null, 2));

            values.costPerMinute = parseInt(values.costPerMinute);
            values.costPerKB = parseInt(values.costPerKB);

            const sensorRegistrationValidators = {
                sensorName: ChainUtil.validateIsString,
                costPerMinute: ChainUtil.createValidateIsIntegerWithMin(0),
                costPerKB: ChainUtil.createValidateIsIntegerWithMin(0),
                integrationBroker: ChainUtil.validateIsString,
                rewardAmount: ChainUtil.createValidateIsIntegerWithMin(0),
                extraNodeMetadata: ChainUtil.createValidateOptional(
                    ChainUtil.validateIsObject),
                extraLiteralMetadata: ChainUtil.createValidateOptional(
                    ChainUtil.validateIsObject)
            };
            const validateRes = ChainUtil.validateObject(values, sensorRegistrationValidators);

            if (!validateRes.result) {
                setData(`${data()}\n${validateRes.reason}`);
                return;
            }

            // try {
            //     const reg = wallet.createSensorRegistrationAsTransaction(
            //         blockchain,
            //         values.rewardAmount,
            //         values.sensorName,
            //         values.costPerMinute,
            //         values.costPerKB,
            //         values.integrationBroker,
            //         values.extraNodeMetadata,
            //         values.extraLiteralMetadata
            //     );
            //     chainServer.sendTx(reg);
            //
            //     // tx: reg.transaction
            // } catch (err) {
            //     console.log(err);
            //     setData(`${data()}\n${err.message}`);
            // }
        }
    });

    return (
        <div>
            <form use: form>
                <div class="flex flex-col place-items-center m-4">
                    <TextInput
                        class="w-[40rem]"
                        label="Name"
                        name="sensorName"
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
                        <Show when={extraNodes.length > 0}>
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
