<template>
	<div class="inputWrapper" :class="{ active : focus || value, error : errorMessage }">
		<label>{{label}}<span v-if="required"> *</span></label>
		<button v-if="cleanArgs.type === 'password' && value" type="button" tabindex="-1" class="showButton" @click="showCharacters = !showCharacters">{{showButtonText}}</button>
		<input ref="input" :type="inputType" class="inputField" v-model="data" @focus="focus = true" @blur="focus = false"/>
		<div class="validationError" v-if="errorMessage">{{errorMessage}}</div>
	</div>
</template>

<script>
	import jsvalidator from "jsvalidator";
	
	export default {
		props : ["value", "label", "required", "args"],
		data : function() {
			const cleanArgs = Object.assign({}, this.args);
			jsvalidator.validate(cleanArgs, {
				type : "object",
				schema : [
					{ name : "type", type : "string", default : "text" },
					{ name : "autofocus", type : "boolean", default : false }
				],
				allowExtraKeys : false,
				throwOnInvalid : true
			});
			
			return {
				cleanArgs,
				errorMessage : "",
				data : this.value,
				showCharacters : false,
				focus : false
			}
		},
		mounted : function() {
			if (this.cleanArgs.autofocus === true) {
				this.$refs.input.focus();
			}
		},
		computed : {
			error : function() {
				return this.errorMessage !== "";
			},
			inputType : function() {
				return this.cleanArgs.type === "text" || this.showCharacters === true ? "text" : "password";
			},
			showButtonText : function() {
				return this.showCharacters === true ? "Hide" : "Show";
			}
		},
		watch : {
			value : function(newVal) {
				this.data = newVal;
			},
			data : function() {
				if (this.data !== "") {
					this.errorMessage = "";
				}
				
				this.$emit("input", this.data);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@public/css/theme.scss";
	
	.inputWrapper {
		margin-bottom: 1rem;
		position: relative;
		padding-top: 10px;
	}
	
	.inputWrapper label {
		position: absolute;
		top: 16px;
		transition-property: font-size, top;
		transition-duration: .25s;
		font-size: 20px;
		pointer-events: none;
	}
	
	.inputWrapper.active label {
		top: 0px;
		font-size: 14px;
		color: $highlight-color;
	}
	
	.inputWrapper .showButton {
		position: absolute;
		right: 0px;
		top: -5px;
		padding: 5px 10px;
		background: none;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
	}
	
	.inputWrapper .showButton:focus {
		outline: none;
	}
	
	.inputWrapper .validationError {
		font-size: 12px;
		color: $error-color;
		padding-top: 4px;
		margin-top: 2px;
	}
	
	.inputField {
		display: block;
		width: 100%;
		border: 0;
		border-bottom: 1px solid #ccc;
		padding: 12px 0px 6px 0px;
	}
	
	.inputField:focus {
		border: 0;
		border-bottom: 2px solid $highlight-color;
		padding-bottom: 5px;
		outline: none;
	}
	
	.inputWrapper.error .inputField {
		border-bottom: 2px solid $error-color;
	}
</style>