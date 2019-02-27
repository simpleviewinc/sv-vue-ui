<template>
	<div class="inputWrapper" :class="{ focus : focus, active : focus || value, error : hasError, [`inputType_${inputType}`] : true }">
		<div class="container">
			<input ref="input" :type="inputType" class="inputField textStyles" v-model="data" @focus="focus = true"/>
			<label class="textStyles">{{label}}<span v-if="!required"> (optional)</span></label>
			<button v-if="cleanArgs.type === 'password'" type="button" tabindex="-1" class="showButton" @click="showCharacters = !showCharacters">{{showButtonText}}</button>
		</div>
		<div class="validationError" v-if="hasError">{{$data.$_errorMessage}}</div>
	</div>
</template>

<script>
	import { advancedPropsMixin, mirrorProp } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{ name : "value", type : "string" },
					{ name : "label", type : "string", required : true },
					{ name : "errorMessage", type : "string" },
					{ name : "required", type : "boolean" },
					{
						name : "args",
						type : "object",
						schema : [
							{ name : "type", type : "string" },
							{ name : "autofocus", type : "boolean" }
						],
						allowExtraKeys : false
					}
				],
				prop : "valid"
			}),
			mirrorProp({ name : "errorMessage" })
		],
		data : function() {
			return {
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
			cleanArgs : function() {
				const cleanArgs = { ...this.args };
				cleanArgs.type = cleanArgs.type !== undefined ? cleanArgs.type : "text";
				cleanArgs.autofocus = cleanArgs.autofocus !== undefined ? cleanArgs.autofocus : false;
				
				return cleanArgs;
			},
			hasError : function() {
				return this.$data.$_errorMessage !== "";
			},
			inputType : function() {
				return this.cleanArgs.type === "text" || this.showCharacters === true ? "text" : "password";
			},
			showButtonText : function() {
				return this.showCharacters === true ? "Hide" : "Show";
			}
		},
		watch : {
			focus : function(newVal) {
				this.$emit(newVal === true ? "focus" : "blur");
			},
			value : function(newVal) {
				this.data = newVal;
			},
			data : function() {
				if (this.data !== "") {
					this.$data.$_errorMessage = "";
				}
				
				this.$emit("input", this.data === "" ? undefined : this.data);
			}
		}
	}
</script>

<style scoped>
	@import "../css/theme.scss";
	
	.inputWrapper {
		position: relative;
		max-width: 400px;
		width: 100%;
	}
	
	.inputWrapper .container {
		border: 1px solid $brand-light-gray;
		height: 55px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.inputWrapper.focus .container {
		border: 1px solid $brand-blue;
	}
	
	.inputWrapper .textStyles {
		font-size: 20px;
		font-family: $font-light;
	}
	
	.inputWrapper label {
		position: relative;
		top: 0px;
		transition-property: font-size, top;
		transition-duration: .25s;
		pointer-events: none;
		background: white;
		margin-left: 9px;
		padding: 3px;
		color: $brand-medium-gray;
	}
	
	.inputWrapper.active label {
		position: relative;
		top: -27px;
		font-size: 13px;
		font-family: $font-heavy;
		color: $brand-almost-black;
	}
	
	.inputWrapper.focus label {
		color: $brand-blue;
	}
	
	.inputWrapper .showButton {
		position: relative;
		right: 12px;
		padding: 5px 10px;
		background: none;
		border: 1px solid $brand-light-gray;
		cursor: pointer;
	}
	
	.inputWrapper .showButton:focus {
		outline: none;
	}
	
	.inputWrapper .validationError {
		font-size: 12px;
		color: $brand-red;
		padding-top: 4px;
		margin-top: 2px;
	}
	
	.inputField {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
		display: block;
		border: 0;
		outline: none;
		background: none;
		font-size: 16px;
		padding-left: 12px;
		padding-right: 12px;
		color: $brand-almost-black;
	}
	
	.inputWrapper.error .container {
		border: 1px solid $brand-red;
	}
	
	.inputWrapper.error label {
		color: $brand-red;
	}
	
	.inputWrapper.inputType_password .inputField {
		/* allocate space for show/hide button */
		padding-right: 80px;
	}
</style>