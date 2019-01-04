<template>
	<div class="admin-form">
		<div class="header">
			<h1>{{action}} {{title}}</h1>
			<div class="buttons">
				<admin-button type="button" @click="cancel">Cancel</admin-button>
				<admin-button type="button" action-type="primary" @click="save">Save</admin-button>
			</div>
		</div>
		<div class="fields">
			<div class="field" v-for="field in fieldsClean">
				<component
					:is="field.component"
					:ref="field.name"
					:label="field.label"
					:required="field.required"
					:args="field.args"
					v-model="data[field.name]"
				></component>
			</div>
		</div>
	</div>
</template>

<script>
	import formFieldText from "./form-field-text.vue";
	import formFieldToggle from "./form-field-toggle.vue";
	import adminButton from "./button.vue";
	import adminRouter from "@public/js/admin-router.js";
	import { allowedKeys } from "@public/js/utils.js";
	import { validationSchema, validateForm } from "../lib/utils.js";
	import { validate } from "jsvalidator";
	
	export default {
		props : {
			title : {
				type : String,
				required : true
			},
			fields : {
				type : Array,
				required : true,
				validator : function(value) {
					const valid = validate(value, {
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "name", type : "string", required : true },
								{ name : "component", type : "string" },
								{ name : "label", type : "string", required : true },
								{ name : "type", type : "string", enum : ["text", "toggle"], required : true },
								{ name : "args", type : "object" },
								{ name : "validation", ...validationSchema },
							],
							allowExtraKeys : false
						}
					});
					
					if (valid.err) {
						console.log(valid.err);
						return false;
					}
					
					return true;
				}
			},
			api : Object,
			routerArgs : Object,
			initialData : {
				type : Object,
				default : function() { return {}; }
			}
		},
		data : function() {
			const fieldsClean = this.fields.map(val => {
				val.component = `form-field-${val.type}`;
				val.required = val.validation && val.validation.required;
				
				return val;
			});
			
			const data = Object.assign({}, this.initialData);
			fieldsClean.forEach(val => {
				data[val.name] = "";
			});
			
			return {
				action : "Create",
				fieldsClean,
				data
			}
		},
		computed : {
			queryColumns : function() {
				return this.fieldsClean.map(val => val.name).join(" ");
			},
			fieldsObj : function() {
				return this.fieldsClean.reduce((prev, curr) => { 
					prev[curr.name] = curr;
					return prev;
				}, {});
			},
			validationObj : function() {
				return this.fieldsClean.filter(val => val.validation).reduce((prev, curr) => {
					prev[curr.name] = curr.validation;
					return prev;
				}, {});
			}
		},
		created : async function() {
			if (this.routerArgs.args.filter === undefined) { return; }
			
			const data = await this.api.find({ filter : this.routerArgs.args.filter, fields : `docs { ${this.queryColumns} }` });
			const doc = data.docs[0];
			this.fieldsClean.forEach(val => {
				if (doc[val.name] !== undefined) {
					this.data[val.name] = doc[val.name];
				}
			});
		},
		methods : {
			validate : async function() {
				const result = await validateForm({
					data : this.data,
					validation : this.validationObj
				});
				
				if (result.valid === false) {
					result.errors.forEach(val => {
						this.$refs[val.name][0].errorMessage = val.message;
					});
					
					return false;
				}
				
				return true;
			},
			cancel : function() {
				adminRouter.back();
			},
			save : async function() {
				const valid = await this.validate();
				if (valid === false) { return; }
				
				await this.api.upsert({ input : this.data });
				
				this.routerArgs.args.save();
			}
		},
		components : {
			adminButton,
			formFieldText,
			formFieldToggle
		}
	}
</script>

<style scoped>
	.admin-form .header {
		display: flex;
		justify-content: space-between;
	}
	
	.admin-form .header .buttons {
		
	}
</style>