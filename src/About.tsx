import { invoke } from "@tauri-apps/api/tauri";
import { createSignal } from "solid-js";

export default function About() {
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
}
