import { createSignal } from "solid-js";

export default function SensorRegister() {
  return (
    <div>
      <h1> Welcome to SENSOR! </h1>
      <button
        type="button"
        onClick={() => (window.location.pathname = "/register/broker")}
      >
        Greet
      </button>
    </div>
  );
}
