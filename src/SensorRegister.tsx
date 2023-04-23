import { createStore } from 'solid-js/store';
import { Component } from 'solid-js/web';

interface FormValues {
  sensorName: string;
  sensorType: string;
  sensorLocation: string;
}

export default function RegistrationForm(): Component {
  // create store to hold submitted value
  const store = createStore<FormValues>({
    sensorName: '',
    sensorType: '',
    sensorLocation: '',
  });

  // Handle form submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Access the form data from the store object directly
    const { sensorName, sensorType, sensorLocation } = store;
    // log 
    console.log('Form submitted with data:', sensorName, sensorType, sensorLocation);
    // Reset the form by setting the store properties to empty values
    store.sensorName = '';
    store.sensorType = '';
    store.sensorLocation = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>IoT Sensor Registration</h1>
      <label>
        <p>Sensor Name:</p>
        <input type="text" value={" "} onInput={(e: Event) => (store.sensorName = e.target.value)} />
      </label>
      <label>
        <p>Sensor Type:</p>
        <input type="text" value={" "} onInput={(e: Event) => (store.sensorType = e.target.value)} />
      </label>
      <label>
        <p>Sensor Location:</p>
        <input type="text" value={" "} onInput={(e: Event) => (store.sensorLocation = e.target.value)} />
      </label>
      <p><button type="submit">Register</button></p>
    </form>
  );
}
