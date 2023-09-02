import { splitProps, Show } from "solid-js";

export const Button = (props) => {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <button {...rest} class={"btn btn-primary " + local.class}>
            {local.children}
        </button>
    );
};

export const TextInput = (props) => {
    // const [local, rest] = splitProps(props, [
    //     "class",
    //     "type",
    //     "name",
    //     "label",
    //     "labelClass",
    //     "inputClass",
    // ]);
    return (
        <div class={"form-control " + (props.class || "")}
        >
            <Show when={props.label}>
                <label
                    class={"label " + (props.labelClass || "")}
                    for={props.name}
                >
                    <span class="w-full label-text">{props.label}</span>
                </label>
            </Show>
            <input
                {...props}
                type={props.type || "text"}
                class={"input input-bordered " + (props.inputClass || "")}
            />
            <Show when={props.key.length > 1 && props.key.length < 60}>
                <div class="invalid-feedback">{props.invalidMsg}</div>
            </Show>
        </div>
    );
};
