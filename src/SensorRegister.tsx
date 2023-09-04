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
	  {/*  
	<TextInput
          label="RDF Subject"
          name="rdfSubject"
          value={form.extraNodes[0].rdfSubject}
          onChange={updateFormField()}
          />
	<TextInput
          label="RDF Predicate"
          name="rdfPredicate"
          value={form.extraNodes[0].rdfPredicate}
          onChange={updateFormField()}
          />
	<TextInput
          label="RDF Object"
          name="rdfObject"
          value={form.extraNodes[0].rdfObject}
          onChange={updateFormField()}
          />
	   */}
	  <For each={form.extraNodes}>
	  {(node, i) => {
		 return  <div>
		  <TextInput
	               id={i()}
	               label={`RDF Subject ${i() + 1}`}
		       name="rdfSubject"
	               value={form.extraNodes[i()].rdfSubject}
		       onChange={updateFormField()}
		       />
		  <TextInput
	               id={i()}
		       label={`RDF Predicate ${i() + 1}`}
		       name="rdfPredicate"
	               value={form.extraNodes[i()].rdfPredicate}
		       onChange={updateFormField()}
		       />
		  <TextInput
	               id={i()}
		       label={`RDF Object ${i() + 1}`}
		       name="rdfObject"
	               value={form.extraNodes[i()].rdfObject}
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
    </div>
  );
}
