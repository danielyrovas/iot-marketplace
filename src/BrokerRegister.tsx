import { Component, createEffect } from "solid-js";
import { TextInput } from "@/components";
import { createBrokerForm } from "@/logic";

export default function BrokerRegister() {
  const {
    form,
    updateFormField,
    submit,
    clearField,
    addCustomAttribute,
    removeCustomAttribute, 
  } = createBrokerForm();

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    submit(form);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} class="p-8">
        <TextInput
          label=" Broker name"
          placeholder="e.g. Farm Broker"
          name="Name"
          value={form.name}
          onChange={updateFormField("name")}
        />
        <TextInput
          label="Endpoint"
          name="Endpoint"
          value={form.endpoint}
          onChange={updateFormField("endpoint")}
        />

        {/* Render custom attributes */}
        {form.customAttributes.map((attr, index) => (
          <div class="flex">
            <TextInput
              label={`Other information`}
              placeholder="Fill in any other information that you would like to add"
              name={`Custom Attribute ${index + 1}`}
              value={attr}
              onChange={updateFormField("customAttributes", index)}
            />
            <button
              class="btn ml-2"
              type="button"
              onClick={() => removeCustomAttribute(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <div class="flex flex-row justify-center mt-4">
          <button class="btn" type="button" onClick={addCustomAttribute}>
            Add other desired information
          </button>
          <input class="btn ml-2" type="submit" value="Register Broker" />
        </div>
      </form>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}
