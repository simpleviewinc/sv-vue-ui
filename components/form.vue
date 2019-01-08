<template>
	<form class="admin-form" v-if="valid">
		<div class="header" v-if="showHeader">
			<h1 v-if="title">{{title}}</h1>
			<div class="buttons" v-if="buttons">
				<admin-button type="button" theme="none" @click="cancelClick">Cancel</admin-button>
				<admin-button type="button" theme="primary" @click="saveClick">Save</admin-button>
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
					v-model="modelData[field.name]"
				></component>
			</div>
		</div>
	</form>
</template>

<script>
	import Vue from "vue";
	import formFieldText from "./form-field-text.vue";
	import formFieldToggle from "./form-field-toggle.vue";
	import adminButton from "./button.vue";
	import { validationSchema, validateForm, advancedPropsMixin } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{
						name : "fields",
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "component", type : "any" },
								{ name : "name", type : "string", required : true },
								{ name : "label", type : "string", required : true },
								{ name : "type", type : "string", enum : ["text", "toggle", "custom"], required : true },
								{ name : "args", type : "object" },
								{ name : "validation", ...validationSchema },
							],
							allowExtraKeys : false
						},
						required : true
					},
					{ name : "buttons", type : "boolean" },
					{ name : "data", type : "object" },
					{ name : "title", type : "string" }
				],
				prop : "valid"
			})
		],
		data : function() {
			const modelData = { ...this.data };
			
			const fieldsClean = this.fields.map(val => {
				return {
					...val,
					component : val.component ? val.component : `form-field-${val.type}`,
					required : val.validation && val.validation.required
				}
			});
			
			return {
				fieldsClean,
				modelData
			}
		},
		computed : {
			showHeader : function() {
				return this.title || this.buttons;
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
		methods : {
			cancelClick : function() {
				this.$emit("cancel");
			},
			saveClick : async function() {
				await this.submit();
			},
			validate : async function() {
				const result = await validateForm({
					data : this.modelData,
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
			submit : async function() {
				const valid = await this.validate();
				if (valid === false) { return; }
				
				this.$emit("submit", {
					data : this.modelData
				});
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
		display: flex;
	}
</style>