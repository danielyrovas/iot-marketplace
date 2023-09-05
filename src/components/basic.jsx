import { splitProps, Show, createSignal } from "solid-js";
import { reporter, ValidationMessage } from '@felte/reporter-solid';
import { createForm } from '@felte/solid';
import { document } from "postcss";

export const Button = (props) => {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <button {...rest} class={"btn btn-primary " + local.class}>
            {local.children}
        </button>
    );
};

export const TextInputOld = (props) => {
    const [local, rest] = splitProps(props, [
        "class",
        "type",
        "name",
        "label",
        "labelClass",
        "inputClass",
    ]);
    return (
        <div class={"form-control " + (local.class || "")}>
            <Show when={local.label}>
                <label class={"label " + (local.labelClass || "")}
                    for={local.name} >
                    <span class="w-full label-text">{local.label}</span>
                </label>
            </Show>
            <input type={local.type || "text"} name={local.name}
                {...rest}
                class={"input input-bordered " + (local.inputClass || "")}
            />
            <ValidationMessage for={local.name}>
                {(message) => <span class="invalid-feedback">{message?.[0]}</span>}
            </ValidationMessage>
        </div>
    );
}
export const TextInputOld2 = (props) => {
    const [local, rest] = splitProps(props, [
        "class",
        "type",
        "name",
        "label",
        "labelClass",
        "inputClass",
    ]);
    return (
        <div class={"form-control " + (local.class || "")}
        >
            <Show when={local.label}>
                <label
                    class={"label " + (local.labelClass || "")}
                    for={local.name}
                >
                    <span class="w-full label-text">{local.label}</span>
                </label>
            </Show>
            <input
                {...rest}
                name={local.name}
                type={local.type || "text"}
                class={"input input-bordered " + (local.inputClass || "")}
            />
            <Show when={s}>
                <div class="invalid-feedback">{}</div>
            </Show>
        </div>
    );
};
export const TextInput = (props) => {
    const [invalid, setInvalid] = createSignal(false);
    const [local, rest] = splitProps(props, [
        "class",
        "type",
        "name",
        "label",
        "labelClass",
        "inputClass",
    ]);
    return (
        <div class={"form-control " + (local.class || "")}>
            <Show when={local.label}>
                <label class={"label " + (local.labelClass || "")}
                    for={local.name} >
                    <span class="w-full label-text">{local.label}</span>
                </label>
            </Show>
            <input id={local.name} type={local.type || "text"} name={local.name}
                {...rest}
                class={"input input-bordered " + (local.inputClass || "")}
                classList={{ "input-error": invalid() }}
            />
            <ValidationMessage for={local.name}>
                {(message) => {
                    if (message?.[0].length > 0) { setInvalid(true); }
                    else { setInvalid(false); }
                    return (
                        <label class="label error" for={local.name}>
                            <span class="text-error invalid-feedback">{message?.[0]}</span>
                        </label>
                    );
                }
                }
            </ValidationMessage>
        </div>
    );
}
