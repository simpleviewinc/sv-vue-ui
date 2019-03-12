<template>
	<form class="admin-form" v-if="valid" @submit.prevent="submit">
		<div class="header" v-if="showHeader">
			<div class="headerLeft">
				<i v-if="showBack" class="back fas fa-arrow-left" @click="cancelClick"></i>
				<h1 v-if="title">{{title}}</h1>
			</div>
			<div class="buttons" v-if="buttons">
				<admin-button type="button" theme="none" @click="cancelClick">Cancel</admin-button>
				<admin-button type="button" theme="primary" :inProgress="saveInProgress" @click="saveClick">Save</admin-button>
			</div>
		</div>
		<div class="fields">
			<div class="field" v-for="field in fieldsClean">
				<component
					:is="field.component"
					:label="field.label"
					:required="field.required"
					:args="field.args"
					:errorMessage="field.errorMessage"
					v-model="modelData[field.name]"
				></component>
			</div>
		</div>
		<div class="buttons" v-if="buttons">
			<admin-button type="submit" theme="primary" :inProgress="saveInProgress">Save</admin-button>
			<admin-button type="button" theme="none" @click="cancelClick">Cancel</admin-button>
		</div>
		<slot name="afterForm"></slot>
	</form>
</template>

<script>
	import Vue from "vue";
	import formFieldText from "./form-field-text.vue";
	import formFieldToggle from "./form-field-toggle.vue";
	import formFieldTagselect from "./form-field-tagselect.vue";
	import formFieldCheckbox from "./form-field-checkbox.vue";
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
								{ name : "type", type : "string", enum : ["text", "toggle", "custom", "tagselect", "checkbox"], required : true },
								{ name : "args", type : "object" },
								{ name : "validation", ...validationSchema },
							],
							allowExtraKeys : false
						},
						required : true
					},
					{ name : "buttons", type : "boolean" },
					{ name : "showBack", type : "boolean" },
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
					errorMessage : "",
					component : val.component ? val.component : `form-field-${val.type}`,
					required : val.validation && val.validation.required
				}
			});
			
			return {
				fieldsClean,
				modelData,
				saveInProgress : false
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
						this.fieldsObj[val.name].errorMessage = val.message;
					});
					
					return false;
				}
				
				return true;
			},
			submit : async function() {
				const valid = await this.validate();
				if (valid === false) { return; }
				
				this.saveInProgress = true;
				
				this.$emit("submit", {
					data : this.modelData
				});
			}
		},
		components : {
			adminButton,
			formFieldCheckbox,
			formFieldText,
			formFieldToggle,
			formFieldTagselect
		}
	}
</script>

<style scoped>
	@import "../css/theme.scss";
	
	.admin-form .header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid $brand-light-gray;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
	}
	
	.admin-form .headerLeft {
		display: flex;
		align-items: center;
	}
	
	.admin-form .headerLeft .back {
		padding-right: 10px;
		cursor: pointer;
	}
	
	.admin-form .header h1 {
		margin: 0px;
	}
	
	.admin-form .header .buttons {
		display: flex;
	}
	
	.admin-form .field {
		margin-bottom: 2rem;
	}
	
	.admin-form .fields {
		margin-bottom: 1rem;
	}
</style>