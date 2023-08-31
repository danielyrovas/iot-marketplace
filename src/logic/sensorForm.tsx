import { createStore } from "solid-js/store";

type FormFields = {
  name?: string;
  costPerMinute?: string;
  costPerKB?: string;
  integrationBroker?: string;
  extraNodes?: extraNodesFields[];  
};

type extraNodesFields = {
    rdfSubject: string;
    rdfPredicate: string;
    rdfObject: string;
}

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
    extraNodes: [{
	rdfSubject: "",
	rdfPredicate: "",
	rdfObject: "",
    }],
  });
    let nodeId = 0;
    let nodeFlag = false;
    const [node, setNode] = createStore([]);

    const addNode = () => {
	setNode([...node, { nodeId: ++nodeId }]);
	console.log("Adding node...")
    }

    const removeNode = () => {
	
	setNode([{ nodeId: undefined! }]);
    }

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

     
      if (inputElement.name === "rdfSubject" && !(node)) {
	setForm('extraNodes', 0, {rdfSubject: inputElement.value});
	if (!(nodeFlag) &&
	    !(form.extraNodes[0].rdfPredicate) &&
	    !(form.extraNodes[0].rdfObject)) {
	    console.log(nodeFlag);
	    addNode();
	    nodeFlag = true;
	}
    } else if (inputElement.name === "rdfPredicate" && !(node)) {
	setForm('extraNodes', 0, {rdfPredicate: inputElement.value});
	if (!(nodeFlag) &&
	    !(form.extraNodes[0].rdfSubject) &&
	    !(form.extraNodes[0].rdfObject)) {
	    addNode();
	    nodeFlag = true;
	}
    } else if (inputElement.name === "rdfObject" && !(node)) {
	setForm('extraNodes', 0, {rdfObject: inputElement.value});
	if (!(nodeFlag) &&
	    !(form.extraNodes[0].rdfSubject) &&
	    !(form.extraNodes[0].rdfPredicate)) {
	    addNode();
	    nodeFlag = true;
	}
      }

      // if (inputElement.name === "rdfSubject") {
      // 	  setForm('extraNodes', 0, {rdfSubject: inputElement.value});
      // 	  addNode();
      // }

      if (!(form.extraNodes[0].rdfSubject) &&
	  !(form.extraNodes[0].rdfPredicate) &&
	  !(form.extraNodes[0].rdfObject)){
	  removeNode();
	  nodeFlag = false;
      }
      
  };

    return { form, node, submit, updateFormField, clearField };
};
