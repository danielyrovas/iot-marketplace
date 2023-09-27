import { invoke } from "@tauri-apps/api/tauri";
import { createSignal } from "solid-js";
import { TextInput } from "../components/basic";
import { useAppContext } from "../logic/context";

export default function Config() {
	const [state, { updateConfig }] = useAppContext();
	return (
		<div>
			<p>Welcome Home</p>
			<button class="btn" type="button" onClick={() => state.reload()}>
				Reload
			</button>
		</div>
	);
}
