import { createSignal, lazy } from "solid-js";
import { A, useRoutes } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

const routes = [
  {
    path: ["/dashboard"],
    component: lazy(() => import("./Home")),
  },
  {
    path: "/register/sensor",
    component: lazy(() => import("./SensorRegister")),
  },
  {
    path: "/register/broker",
    component: lazy(() => import("./BrokerRegister")),
  },
  {
    path: "/about",
    component: lazy(() => import("./About")),
  },
];

export default function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  const Routes = useRoutes(routes);
  return (
    <>
      <h1>Awesome Site</h1>
      <nav>
        <div>
          <A href="/dashboard">Home</A>
        </div>
        <div>
          <A href="/register/sensor">Register a Sensor</A>
        </div>
        <div>
          <A href="/register/broker">Register a Broker</A>
        </div>
        <div>
          <A href="/about">About</A>
        </div>
      </nav>
      <Routes />
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
    </>
  );
}
