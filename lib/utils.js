import { validate } from "jsvalidator";
import Vue from "vue";

const validationSchema = {
	type : "object",
	schema : [
		{ name : "required", type : "boolean" },
		{ name : "custom", type : "function" }
	],
	allowExtraKeys : false
}

async function validateForm({ data, validation }) {
	const returnData = {
		valid : true,
		errors : []
	}
	
	for(let [name, schema] of Object.entries(validation)) {
		validate(schema, {
			...validationSchema,
			allowExtraKeys : false,
			throwOnInvalid : true
		});
		
		const val = data[name];
		
		if (schema.required === true && val === "") {
			// value doesn't exist and is required, fail
			returnData.errors.push({ name, message : "Field is required" });
			continue;
		}
		
		if (val === "") {
			// if the value is empty, don't run other validations
			continue;
		}
		
		if (schema.custom !== undefined) {
			const result = await schema.custom({ name, val, data });
			const validResult = validate(result, {
				type : "object",
				schema : [
					{ name : "valid", type : "boolean", required : true },
					{ name : "message", type : "string" },
				],
				required : true,
				allowExtraKeys : false
			});
			
			if (validResult.err) {
				console.log(`Custom validator for field '${name}' did not return the proper data`);
				throw validResult.err;
			}
			
			if (result.valid === false) {
				returnData.errors.push({ name, message : result.message });
				continue;
			}
		}
	}
	
	if (returnData.errors.length > 0) {
		returnData.valid = false;
	}
	
	return returnData;
}

function advancedPropsMixin({ schema, prop }) {
	const watch = {};
	const props = [];
	schema.forEach((val) => {
		props.push(val.name);
		watch[val.name] = function() {
			validateProps.call(this);
		}
	});
	
	const validateProps = function() {
		const valid = validate(this.$props, {
			type : "object",
			schema : schema
		});
		
		if (valid.err) {
			this[prop] = false;
			throw valid.err;
		}
		
		this[prop] = true;
	}
	
	return {
		props : props,
		data : function() {
			return {
				[prop] : false
			}
		},
		created : function() {
			validateProps.call(this);
		},
		watch : watch
	}
}

export {
	advancedPropsMixin,
	validationSchema,
	validateForm
}