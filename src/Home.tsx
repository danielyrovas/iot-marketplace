import { JSX, ParentComponent, createSignal } from "solid-js";
import { Button, TextInput } from "@/components";
import { createSensorForm } from "@/logic";
import { invoke } from "@tauri-apps/api/tauri";

export default function Home() {
  const [state, setState] = createSignal("default");
  return (
    <>
      {state() === "default" && <RegisterSensor />}
      {state() === "newstate" && <About />}
      <Button onClick={() => setState("newstate")}>Cycle States</Button>
    </>
  );
}

export const RegisterSensor: ParentComponent = () => {
  const { form, updateFormField, submit, clearField } = createSensorForm();

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    submit(form);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} class="p-8">
        <TextInput
          label="Name"
          name="name"
          value={form.name}
          onChange={updateFormField()}
        />
        <TextInput
          label="Type"
          name="type"
          value={form.type}
          onChange={updateFormField()}
        />
        <TextInput
          label="Country"
          name="country"
          value={form.country}
          onChange={updateFormField()}
        />
        <div class="flex flex-row justify-center mt-4">
          <input class="btn" type="submit" value="Register Sensor" />
        </div>
      </form>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
};

export const About: ParentComponent = () => {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }
  return (
    <div class="m-[10px]">
      <h1> About IoT Market Place Dashboard </h1>

      <p>An example solidjs frontend to rust backend interop function call</p>
      <div class="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>

      <p>{greetMsg()}</p>
    </div>
  );
};
