import { TextInput } from "@/components";
import { createSensorForm } from "@/logic";

export default function SensorRegister() {
  const { form, updateFormField, submit, clearField } = createSensorForm();

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    submit(form);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} class="p-8">
        <TextInput
          label="Name"
          name="name"
          value={form.name}
          onChange={updateFormField()}
        />
        <TextInput
          label="Type"
          name="type"
          value={form.type}
          onChange={updateFormField()}
        />
        <TextInput
          label="Country"
          name="country"
          value={form.country}
          onChange={updateFormField()}
        />
        <div class="flex flex-row justify-center mt-4">
          <input class="btn" type="submit" value="Register Sensor" />
        </div>
      </form>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}
