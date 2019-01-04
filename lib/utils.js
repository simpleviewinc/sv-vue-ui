// validateForm({
// 	data : {
// 		foo : "fooValue",
// 		active : true
// 	},
// 	validation : {
// 		foo : [
// 			{ rule : "required" },
// 			{ rule : "length", args : { min : 100, max : 100 },
// 		],
// 		active : [
// 			{ type : "boolean" }
// 		]
// 	}
// }

// validation : {
// 	foo : [
// 		{ rule : "required", message : "akjhdsaf" },
// 		{ rule : "length", args : { min : 100, max : 100 } },
// 		{ rule : "type", args : { type : "string" }, regex : { pattern : /13134/, message }, custom : function() { value !== "yourmom" { return { valid : false, message : "must be yourmom" } } }
// 	]
// }

// validation : {
// 	foo : { required : true, length : { min : 100, max : 100 }, type : "string", regex : { pattern : /afdadskf/, message : "" }, custom : function() {} },
// 	foo : [
		
// 	]
// 	bar : { type : "boolean" }
// }

// ->

// foo : [
// 	{ rule : "required" },
// 	{ rule : "length", args : { min : 100, max : 100 }, message : "asdfakjdsf" },
// 	{ rule : "type", args : { type : "string" } },
// 	{ rule : "regex", args : { pattern : /afdshkjsadf/, message  :"akjdsfads" } }
// ]


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
		validate(schema, { ...validationSchema, throwOnInvalid : true });
		
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

export {
	validationSchema,
	validateForm
}