import { createStore } from "solid-js/store";

type FormFields = {
  name?: string;
  type?: string;
  country?: string;
};

const submit = (form: FormFields) => {
  const dataToSubmit = {
    name: form.name,
    type: form.type,
    country: form.country,
  };
  console.log(`submitting ${JSON.stringify(dataToSubmit)}`);
};

export const createSensorForm = () => {
  const [form, setForm] = createStore<FormFields>({
    name: "",
    type: "",
    country: "",
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
