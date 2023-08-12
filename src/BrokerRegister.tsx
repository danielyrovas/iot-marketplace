import { createSignal } from "solid-js";

import { Component, createEffect } from "solid-js";
import { TextInput } from "./components";
import { createBrokerForm } from "./logic";

export default function BrokerRegister() {
  // return (
  //   <div>
  //     <div class="min-h-screen hero">
  //       <div class="flex-col lg:flex-row-reverse">
  //         <div class="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
  //           <div class="form-control">
  //             <label class="label">
  //               <span class="label-text">Password</span>
  //             </label>
  //             <input
  //               type="text"
  //               placeholder="password"
  //               class="input input-bordered"
  //             />
  //             <label class="label">
  //               <a href="#" class="label-text-alt link link-hover">
  //                 Forgot password?
  //               </a>
  //             </label>
  //           </div>
  //           <div class="mt-6 form-control">
  //             <button class="btn btn-primary">Login</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const { form, updateFormField, submit, clearField } = createBrokerForm();

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    submit(form);
  };

  createEffect(() => {
    if (form.sameAsAddress) {
      clearField("shippingAddress");
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit} class="p-8">
        <TextInput
          label="name"
          placeholder="e.g. Farm Broker"
          name="Name"
          value={form.name}
          onChange={updateFormField("name")}
        />
        <TextInput
          label="surname"
          name="Surname"
          value={form.surname}
          onChange={updateFormField("surname")}
        />
        <TextInput
          label="address"
          name="Address"
          value={form.address}
          onChange={updateFormField("address")}
        />
        <div class="flex flex-row justify-center mt-4">
          <input class="btn" type="submit" value="Register Broker" />
        </div>
      </form>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}
