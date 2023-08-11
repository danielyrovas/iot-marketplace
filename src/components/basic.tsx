import { ParentComponent, JSX, splitProps, Component, Show } from "solid-js";

type Props<ParentProps = {}> = ParentProps & { class?: JSX.ElementClass };

export const Button: ParentComponent<Props> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div {...rest} class={"btn btn-primary " + local.class}>
      {local.children}
    </div>
  );
};

export type TextInputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  labelClass?: string;
  inputClass?: string;
  type?: string;
};
export const TextInput: Component<TextInputProps> = (props) => {
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
        <label class={"label " + (local.labelClass || "")} for={local.name}>
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
