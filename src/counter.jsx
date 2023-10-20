import { createSignal } from "solid-js";
export function Counter() {
  const [count, setCount] = createSignal(1);
  const increment = () => setCount(count() + 1);
  return (
    <button type="button" onClick={increment}>
      {count()}
    </button>
  );
}