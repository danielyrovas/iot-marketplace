import { createSignal, lazy } from "solid-js";
import { A, useRoutes } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/tauri";
import "./index.css";

const routes = [
  {
    path: ["/"],
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
  const cardStyle =
    "h-[160px] aspect aspect-[2] rounded-[16px] shadow-[0_0_0_4px_hsl(0_0%_0%_/_15%)]";
  return (
    <>
      <h1>Awesome Site</h1>
      <nav class="place-items-center">
        <A class={cardStyle} href="/">
          Home
        </A>
        <A class={cardStyle} href="/register/sensor">
          Register a Sensor
        </A>
        <A class={cardStyle} href="/register/broker">
          Register a Broker
        </A>
        <A class={cardStyle} href="/about">
          About
        </A>
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
