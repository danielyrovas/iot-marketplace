import { createStore } from "solid-js/store";

type FormFields = {
  name?: string;
  costPerMinute?: string;
  costPerKB?: string;
  integrationBroker?: string;
};

const submit = (form: FormFields) => {
  const dataToSubmit = {
      name: form.name,
      costPerMinute: form.costPerMinute,
      costPerKB: form.costPerKB,
      integrationBroker: form.integrationBroker,
  };
  console.log(`submitting ${JSON.stringify(dataToSubmit)}`);
};

export const createSensorForm = () => {
  const [form, setForm] = createStore<FormFields>({
    name: "",
    costPerMinute: "",
    costPerKB: "",
    integrationBroker: "",
  });

  const clearField = (fieldName: string) => {
    setForm({
      [fieldName]: "",
    });
  };

  const is_valid = (fieldName: string, value: string) => {
    if (value.length <= 4) {
      return false;
    }
    return true;
  };

  const updateFormField = () => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;

    // validate field and set error border
    // TODO: add alt-text error message
    if (!is_valid(inputElement.name, inputElement.value)) {
      inputElement.classList.add("input-error");
    } else {
      inputElement.classList.remove("input-error");
    }

    if (inputElement.type === "checkbox") {
      setForm({
        [inputElement.name]: !!inputElement.checked,
      });
    } else {
      setForm({
        [inputElement.name]: inputElement.value,
      });
    }
  };

  return { form, submit, updateFormField, clearField };
};
