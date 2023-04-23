import { createSignal } from "solid-js";

export default function BrokerRegister() {
  return (
    <div>
      <h1> Welcome to BROKERS! </h1>

      <button
        type="button"
        onClick={() => (window.location.pathname = "/about")}
      >
        Greet
      </button>
    </div>
  );
}
