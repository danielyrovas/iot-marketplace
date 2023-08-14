import { createSignal, Show } from "solid-js";

import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { TextInput } from "@/components";
import * as yup from "yup";

// type Sensor = {
//   name: string;
//   type: string;
//   country: string;
//   location: string;
// };

export const sensorValidator = yup.object({
  name: yup.string().required("A name is required"),
  type: yup.string(),
  country: yup.string(),
  location: yup.string(),
});

export default function SensorRegister() {
  const formHandler = useFormHandler(yupSchema(sensorValidator));
  const { formData } = formHandler;
  const [data, setData] = createSignal("");

  const submit = async (event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      console.log(formData());
      setData(JSON.stringify(formData()));
      formHandler.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={submit}>
      <TextInput
        label="Name"
        name="name"
        class="p-4 m-20"
        formHandler={formHandler}
      />
      <TextInput
        label="Type"
        name="type"
        formHandler={formHandler}
        class="p-4 m-10"
      />
      <TextInput
        label="Country"
        name="country"
        formHandler={formHandler}
        class="p-4 m-10"
      />
      <Show when={!formHandler.isFormInvalid()}>
        <button disabled={formHandler.isFormInvalid()}>Submit</button>
      </Show>
      <Show when={data() != ""}>
        <p>{data() as string}</p>
      </Show>
    </form>
  );
}
