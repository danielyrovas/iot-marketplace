import { createForm } from '@felte/solid';
import { createSignal, For, Show } from "solid-js";
import { reporter } from '@felte/reporter-solid';
import { TextInput } from "../components/basic";
import { createStore } from 'solid-js/store';

const isString = (str) => {
    return typeof str === 'string' && isNaN(str);
  };
  

export default function RegisterBroker() {

    const [showConfirmation, setShowConfirmation] = createSignal(false);
    const [extraNodes, setExtraNodes] = createStore([]);
    const [extraLiterals, setExtraLiterals] = createStore([]);
    const [showBrokerLocation, setShowBrokerLocation] = createSignal(false);
    const [brokerLocation, setBrokerLocation] = createSignal('');
    const [showBrokerType, setShowBrokerType] = createSignal(false);
    const [brokerType, setBrokerType] = createSignal('');
    const [data, setData] = createSignal('');
    const { form, errors, setFields, createSubmitHandler } = createForm({
        
        validate(values) {

            const errors = {};
            if (!values.name) {
            } else if (values.name.length < 5) {
                errors.name = "please add a broker name, broker name can't be empty";
            }
            if (!values.name) {
            } else if (!isString(values.name)) {
                errors.endPoint = "please use alphabets, integers format are not allowed";
            }
            if (!values.endPoint) {
            } else if (!isString(values.endPoint)) {
                errors.endPoint = "please use alphabets, integers format are not allowed";
            }
            if (!values.brokerLocation) {
            } else if (values.brokerLocation.length < 5) {
                errors.brokerLocation = "Broker Location should be filled";
            }
            if (!values.brokerType) {
            } else if (values.brokerType.length < 5) {
                errors.brokerType = "Broker Type should be filled";
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
        }
    });

    const resetForm = () => {
        const confirmed = window.confirm('Are you sure you want to reset the form?');
        if (confirmed) {
        form.reset();
        setExtraNodes([]);
        setBrokerLocation('');
        setShowBrokerLocation(false);
        setBrokerType('');
        setShowBrokerType(false);
        setData('');
        }
      };

      const handleConfirmation = () => {
        const confirmed = window.confirm('Are you sure you want to confirm?');
    
        if (confirmed) {
            realSubmit();
        }
    };

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
                        label="Endpoint"
                        name="endPoint"
                    />
                
                <button class="btn p-4 ml-4" onClick={() => setShowBrokerLocation(!showBrokerLocation())}>
                    Add Broker Location
                 </button>
                <Show when={showBrokerLocation()}>
                    <TextInput
                        class="w-[40rem]"
                        label="Broker Location"
                        name="brokerLocation"
                        value={brokerLocation()} 
                        onInput={(e) => setBrokerLocation(e.target.value)} 
                    />
                </Show>

                <button class="btn p-4 ml-4" onClick={() => setShowBrokerType(!showBrokerType())}>
                    Add Broker Type
                 </button>
                <Show when={showBrokerType()}>
                    <TextInput
                        class="w-[40rem]"
                        label="Broker Type"
                        name="brokerType"
                        value={brokerType()} 
                        onInput={(e) => setBrokerType(e.target.value)} 
                    />
                </Show>


                    <h1 class="text-2xl font-bold text-center"> RDF Triples</h1>
                </div>
                <For each={extraNodes}>
                    {(_, i) => {
                        return (
                            <div class="flex flex-col place-items-center m-2">
                                <h1 class="text-center divider">RDF Triples {i() + 1}</h1>
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
                        <Show when={extraLiterals.length > 1}>
                            <button class="btn btn-primary p-4" onClick={
                                () => {
                                    setExtraLiterals(extraLiterals.slice(0, -1));
                                }}>
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </Show>
                        <button class="btn p-4 ml-4" onClick={
                            () => setExtraLiterals([...extraLiterals, {}])}>
                            Add RDF Literals <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <For each={extraLiterals}>
                    {(_, i) => {
                        return (
                            <div class="flex flex-col place-items-center m-2">
                                <h1 class="text-center divider">RDF Literals {i() + 1}</h1>
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Subject ${i() + 1}`}
                                    name={`extraLiterals.${i()}.rdfSubject`}

                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Predicate ${i() + 1}`}
                                    name={`extraLiterals.${i()}.rdfPredicate`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Object ${i() + 1}`}
                                    name={`extraLiterals.${i()}.rdfObject`}
                                />
                            </div>
                        )
                    }}
                </For>
                <div class="flex flex-col place-items-center m-2">
                    <div class="flex flex-row justify-end w-[40rem] ">
                        <Show when={extraLiterals.length > 1}>
                            <button class="btn btn-primary p-4" onClick={
                                () => {
                                    setExtraLiterals(extraLiterals.slice(0, -1));
                                }}>
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </Show>
                        <button class="btn p-4 ml-4" onClick={
                            () => setExtraLiterals([...extraLiterals, {}])}>
                            Add RDF Triples <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>


                <div class="flex justify-center m-4">
                    <button class="btn" type="submit" onClick={realSubmit}>
                        Register Broker <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="flex justify-center m-4">
                    <button class="btn" type="reset" onClick={resetForm} >
                        Reset form <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <div class="flex justify-center m-4">
                    <button class="btn" type="button" onClick={() => setShowConfirmation(true)}>
                        Confirmation <i class="fa-solid fa-paper-plane"></i>
                     </button>
                </div>
               
                {showConfirmation() && (
                <div class="confirmation-dialog">
                    <p>Are you sure you want to confirm?</p>
                    <button onClick={handleConfirmation}>Yes</button>
                    <button onClick={() => setShowConfirmation(false)}>No</button>
                </div>
)}
                
            </form>
            <pre>{data()}</pre>
        </div>
    );
}
