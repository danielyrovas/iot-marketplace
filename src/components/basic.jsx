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
        </div>
    );
};
