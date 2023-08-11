import { createStore } from "solid-js/store";

type FormFields = {
  name?: string;
  surname?: string;
  address?: string;
  shippingAddress?: string;
  sameAsAddress: boolean;
};

const submit = (form: FormFields) => {
  // here we can:
  // filter out unneeded data, e.g. the checkbox sameAsAddress
  // map fields, if needed, e.g. shipping_address
  const dataToSubmit = {
    name: form.name,
    surname: form.surname,
    address: form.address,
    shipping_address: form.shippingAddress,
  };
  // should be submitting your form to some backend service
  console.log(`submitting ${JSON.stringify(dataToSubmit)}`);
};

export const createBrokerForm = () => {
  const [form, setForm] = createStore<FormFields>({
    name: "",
    surname: "",
    address: "",
    shippingAddress: "",
    sameAsAddress: false,
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

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;

    // validate field and set error border
    // TODO: add alt-text error message
    if (!is_valid(fieldName, inputElement.value)) {
      inputElement.classList.add("input-error");
    } else {
      inputElement.classList.remove("input-error");
    }

    if (inputElement.type === "checkbox") {
      setForm({
        [fieldName]: !!inputElement.checked,
      });
    } else {
      setForm({
        [fieldName]: inputElement.value,
      });
    }
  };

  return { form, submit, updateFormField, clearField };
};
