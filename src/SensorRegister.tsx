import { TextInput } from "@/components";
import { createSensorForm } from "@/logic";
import { extraNodes } from "@/logic";

export default function SensorRegister() {
    const { form, node, updateFormField, submit, clearField } = createSensorForm();

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
	  <For each={node}>
	     {(myNode) => {
		 const { id } = myNode;
		 return  <div>
		     <TextInput
		       label={"RDF Subject" + id}
		       name="rdfSubject"
		       value={form.rdfSubject[1]}
		       onChange={updateFormField()}
		       />
		     <TextInput
		       label={"RDF Subject" + id}
		       name="rdfPredicate"
		       value={form.rdfPredicate}
		       onChange={updateFormField()}
		       />
		     <TextInput
		       label={"RDF Subject" + id}
		       name="rdfObject"
		       value={form.rdfObject}
		       onChange={updateFormField()}
		       />
		 </div>
	     }}
	  </For>
	   
        <div class="flex flex-row justify-center mt-4">
          <input class="btn" type="submit" value="Register Sensor" />
        </div>
      </form>
	  <pre>{JSON.stringify(form, null, 2)}</pre>
	  <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
