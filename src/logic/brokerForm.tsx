import { createStore } from "solid-js/store";

type FormFields = {
  endpoint: string;
  name?: string;
  customAttributes: string[];
};

const submit = (form: FormFields) => {
  const dataToSubmit = {
    name: form.name,
    endpoint: form.endpoint,
    customAttributes: form.customAttributes,
  };
  console.log('submitting ${JSON.stringify(dataToSubmit)}');
};

export const createBrokerForm = () => {
  const [form, setForm] = createStore<FormFields>({
    name: "",
    endpoint: "",
    customAttributes: [],
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

  const updateFormField = (fieldName: string, index?: number) => (
    event: Event
  ) => {
    const inputElement = event.currentTarget as HTMLInputElement;

    if (!is_valid(fieldName, inputElement.value)) {
      inputElement.classList.add("input-error");
    } else {
      inputElement.classList.remove("input-error");
    }

    if (fieldName === "customAttributes" && index !== undefined) {
      const updatedAttributes = [...form.customAttributes];
      updatedAttributes[index] = inputElement.value;
      setForm({
        customAttributes: updatedAttributes,
      });
    } else {
      setForm({
        [fieldName]: inputElement.value,
      });
    }
  };

  const addCustomAttribute = () => {
    setForm((prevForm) => ({
      customAttributes: [...prevForm.customAttributes, ""],
    }));
  };

  const removeCustomAttribute = (index: number) => {
    const updatedAttributes = [...form.customAttributes];
    updatedAttributes.splice(index, 1);
    setForm({
      customAttributes: updatedAttributes,
    });
  };

  return {
    form,
    submit,
    updateFormField,
    clearField,
    addCustomAttribute,
    removeCustomAttribute,
  };
};