import { For, lazy } from "solid-js";
import { A, useRoutes } from "@solidjs/router";
import "./index.css";
import { Button } from "@/components";

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
  {
    path: "/query",
    name: "Query",
    component: lazy(() => import("./query")),
  },
];
export default function App() {
  const Routes = useRoutes(routes);
  // const cardStyle =
  //   "h-[160px] p-[5px] m-[20px] aspect aspect-[2] rounded-[16px] shadow-[0_0_0_4px_hsl(0_0%_0%_/_15%)]";
  return (
    <>
      <h1 class="text-3xl font-bold text-center">
        Internet of Things Marketplace
      </h1>
      <nav class="flex justify-center items-center navbar">
        <For each={Object.values(routes || {})}>
          {(a) => (
            <A href={a.path} class="p-2">
              <Button class="">{a.name}</Button>
            </A>
          )}
        </For>
      </nav>
      <Routes />
    </>
  );
}
