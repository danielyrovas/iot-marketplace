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
          label="Cost per minute"
          name="costPerMinute"
          value={form.costPerMinute}
          onChange={updateFormField()}
        />
        <TextInput
          label="Cost per KB"
          name="costPerKB"
          value={form.costPerKB}
          onChange={updateFormField()}
        />
	<TextInput
          label="Integration broker"
          name="integrationBroker"
          value={form.integrationBroker}
          onChange={updateFormField()}
          />  
	<TextInput
          label="RDF Subject 1"
          name="rdfSubject"
          value={form.rdfSubject}
          onChange={updateFormField()}
          />
	<TextInput
          label="RDF Predicate 1"
          name="rdfPredicate"
          value={form.rdfPredicate}
          onChange={updateFormField()}
          />
	<TextInput
          label="RDF Object 1"
          name="rdfObject"
          value={form.rdfObject}
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
