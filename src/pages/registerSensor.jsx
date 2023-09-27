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
            sensorData.extraNodeMetadata = [];
            sensorData.extraLiteralMetadata = [];
            if (typeof values.longitude !== 'undefined') {
                sensorData.extraNodeMetadata.push(
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/sosa/hasFeatureOfInterest',
                        o: `SSMS://#${sensorData.sensorName}#location`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}#location`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: `http://www.w3.org/ns/sosa/hasFeatureOfInterest`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}#location`,
                        p: 'http://www.w3.org/ns/sosa/isSampleOf',
                        o: `SSMS://earth`
                    },
                    {
                        s: `SSMS://earth`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: `http://www.w3.org/ns/sosa/hasFeatureOfInterest`
                    }
                );
                sensorData.extraLiteralMetadata.push(
                    {
                        s: `SSMS://#${sensorData.sensorName}#location`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#label',
                        o: `location of #${sensorData.sensorName}`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}#location`,
                        p: 'http://www.w3.org/2003/01/geo/wgs84_pos#lat',
                        o: `${values.latitude}`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}#location`,
                        p: 'http://www.w3.org/2003/01/geo/wgs84_pos#long',
                        o: `${values.longitude}`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}#location`,
                        p: 'http://www.w3.org/2003/01/geo/wgs84_pos#alt',
                        o: `${values.altitude}`
                    },
                    {
                        s: 'SSMS://earth',
                        p: 'http://www.w3.org/2000/01/rdf-schema#label',
                        o: 'earth'
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
                sensorData.extraNodeMetadata.push(
                    {
                        s: 'SSMS://#Procedure',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/Procedure'
                    },
                    {
                        s: 'SSMS://#Procedure',
                        p: 'http://www.w3.org/ns/ssn/hasOutput',
                        o: 'SSMS://#output'
                    },
                    {
                        s: 'SSMS://#output',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Output'
                    },
                    {
                        s: 'SSMS://#output',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'https://w3id.org/rdfp/GraphDescription'
                    },
                    {
                        s: 'SSMS://',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        s: 'SSMS://',
                        p: 'http://www.w3.org/ns/ssn/hasSubSystem',
                        o: `SSMS://#${sensorData.sensorName}`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/Sensor'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/systems/hasOperatingRange',
                        o: `SSMS://#${sensorData.sensorName}OperatingRange`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/sosa/observes',
                        o: `SSMS://#${sensorData.sensorName}Video`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/implements',
                        o: 'SSMS://#Procedure'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/OperatingRange',
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Video`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/ObservableProperty'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Video`,
                        p: 'http://www.w3.org/ns/sosa/isObservedBy',
                        o: `SSMS://#${sensorData.sensorName}`
                    },
		    {
                        s: 'SSMS://#MeasuringVideo',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/Procedure'
                    }
                );
                sensorData.extraLiteralMetadata.push(
                    {
                        s: 'SSMS://#output',
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'The output video segments.'
                    },
                    {
                        s: 'SSMS://',
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'Camera system contains a camera.'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'The embedded camera sensor in the system.'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}Video`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'Captures the light entering the camera through the lens so that it can be processed and turned into a digital video.'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}Video`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#label',
                        o: 'Video'
                    },
		    {
                        s: 'SSMS://#MeasuringVideo',
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'Instructions for measuring Video'
                    }
                );
	    } else if (selectedSensorType === "Sensor type: air temperature") {
                sensorData.extraNodeMetadata.push(
                    {
                        s: 'SSMS://#Procedure',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/Procedure'
                    },
                    {
                        s: 'SSMS://#Procedure',
                        p: 'http://www.w3.org/ns/ssn/hasOutput',
                        o: 'SSMS://#output'
                    },
                    {
                        s: 'SSMS://#output',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Output'
                    },
                    {
                        s: 'SSMS://#output',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'https://w3id.org/rdfp/GraphDescription'
                    },
                    {
                        s: 'SSMS://',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        s: 'SSMS://',
                        p: 'http://www.w3.org/ns/ssn/hasSubSystem',
                        o: `SSMS://#${sensorData.sensorName}`
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/Sensor'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/System'
                    },
                    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/systems/hasOperatingRange',
                        o: `SSMS://#${sensorData.sensorName}OperatingRange`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/systems/hasSystemCapability',
                        o: `SSMS://#${sensorData.sensorName}Capability`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/sosa/observes',
                        o: `SSMS://#${sensorData.sensorName}Temperature`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/implements',
                        o: 'SSMS://#Procedure'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/OperatingRange',
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        o: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        o: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Condition'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://schema.org/unitCode',
                        o: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Condition'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        p: 'http://schema.org/unitCode',
                        o: 'http://qudt.org/1.1/vocab/unit#Percent'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/SystemCapability'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        o: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/ns/ssn/systems/inCondition',
                        o: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/ns/ssn/systems/hasSystemProperty',
                        o: `SSMS://#${sensorData.sensorName}Accuracy`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/ns/ssn/systems/hasSystemProperty',
                        o: `SSMS://#${sensorData.sensorName}Sensitivity`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/ns/ssn/systems/hasSystemProperty',
                        o: `SSMS://#${sensorData.sensorName}Frequency`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Accuracy'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://schema.org/unitCode',
                        o: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Sensitivity'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Resolution'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://schema.org/unitCode',
                        o: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Precision'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://schema.org/unitCode',
                        o: 'http://qudt.org/1.1/vocab/unit#DegreeCelsius'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Frequency`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/Property'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Frequency`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/ssn/systems/Frequency'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Frequency`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://schema.org/PropertyValue'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Frequency`,
                        p: 'http://schema.org/unitCode',
                        o: 'http://qudt.org/1.1/vocab/unit#Second'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Temperature`,
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/ObservableProperty'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Temperature`,
                        p: 'http://www.w3.org/ns/sosa/isObservedBy',
                        o: `SSMS://#${sensorData.sensorName}`
                    },
		    {
                        s: 'SSMS://#MeasuringTemperature',
                        p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                        o: 'http://www.w3.org/ns/sosa/Procedure'
                    }
                );
                sensorData.extraLiteralMetadata.push(
                    {
                        s: 'SSMS://#output',
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'The output is a RDF Graph that describes the temperature.'
                    },
                    {
                        s: 'SSMS://',
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `SSMS://#${sensorData.sensorName} measures the air temperature.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'The air temperature sensor, a specific instance of temperature sensor.'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'The conditions in which the air temperature sensor is expected to operate.'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `A temperature range of ${values.tempConMinTemp} to ${values.tempConMaxTemp} degrees Celsius.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://schema.org/minValue',
                        o: `${values.tempConMinTemp}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalTemperatureCondition`,
                        p: 'http://schema.org/maxValue',
                        o: `${values.tempConMaxTemp}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `A relative humidity range of ${values.humConMinPerc}% to ${values.humConMaxPerc}%.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        p: 'http://schema.org/minValue',
                        o: `${values.humConMinPerc}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}NormalHumidityCondition`,
                        p: 'http://schema.org/maxValue',
                        o: `${values.humConMaxPerc}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Capability`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `The capabilities of the ${sensorData.sensorName} in normal temperature and humidity conditions.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `The accuracy of the ${sensorData.sensorName} is ${values.sensorMinAcc}°C to ${values.sensorMaxAcc}°C in normal temperature and humidity conditions.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://schema.org/minValue',
                        o: `${values.sensorMinAcc}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Accuracy`,
                        p: 'http://schema.org/maxValue',
                        o: `${values.sensorMaxAcc}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `The sensitivity and resolution of the ${sensorData.sensorName} is +-${values.sensorSen}°C in normal temperature and humidity conditions.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Sensitivity`,
                        p: 'http://schema.org/value',
                        o: `${values.sensorSen}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `The precision (= repeatability) of the ${sensorData.sensorName} is ${values.sensorMinPre}°C to ${values.sensorMaxPre}°C in normal temperature and humidity conditions.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://schema.org/minValue',
                        o: `${values.sensorMinPre}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Precision`,
                        p: 'http://schema.org/maxValue',
                        o: `${values.sensorMaxPre}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Frequency`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: `The smallest possible time between one observation and the next is ${values.sensorMaxPre}s on average.`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Frequency`,
                        p: 'http://schema.org/value',
                        o: `${values.sensorFre}`
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Temperature`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'Temperature is a measure of the heat content of air.'
                    },
		    {
                        s: `SSMS://#${sensorData.sensorName}Temperature`,
                        p: 'http://www.w3.org/2000/01/rdf-schema#label',
                        o: 'Air Temperature'
                    },
		    {
                        s: 'SSMS://#MeasuringTemperature',
                        p: 'http://www.w3.org/2000/01/rdf-schema#comment',
                        o: 'Instructions for measuring temperature'
                    }
                );
	    }

            values.extras?.forEach((extra) => {
                if (extra.literal) {
                    sensorData.extraLiteralMetadata.push({
                        s: extra.rdfSubject,
                        p: extra.rdfPredicate,
                        o: extra.rdfObject,
                    });
                } else {
                    sensorData.extraNodeMetadata.push({
                        s: extra.rdfSubject,
                        p: extra.rdfPredicate,
                        o: extra.rdfObject,
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
                        <div class="flex flex-row justify-between w-[40rem] m-2">
			    <div class='tooltip w-[32%]' data-tip='Sensor location: longitude'>
				<TextInput
				    label='Longitude'
				    name='longitude'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Sensor location: latitude'>
				<TextInput
				    label='Latitude'
                                    name='latitude'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Sensor location: altitude'>
				<TextInput
				    label='Altitude'
				    name='altitude'
				/>
			    </div>			    
                        </div>
                    </Show>
		    <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row justify-between w-[40rem] m-2">
			    <div class='tooltip w-[32%]' data-tip='Normal sensor temperature range: minimum temperature (in degrees Celsius)'>
				<TextInput
				    label='Min normal temperature'
				    name='tempConMinTemp'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Normal sensor temperature range: maximum temperature (in degrees Celsius)'>
				<TextInput
				    label='Max temperature'
                                    name='tempConMaxTemp'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Normal sensor humidity range: minimum percentage point (expressed as a decimal number)'>
				<TextInput
				    label='Min normal humidity'
				    name='humConMinPerc'
				/>
			    </div>
                        </div>
                    </Show>
		     <Show when={typePresets.names[1].selected}>
                         <div class="flex flex-row justify-between w-[40rem] m-2">
			    <div class='tooltip w-[32%]' data-tip='Normal sensor humidity range: maximum percentage point (expressed as a decimal number)'>
				<TextInput
				    label='Minimum normal humidity'
				    name='humConMaxPerc'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Sensor accuracy range: minimum accurate degree (in degrees Celsius)'>
				<TextInput
				    label='Minimum accuracy'
                                    name='sensorMinAcc'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Sensor accuracy range: maximum accurate degree (in degrees Celsius)'>
				<TextInput
				    label='Maximum accuracy'
				    name='sensorMaxAcc'
				/>
			    </div>			     
                        </div>
                     </Show>
		    <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row justify-between w-[40rem] m-2">
			    <div class='tooltip w-[32%]' data-tip='Sensor sensitivity (in degrees Celsius)'>
				<TextInput
				    label='Sensitivity'
				    name='sensorSen'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Sensor precision range: minimum degree (in degrees Celsius)'>
				<TextInput
				    label='Minimum precision'
                                    name='sensorMinPre'
				/>
			    </div>
			    <div class='tooltip w-[32%]' data-tip='Sensor precision range: maximum degree (in degrees Celsius))'>
				<TextInput
				    label='Maximum precision'
				    name='sensorMaxPre'
				/>
			    </div>			    
                        </div>
                    </Show>
		    <Show when={typePresets.names[1].selected}>
                        <div class="flex flex-row justify-between w-[40rem] m-2">
			    <div class='tooltip w-[32%]' data-tip='Sensor frequency (in seconds)'>
				<TextInput
				    label='Frequency'
				    name='sensorFre'
				/>
			    </div>			    
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
                                    name={`extras.${i()}.rdfSubject`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Predicate ${i() + 1}`}
                                    name={`extras.${i()}.rdfPredicate`}
                                />
                                <TextInput
                                    class="w-[40rem]"
                                    label={`RDF Object ${i() + 1}`}
                                    name={`extras.${i()}.rdfObject`}
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
		<div class="prose max-w-none">
		    <pre class="language-js"><code class="language-js">{data()}</code></pre>
		</div>
	    </Show>
        </div >
    );
}
