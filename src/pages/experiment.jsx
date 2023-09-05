// import { createForm } from '@felte/solid';
import { createSignal } from 'solid-js';
// import { TextInput } from '../components/basic';
// import { ValidationMessage, reporter } from '@felte/reporter-solid';
import Wallet from "senshamartproject/wallet/wallet";
import ChainUtil from 'senshamartproject/util/chain-util';

export default function Form() {
    const [msg, setMsg] = createSignal("No Cigar");
    // const { form, errors } = createForm({
    //     validate(values) {
    //         const errors = {};
    //         if (!values.email) {
    //             errors.email = 'email must exist';
    //         } else if (values.email.length < 5) {
    //             errors.email = 'email is too short';
    //         }
    //         return errors;
    //     },
    //     onSubmit: (values) => {
    //         setMsg(JSON.stringify(values));
    //     },
    //     extend: reporter
    // });
    //
    let keyPair = ChainUtil.serializeKeyPair(ChainUtil.genKeyPair());
    keyPair = ChainUtil.deserializeKeyPair(keyPair);
    // setMsg(JSON.stringify(keyPair));
    const wallet = new Wallet(keyPair);
    setMsg(JSON.stringify(wallet));
    return (
        <div>
            {/* <form class="p-10 flex flex-col justify-center mt-4" use: form> */}
            {/*     <TextInput */}
            {/*         label="Email" */}
            {/*         name="email" */}
            {/*         placeholder="email@email.com" */}
            {/*         class="m-4" /> */}
            {/*     <TextInput placeholder="password" */}
            {/*         class="m-4" */}
            {/*         label="Password" */}
            {/*         type="password" */}
            {/*         name="password" /> */}
            {/**/}
            {/*     <input class="btn m-4" type="submit" value="Sign in" /> */}
            {/* </form> */}
            <p class="mt-4">{msg()}</p>
        </div>
    );
}
