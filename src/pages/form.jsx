import { createForm } from '@felte/solid';
import { createSignal } from 'solid-js';
import { TextInput } from '../components/basic';
import { ValidationMessage, reporter } from '@felte/reporter-solid';

export default function Form() {
    const [msg, setMsg] = createSignal("No Cigar");
    const { form, errors } = createForm({
        validate(values) {
            const errors = {};
            if (!values.email) {
                errors.email = 'email must exist';
            } else if (values.email.length < 5) {
                errors.email = 'email is too short';
            }
            return errors;
        },
        onSubmit: (values) => {
            setMsg(JSON.stringify(values));
        },
        extend: reporter
    });

    return (
        <div>
            <form class="p-10 flex flex-col justify-center mt-4" use: form>
                <TextInput
                    label="Email"
                    name="email"
                    placeholder="email@email.com"
                    class="m-4" />
                <TextInput placeholder="password"
                    class="m-4"
                    label="Password"
                    type="password"
                    name="password" />

                <input class="btn m-4" type="submit" value="Sign in" />
            </form>
            <p class="mt-4">{msg()}</p>
        </div>
    );
}
