import { createForm } from '@felte/solid';
import { createSignal, For, Show } from "solid-js";
import { reporter } from '@felte/reporter-solid';
import { useAppContext } from "../logic/context";
import { TextInput } from "../components/basic";
import { createStore } from 'solid-js/store';
import ChainUtil from "senshamartproject/util/chain-util";
import { Body, fetch } from '@tauri-apps/api/http'

const isString = (str) => {
    return typeof str === 'string' && isNaN(str);
};

export default function RegisterBroker() {
    const [rawCheck, setRawCheck] = createStore({ visible: false });
    const [state, { updateConfig }] = useAppContext();
    const [showConfirmation, setShowConfirmation] = createSignal(false);
    const [extraNodes, setExtraNodes] = createStore([]);
    const [showBrokerLocation, setShowBrokerLocation] = createSignal(false);
    const [brokerLocation, setBrokerLocation] = createSignal('');
    const [data, setData] = createSignal('');
    const [submitResult, setSubmitResult] = createSignal('');

    const [presets, setPresets] = createStore([
        {
            name: 'Location',
            icon: 'location-dot',
            visible: true,
        },
    ]);

    const { form, errors, setFields, createSubmitHandler } = createForm({

        validate(values) {

            const errors = {};
            if (!values.brokerName) {
            } else if (values.brokerName.length < 5) {
                errors.brokerName = "please add a broker name, broker name can't be empty";
            }
            // if (!values.brokerName) {
            // } else if (!isString(values.brokerName)) {
            //     errors.brokerName = "please use alphabets, integers format are not allowed";
            // }
            // if (!values.endpoint) {
            // } else if (!isString(values.endpoint)) {
            //     errors.endpoint = "please use alphabets, integers format are not allowed";
            // }
            return errors;
        },
        onSubmit: (values) => {
        },
        extend: reporter,
    });

    const realSubmit = createSubmitHandler({
        onSubmit: (values) => {

            let brokerData = {}

            brokerData.brokerName = values.brokerName;
            brokerData.endpoint = values.endpoint;
            brokerData.rewardAmount = parseInt(values.rewardAmount);
            brokerData.extraNodeMetadata = [];
            brokerData.extraLiteralMetadata = [];

            if (typeof values.longitude !== 'undefined') {
                brokerData.extraNodeMetadata.push(
                    {
                        s: `SSMS://#${brokerData.brokerName}`,
                        p: 'http://www.w3.org/ns/sosa/hasFeatureOfInterest',
                        o: `SSMS://#${brokerData.brokerName}#location`,
                    },
                    {
                        s: `SSMS://#${brokerData.brokerName}#location`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: `http://www.w3.org/ns/sosa/hasFeatureOfInterest`,
                    },
                    {
                        s: `SSMS://#${brokerData.brokerName}#location`,
                        p: 'http://www.w3.org/ns/sosa/isSampleOf',
                        o: `SSMS://earth`,
                    },
                    {
                        s: `SSMS://earth`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: `http://www.w3.org/ns/sosa/hasFeatureOfInterest`,
                    },
                );
                brokerData.extraLiteralMetadata.push(
                    {
                        s: `SSMS://#${brokerData.brokerName}#location`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#label',
                        o: `location of #${brokerData.brokerName}`,
                    },
                    {
                        s: `SSMS://#${brokerData.brokerName}#location`,
                        p: 'http://www.w3.org/2003/01/geo/wgs84_pos#lat',
                        o: parseFloat(values.latitude),
                    },
                    {
                        s: `SSMS://#${brokerData.brokerName}#location`,
                        p: 'http://www.w3.org/2003/01/geo/wgs84_pos#long',
                        o: parseFloat(values.longitude),
                    },
                    {
                        s: `SSMS://#${brokerData.brokerName}#location`,
                        p: 'http://www.w3.org/2003/01/geo/wgs84_pos#alt',
                        o: parseFloat(values.altitude),
                    },
                    {
                        s: 'SSMS://earth',
                        p: 'http://www.w3.org/2000/01/rdf-schema#label',
                        o: 'earth',
                    },
                );
            }

            values.extras?.forEach((extra) => {
                if (extra.literal) {
                    brokerData.extraLiteralMetadata.push({
                        s: extra.rdfSubject,
                        p: extra.rdfPredicate,
                        o: extra.rdfObject,
                    });
                } else {
                    brokerData.extraNodeMetadata.push({
                        s: extra.rdfSubject,
                        p: extra.rdfPredicate,
                        o: extra.rdfObject,
                    });
                }
            })
            const brokerRegistrationValidators = {
                brokerName: ChainUtil.validateIsString,
                endpoint: ChainUtil.validateIsString,
                rewardAmount: ChainUtil.createValidateIsIntegerWithMin(0),
                extraNodeMetadata: ChainUtil.createValidateOptional(
                    ChainUtil.validateIsObject),
                extraLiteralMetadata: ChainUtil.createValidateOptional(
                    ChainUtil.validateIsObject)
            };
            const validateRes = ChainUtil.validateObject(brokerData, brokerRegistrationValidators);
            if (!validateRes.result) {
                setSubmitResult(validateRes.reason)
            } else {
                setSubmitResult('')
                submitBrokerRegistration(brokerData);
            }
            setData(`${JSON.stringify(brokerData, null, 2)}`);
            if (values.rawCheck) {
                setRawCheck({ visible: true });
            } else {
                setRawCheck({ visible: false });
            }
        }
    })

    const submitBrokerRegistration = async (brokerData) => {
        let response = await fetch(`${state.api}/BrokerRegistration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: Body.json(brokerData)
        })

        console.log(`data: ${response.status}`);
        if (typeof response.data.input === 'undefined') {
            setSubmitResult('Failed to register broker.');
        } else if (typeof response.data.input === 'string') {
            setSubmitResult('The registration transaction has been successfully submitted.');
        } else {
            setSubmitResult('');
        }
    };

    const handleConfirmation = () => {
        setShowConfirmation(true);
    };

    const handleDataDisplay = () => {
        setShowConfirmation(false);
        realSubmit();
        setShowData(true);
    };


    return (
        <div>
            <form use: form>
                <div class="flex flex-col place-items-center m-4">
                    <TextInput
                        class="w-[40rem]"
                        label="Broker name"
                        name="brokerName"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Endpoint"
                        name="endpoint"
                    />

                    <TextInput
                        class="w-[40rem]"
                        label="Reward Amount"
                        name="rewardAmount"
                    />

                </div>
                <h1 class="text-2xl font-bold text-center"> RDF Triples</h1>
                <div class="flex flex-row space-x-4 justify-center w-[40rem] p-4 mx-auto">
                    <For each={presets}>
                        {(preset, i) => {
                            return (
                                <Show when={preset.visible}>
                                    <button class="btn btn-primary p-4" onClick={() => {
                                        setPresets(i(), { visible: false })
                                    }}>
                                        <i class={`fa-solid fa-${preset.icon}`}></i>
                                        {preset.name}
                                        <i class={`fa-solid fa-plus`}></i>
                                    </button>
                                </Show>
                            )
                        }}
                    </For>
                </div>

                <Show when={!presets[0].visible}>
                    <div class="flex flex-row justify-between w-[40rem] m-2 mx-auto">
                        <div class='tooltip w-[32%]' data-tip='Broker location: longitude'>
                            <TextInput
                                label='Longitude'
                                name='longitude'
                            />
                        </div>
                        <div class='tooltip w-[32%]' data-tip='Broker location: latitude'>
                            <TextInput
                                label='Latitude'
                                name='latitude'
                            />
                        </div>
                        <div class='tooltip w-[32%]' data-tip='Broker location: altitude'>
                            <TextInput
                                label='Altitude'
                                name='altitude'
                            />
                        </div>
                    </div>
                </Show>

                <Show when={showBrokerLocation()}>
                    <TextInput
                        class="w-[40rem]"
                        label="Broker Location"
                        name="brokerLocation"
                        value={brokerLocation()}
                        onInput={(e) => setBrokerLocation(e.target.value)}
                    />
                </Show>
                <For each={extraNodes}>
                    {(_, i) => {
                        return (
                            <div class="flex flex-col place-items-center m-2">
                                <h1 class="text-center divider">RDF Triples {i() + 1}</h1>
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Subject ${i() + 1}`}
                                    name={`extras.${i()}.rdfSubject`}

                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Predicate ${i() + 1}`}
                                    name={`extras.${i()}.rdfPredicate`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Object ${i() + 1}`}
                                    name={`extras.${i()}.rdfObject`}
                                />

                                <div class="flex flex-row place-items-start w-[40rem] m-2">
                                    <input name={`extras.${i()}.literal`} type="checkbox" class="checkbox p-4" />
                                    <label class='label ms-2' for={`extras.${i()}.literal`}>RDF Literal?</label>
                                </div>
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
                            Add RDF Triples <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="flex flex-row space-x-4 justify-center w-[40rem] p-4">
                        <input name='rawCheck' type="checkbox" class="checkbox p-4" />
                        <label class='label ms-2'>Show raw data on submit</label>
                    </div>
                </div>
                <div class="flex justify-center m-4">
                    <button class="btn" type="submit" onClick={handleConfirmation}>
                        Register Broker <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                {showConfirmation() && (
                    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div class="bg-white p-8 rounded-lg shadow-lg">
                            <p class="text-xl font-semibold mb-4">Confirm Registration</p>
                            <p class="mb-4">Are you sure you want to register?</p>
                            <div class="flex justify-center">
                                <button class="btn btn-primary" onClick={handleDataDisplay}>Yes</button>
                                <button class="btn btn-secondary ml-2" onClick={() => setShowConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                )}

                <Show when={submitResult() !== ''}>
                    <h1 class="text-center divider">Registration Result</h1>
                    <div class="prose max-w-none">
                        <pre class="language-js"><code class="language-js">{submitResult()}</code></pre>
                    </div>
                </Show>

            </form>
            <Show when={rawCheck.visible}>
                <h1 class="text-center divider">Submitted raw data</h1>
                <div class="prose max-w-none">
                    <pre class="language-js"><code class="language-js">{data()}</code></pre>
                </div>
            </Show>
        </div>
    );
}