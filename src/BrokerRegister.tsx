import { Component, createEffect, createSignal } from "solid-js";
import { TextInput } from "@/components";
import { createBrokerForm } from "@/logic";

interface ConfirmationBoxProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationBox({
  message,
  onConfirm,
  onCancel,
}: ConfirmationBoxProps) {
  const [isVisible, setIsVisible] = createSignal(true);

  const handleConfirm = () => {
    onConfirm();
    setIsVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };

  return (
    <>
      {isVisible() && (
        <div class="confirmation-box">
          <p>{message}</p>
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default function BrokerRegister() {
  const {
    form,
    updateFormField,
    submit,
    clearField,
    addCustomAttribute,
    removeCustomAttribute,
  } = createBrokerForm();

  const [showConfirmation, setShowConfirmation] = createSignal(false);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    submit(form);
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    clearAllFields();
    setShowConfirmation(false);
  };

  const handleReset = () => {
    clearField();
  };

  const clearAllFields = () => {
    clearField();
    // Add any additional clearing logic here
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
              label={'Other information'}
              placeholder="Fill in any other information that you would like to add"
              name={'Custom Attribute ${index + 1}'}
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
          <button class="btn ml-2" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <pre>{JSON.stringify(form, null, 2)}</pre>

      {showConfirmation() && (
        <ConfirmationBox
          message="Are you sure you want to submit this form?"
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
