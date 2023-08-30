import { createSignal } from "solid-js";
import logo from "./assets/logo.svg";
import "./App.css";

export default function App() {
  const [darkTheme, setDarkTheme] = createSignal(true);
  const themes = ["iot-dark", "iot-light"]

  return (
    <div class="w-full min-h-screen" data-theme={themes[darkTheme() ? 0 : 1]}>
      <div class="prose p-4">
        <h1>Welcome to IoT Marketplace!</h1>
      </div>

      <button
        class="btn btn-primary p-[20px]"
        onClick={() => setDarkTheme(!darkTheme())}
      >{darkTheme() ? "Switch to light theme" : "Switch to dark theme"}</button>

      <p>Current Theme: {themes[darkTheme() ? 0 : 1]}</p>
    </div >
  );
}
