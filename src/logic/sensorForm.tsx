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
    let nodeCount = 0
    const [node, setNode] = createStore([]);

    const addNode = () => {
	setForm('extraNodes', eN => [...eN, {rdfSubject: "", rdfPredicate: "", rdfObject: ""}]);
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

      if (inputElement.name === "rdfSubject") {
	setForm('extraNodes', inputElement.id, {rdfSubject: inputElement.value});
	  if ((!(nodeFlag) || nodeCount === parseInt(inputElement.id)) &&
	    !(form.extraNodes[inputElement.id].rdfPredicate) &&
	    !(form.extraNodes[inputElement.id].rdfObject)) {
	    console.log(nodeFlag);
	    addNode();
	    ++nodeCount;
	    nodeFlag = true;
	}
    } else if (inputElement.name === "rdfPredicate") {
	setForm('extraNodes', inputElement.id, {rdfPredicate: inputElement.value});
	if ((!(nodeFlag) || nodeCount === parseInt(inputElement.id)) &&
	    !(form.extraNodes[inputElement.id].rdfSubject) &&
	    !(form.extraNodes[inputElement.id].rdfObject)) {
	    addNode();
	    ++nodeCount;
	    nodeFlag = true;
	}
    } else if (inputElement.name === "rdfObject") {
	setForm('extraNodes', inputElement.id, {rdfObject: inputElement.value});
	if ((!(nodeFlag) || nodeCount === parseInt(inputElement.id)) &&
	    !(form.extraNodes[inputElement.id].rdfSubject) &&
	    !(form.extraNodes[inputElement.id].rdfPredicate)) {
	    addNode();
	    ++nodeCount;
	    nodeFlag = true;
	}
    }
      //I need a way to get rid of unwanted extraNode items
      // if (!(form.extraNodes[0].rdfSubject) &&
      // 	  !(form.extraNodes[0].rdfPredicate) &&
      // 	  !(form.extraNodes[0].rdfObject)){
      // 	  removeNode();
      // 	  nodeFlag = false;
      // }
      
  };

    return { form, node, submit, updateFormField, clearField };
};
