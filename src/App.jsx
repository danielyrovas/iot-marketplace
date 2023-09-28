import { useContext, For, lazy, createSignal, Show, onMount } from "solid-js";
import { AppContextProvider, useAppContext } from "./logic/context";
import "./App.css";

const tabs = [
  {
    name: "Query Sensors",
    title: "IoT Marketplace: Sensor Query",
    component: lazy(() => import("./pages/querySensor")),
  },
  {
    name: "Register a Sensor",
    title: "IoT Marketplace: Sensor Registration",
    component: lazy(() => import("./pages/registerSensor")),
  },
  {
    name: "Register a Broker",
    title: "IoT Marketplace: Broker Registration",
    component: lazy(() => import("./pages/registerBroker")),
  },
  {
    name: "Configuration",
    title: "IoT Marketplace: Configuration",
    component: lazy(() => import("./pages/settings")),
  },
];
const configIndex = tabs.length - 1;

export default function App() {
  const setTheme = (theme) => {
    document.getElementById("body").dataset.theme = theme ? "dark" : "light";
  };
  const [darkTheme, setDarkTheme] = createSignal(
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ? true : false,
  );
  const [tabIndex, setTabIndex] = createSignal(0);

  return (
    <div class="w-full h-full">
      {setTheme(darkTheme())}
      <div class="p-4">
        <h1 class="text-3xl font-bold text-center">{tabs[tabIndex()].title}</h1>
      </div>

      <div class="flex flex-row absolute top-3 right-2">
        <div
          class="btn btn-circle mx-1"
          onClick={() => {
            setDarkTheme(!darkTheme());
          }}
        >
          {darkTheme() ? (
            <i class="fa-solid fa-sun" />
          ) : (
            <i class="fa-solid fa-moon" />
          )}
        </div>
        <div
          class="btn btn-circle mx-1"
          onClick={() => {
            setTabIndex(configIndex);
          }}
        >
          <i class="fa-solid fa-cog" />
        </div>
      </div>

      <nav class="flex justify-center items-center navbar">
        <For each={tabs}>
          {(tab, index) => (
            <Show when={tab.name !== "Configuration"}>
              <button class="btn m-2" onClick={() => setTabIndex(index())}>
                {tab.name}
              </button>
            </Show>
          )}
        </For>
      </nav>
      {tabs[tabIndex()].component()}
    </div>
  );
}
