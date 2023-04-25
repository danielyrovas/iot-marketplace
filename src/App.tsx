import { For, lazy } from "solid-js";
import { Button } from "@suid/material";
import { A, useRoutes } from "@solidjs/router";
import "./index.css";

const routes = [
  {
    path: "/",
    name: "Home",
    component: lazy(() => import("./Home")),
  },
  {
    path: "/register/sensor",
    name: "Register a Sensor",
    component: lazy(() => import("./SensorRegister")),
  },
  {
    path: "/register/broker",
    name: "Register a Broker",
    component: lazy(() => import("./BrokerRegister")),
  },
  {
    path: "/about",
    name: "About",
    component: lazy(() => import("./About")),
  },
];
export default function App() {
  const Routes = useRoutes(routes);
  // const cardStyle =
  //   "h-[160px] p-[5px] m-[20px] aspect aspect-[2] rounded-[16px] shadow-[0_0_0_4px_hsl(0_0%_0%_/_15%)]";
  return (
    <>
      <h1>Internet of Things Marketplace</h1>
      <nav class="place-items-center m-[10px]">
        <For each={Object.values(routes || {})}>
          {(a) => (
            <A href={a.path}>
              <Button>{a.name}</Button>
            </A>
          )}
        </For>
      </nav>
      <Routes />
    </>
  );
}
