import { createForm } from '@felte/solid';
import { createSignal, For, Show } from "solid-js";
import { reporter } from '@felte/reporter-solid';
import { useAppContext } from "../logic/context";
import { TextInput } from "../components/basic";
import { createStore } from 'solid-js/store';
import ChainUtil from "senshamartproject/util/chain-util";

const isNumeric = (str) => {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

export default function RegisterSensor() {
    const [state, { updateConfig }] = useAppContext();
    const [extraNodes, setExtraNodes] = createStore([]);
    const [data, setData] = createSignal('');
    const [rawCheck, setRawCheck] = createStore({visible: false});
    const [presets, setPresets] = createStore([
        {
            name: "Location",
            icon: "location-dot",
            visible: true
        }
    ]);
    
    const [typePresets, setTypePresets] = createStore(
        {
            names: [
		{
		    name: "Sensor type: video camera",
		    selected: false
		},
		{
		    name: "Sensor type: air temperature",
		    selected: false
		}
	    ],
            icon: "tag",
            visible: true
        }
    );

    const { form, errors, setFields, createSubmitHandler } = createForm({
        validate(values) {

            const errors = {};
            if (!values.name) {
            } else if (values.name.length < 5) {
                errors.name = "please add a descriptive name";
            }
            if (!values.costPerMinute) {
            } else if (!isNumeric(values.costPerMinute)) {
                errors.costPerMinute = "please use integers";
            }
            return errors;
        },
        onSubmit: (values) => {
            // console.log(JSON.stringify(values));
            // console.log(JSON.stringify(extraNodes));
        },
        extend: reporter,
    });

    const realSubmit = createSubmitHandler({
        onSubmit: (values) => {
            console.log('Alternative onSubmit', JSON.stringify(values, null, 2))
            setData(JSON.stringify(values, null, 2));
            values.costPerMinute = parseInt(values.costPerMinute);
            values.costPerKB = parseInt(values.costPerKB);
            let sensorData = {}

            sensorData.sensorName = values.sensorName;
            sensorData.costPerMinute = parseInt(values.costPerMinute);
            sensorData.costPerKB = parseInt(values.costPerKB);
	    sensorData.integrationBroker = values.integrationBroker;
            sensorData.extraNodes = [];
            sensorData.extraLiterals = [];
            if (typeof values.longtitude !== 'undefined') {
                sensorData.extraNodes.push(
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/sosa/hasFeatureOfInterest',
                        rdfObject: `SSMS://#${sensorData.sensorName}#location`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}#location`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: `http://www.w3.org/ns/sosa/hasFeatureOfInterest`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}#location`,
                        rdfPredicate: 'http://www.w3.org/ns/sosa/isSampleOf',
                        rdfObject: `SSMS://earth`
                    },
                    {
                        rdfSubject: `SSMS://earth`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: `http://www.w3.org/ns/sosa/hasFeatureOfInterest`
                    }
                );
                sensorData.extraLiterals.push(
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}#location`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                        rdfObject: `location of #${sensorData.sensorName}`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}#location`,
                        rdfPredicate: 'http://www.w3.org/2003/01/geo/wgs84_pos#lat',
                        rdfObject: `${values.latitude}`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}#location`,
                        rdfPredicate: 'http://www.w3.org/2003/01/geo/wgs84_pos#long',
                        rdfObject: `${values.longtitude}`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}#location`,
                        rdfPredicate: 'http://www.w3.org/2003/01/geo/wgs84_pos#alt',
                        rdfObject: `${values.altitude}`
                    },
                    {
                        rdfSubject: 'SSMS://earth',
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                        rdfObject: 'earth'
                    }
                );
            }

	    let selectedSensorType = "";
	    for (let i = 0; i < typePresets.names.length; i++) {
		if (typePresets.names[i].selected === true) {
		    selectedSensorType = typePresets.names[i].name;
		}
	    }

	    console.log(typeof selectedSensorType);
	    if (selectedSensorType === "Sensor type: video camera") {
                sensorData.extraNodes.push(
                    {
                        rdfSubject: 'SSMS://#Procedure',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/Procedure'
                    },
                    {
                        rdfSubject: 'SSMS://#Procedure',
                        rdfPredicate: 'http://www.w3.org/ns/ssn/hasOutput',
                        rdfObject: 'SSMS://#output'
                    },
                    {
                        rdfSubject: 'SSMS://#output',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Output'
                    },
                    {
                        rdfSubject: 'SSMS://#output',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'https://w3id.org/rdfp/GraphDescription'
                    },
                    {
                        rdfSubject: 'SSMS://',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        rdfSubject: 'SSMS://',
                        rdfPredicate: 'http://www.w3.org/ns/ssn/hasSubSystem',
                        rdfObject: `SSMS://#${sensorData.sensorName}`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/Sensor'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/hasOperatingRange',
                        rdfObject: `SSMS://#${sensorData.sensorName}OperatingRange`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/sosa/observes',
                        rdfObject: `SSMS://#${sensorData.sensorName}Video`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/implements',
                        rdfObject: 'SSMS://#Procedure'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/OperatingRange',
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Video`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/ObservableProperty'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Video`,
                        rdfPredicate: 'http://www.w3.org/ns/sosa/isObservedBy',
                        rdfObject: `SSMS://#${sensorData.sensorName}`
                    },
		    {
                        rdfSubject: 'SSMS://#MeasuringVideo',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/Procedure'
                    }
                );
                sensorData.extraLiterals.push(
                    {
                        rdfSubject: 'SSMS://#output',
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'The output video segments.'
                    },
                    {
                        rdfSubject: 'SSMS://',
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'Camera system contains a camera.'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'The embedded camera sensor in the system.'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Video`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'Captures the light entering the camera through the lens so that it can be processed and turned into a digital video.'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Video`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                        rdfObject: 'Video'
                    },
		    {
                        rdfSubject: 'SSMS://#MeasuringVideo',
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'Instructions for measuring Video'
                    }
                );
	    } else if (selectedSensorType === "Sensor type: air temperature") {
                sensorData.extraNodes.push(
                    {
                        rdfSubject: 'SSMS://#Procedure',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/Procedure'
                    },
                    {
                        rdfSubject: 'SSMS://#Procedure',
                        rdfPredicate: 'http://www.w3.org/ns/ssn/hasOutput',
                        rdfObject: 'SSMS://#output'
                    },
                    {
                        rdfSubject: 'SSMS://#output',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Output'
                    },
                    {
                        rdfSubject: 'SSMS://#output',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'https://w3id.org/rdfp/GraphDescription'
                    },
                    {
                        rdfSubject: 'SSMS://',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        rdfSubject: 'SSMS://',
                        rdfPredicate: 'http://www.w3.org/ns/ssn/hasSubSystem',
                        rdfObject: `SSMS://#${sensorData.sensorName}`
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/Sensor'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/hasOperatingRange',
                        rdfObject: `SSMS://#${sensorData.sensorName}OperatingRange`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/hasSystemCapability',
                        rdfObject: `SSMS://#${sensorData.sensorName}Capability`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/sosa/observes',
                        rdfObject: `SSMS://#${sensorData.sensorName}Temperature`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/implements',
                        rdfObject: 'SSMS://#Procedure'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/OperatingRange',
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        rdfObject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        rdfObject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Condition'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://schema.org/unitCode',
                        rdfObject: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Condition'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        rdfPredicate: 'http://schema.org/unitCode',
                        rdfObject: 'http://qudt.org/1.1/vocab/unit#Percent'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/SystemCapability'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        rdfObject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        rdfObject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/hasSystemProperty',
                        rdfObject: `SSMS://#${sensorData.sensorName}Accuracy`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/hasSystemProperty',
                        rdfObject: `SSMS://#${sensorData.sensorName}Sensitivity`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Capability`,
                        rdfPredicate: 'http://www.w3.org/ns/ssn/systems/hasSystemProperty',
                        rdfObject: `SSMS://#${sensorData.sensorName}Frequency`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Accuracy`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Accuracy`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Accuracy'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Accuracy`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Accuracy`,
                        rdfPredicate: 'http://schema.org/unitCode',
                        rdfObject: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Sensitivity'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Resolution'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        rdfPredicate: 'http://schema.org/unitCode',
                        rdfObject: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Precision`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Precision`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Precision'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Precision`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Precision`,
                        rdfPredicate: 'http://schema.org/unitCode',
                        rdfObject: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Frequency`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Frequency`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/ssn/systems/Frequency'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Frequency`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://schema.org/PropertyValue'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Frequency`,
                        rdfPredicate: 'http://schema.org/unitCode',
                        rdfObject: 'http://qudt.org/1.1/vocab/unit#Second'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Temperature`,
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/ObservableProperty'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}Temperature`,
                        rdfPredicate: 'http://www.w3.org/ns/sosa/isObservedBy',
                        rdfObject: `SSMS://#${sensorData.sensorName}`
                    },
		    {
                        rdfSubject: 'SSMS://#MeasuringTemperature',
                        rdfPredicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        rdfObject: 'http://www.w3.org/ns/sosa/Procedure'
                    }
                );
                sensorData.extraLiterals.push(
                    {
                        rdfSubject: 'SSMS://#output',
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'The output is a RDF Graph that describes the temperature.'
                    },
                    {
                        rdfSubject: 'SSMS://',
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: `SSMS://#${sensorData.sensorName} measures the air temperature.`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'The air temperature sensor, a specific instance of temperature sensor.'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: 'The conditions in which the air temperature sensor is expected to operate.'
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: `A temperature range of ${values.tempConMinTemp} to ${values.tempConMaxTemp} degrees Celsius.`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://schema.org/minValue',
                        rdfObject: `${values.tempConMinTemp}`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        rdfPredicate: 'http://schema.org/maxValue',
                        rdfObject: `${values.tempConMaxTemp}`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        rdfPredicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        rdfObject: `A relative humidity range of ${values.humConMinPerc} to ${values.humConMaxPerc}%.`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        rdfPredicate: 'http://schema.org/minValue',
                        rdfObject: `${values.humConMinPerc}`
                    },
		    {
                        rdfSubject: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        rdfPredicate: 'http://schema.org/maxValue',
                        rdfObject: `${values.humConMaxPerc}`
                    },
                );
	    }

            values.extras?.forEach((extra) => {
                if (extra.literal) {
                    sensorData.extraLiterals.push({
                        rdfSubject: extra.rdfSubject,
                        rdfPredicate: extra.rdfPredicate,
                        rdfObject: extra.rdfObject,
                    });
                } else {
                    sensorData.extraNodes.push({
                        rdfSubject: extra.rdfSubject,
                        rdfPredicate: extra.rdfPredicate,
                        rdfObject: extra.rdfObject,
                    });
                }
            })
	    
            const sensorRegistrationValidators = {
                sensorName: ChainUtil.validateIsString,
                costPerMinute: ChainUtil.createValidateIsIntegerWithMin(0),
                costPerKB: ChainUtil.createValidateIsIntegerWithMin(0),
                integrationBroker: ChainUtil.validateIsString,
                rewardAmount: ChainUtil.createValidateIsIntegerWithMin(0),
                extraNodeMetadata: ChainUtil.createValidateOptional(
                    ChainUtil.validateIsObject),
                extraLiteralMetadata: ChainUtil.createValidateOptional(
                    ChainUtil.validateIsObject)
            };
            const validateRes = ChainUtil.validateObject(values, sensorRegistrationValidators);
	    
            if (!validateRes.result && values.rawCheck) {
                setData(`${JSON.stringify(sensorData, null, 2)}\n${validateRes.reason}`);
                setRawCheck({visible: true});
                return;
            } else if (!values.rawCheck) {
		setRawCheck({visible: false});
		return;
	    }
	    
        }
    })

    return (
        <div>
            <form use: form>
                <div class="flex flex-col place-items-center m-4">
                    <TextInput
                        class="w-[40rem]"
                        label="Sensor name"
                        name="sensorName"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Cost per minute"
                        name="costPerMinute"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Cost per KB"
                        name="costPerKB"
                    />
                    <TextInput
                        class="w-[40rem]"
                        label="Integration broker"
                        name="integrationBroker"
                    />
                    <h1 class="text-2xl font-bold text-center">RDF Triples</h1>
                    <div class="flex flex-row space-x-4 justify-center w-[40rem] p-4">
                        <For each={presets}>
                            {(preset, i) => {
                                return (
                                    <Show when={preset.visible}>
                                        <button class="btn btn-primary p-4" onClick={() => {
                                            // set(i(), { visible: false })
                                            setPresets(i(), { visible: false })
                                        }}>
                                            <i class={`fa-solid fa-${preset.icon}`}></i>
                                            {preset.name}
                                            <i class={`fa-solid fa-plus`}></i>
                                        </button>
                                    </Show>				    
                                )
                            }}
                        </For>
		    </div>
		    <div class="flex flex-row space-x-4 justify-center w-[40rem] p-4">
                        <For each={typePresets.names}>
                            {(typePresetName, i) => {
                                return (
                                    <Show when={typePresets.visible}>
                                        <button class="btn btn-accent p-4" onClick={() => {
						    setTypePresets({ visible: false });
						    setTypePresets('names', `${i()}`, 'selected', true);
                                        }}>
                                            <i class={`fa-solid fa-${typePresets.icon}`}></i>
                                            {typePresets.names[`${i()}`].name}
                                            <i class={`fa-solid fa-plus`}></i>
                                        </button>
                                    </Show>			    
                                )
                            }}
                        </For>			
                    </div>
                    <Show when={!presets[0].visible}>
                        <div class="flex flex-row place-items-center w-[40rem] m-2">
                            <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor location: longtitude'
                                name='longtitude'
                            />
                            <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor location: latitude'
                                name='latitude'
                            />
                            <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor location: altitude'
                                name='altitude'
                            />
                        </div>
                    </Show>
		    <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row place-items-center w-[40rem] m-2">
                            <TextInput
                                class="w-[33.3333%] p-4"
                                label='Normal sensor temperature range: minimum temperature (in degrees Celsius)'
                                name='tempConMinTemp'
                            />
                            <TextInput
                                class="w-[33.3333%] p-4"
                                label='Normal sensor temperature range: maximum temperature (in degrees Celsius)'
                                name='tempConMaxTemp'
                            />
                            <TextInput
                                class="w-[33.3333%] p-4"
                                label='Normal sensor humidity range: minimum percentage point (expressed as a decimal number)'
                                name='humConMinPerc'
                            />
                        </div>
                    </Show>
		     <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row place-items-center w-[40rem] m-2">
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Normal sensor humidity range: maximum percentage point (expressed as a decimal number)'
                                name='humConMaxPerc'
                            />
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor accuracy range: minimum accurate degree (in degrees Celsius)'
                                name='sensorMinAcc'
                            />
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor accuracy range: maximum accurate degree (in degrees Celsius)'
                                name='sensorMaxAcc'
                            />
                        </div>
                     </Show>
		    <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row place-items-center w-[40rem] m-2">
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor sensitivity (in degrees Celsius)'
                                name='sensorSen'
                            />
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor precision range: minimum degree (in degrees Celsius)'
                                name='sensorMinPre'
                            />
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor precision range: maximum degree (in degrees Celsius)'
                                name='sensorMaxPre'
                            />
                        </div>
                    </Show>
		    <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row place-items-center w-[40rem] m-2">
			    <TextInput
                                class="w-[33.3333%] p-4"
                                label='Sensor frequency (in seconds)'
                                name='sensorFre'
                            />
                        </div>
                    </Show>
                </div>
                <For each={extraNodes}>
                    {(_, i) => {
                        return (
                            <div class="flex flex-col place-items-center m-2">
                                <h1 class="text-center divider">RDF Triple {i() + 1}</h1>
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Subject ${i() + 1}`}
                                    name={`extraNodes.${i()}.rdfSubject`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Predicate ${i() + 1}`}
                                    name={`extraNodes.${i()}.rdfPredicate`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Object ${i() + 1}`}
                                    name={`extraNodes.${i()}.rdfObject`}
                                />
                                <div class="flex flex-row place-items-start w-[40rem] m-2">
                                    <input name={`extras.${i()}.literal`} type="checkbox" class="checkbox p-4" />
                                    <label class='label ms-2' for={`extras.${i()}.literal`}>RDF Literal</label>
                                </div>
                            </div>
                        )
                    }}
                </For>
                <div class="flex flex-col place-items-center m-2">
                    <div class="flex flex-row justify-end w-[40rem] ">
                        <Show when={extraNodes.length > 0}>
                            <button class="btn btn-primary p-4" onClick={
                                () => {
                                    setExtraNodes(extraNodes.slice(0, -1));
                                }}>
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </Show>
                        <button class="btn p-4 ml-4" onClick={
                            () => setExtraNodes([...extraNodes, {}])}>
                            Add RDF Triple<i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
		    <div class="flex flex-row space-x-4 justify-center w-[40rem] p-4">
			<input name='rawCheck' type="checkbox" class="checkbox p-4" />
			<label class='label ms-2'>Show raw data on submit</label>
		    </div>
                </div>
                <div class="flex justify-center m-4">
                    <button class="btn" type="submit" onClick={realSubmit}>
                        Register Sensor <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </form>
	    <Show when={rawCheck.visible}>
		<h1 class="text-center divider">Submitted raw data</h1>
		<div class="mockup-code">
		    <pre><code>{data()}</code></pre>
		</div>
	    </Show>
        </div >
    );
}
