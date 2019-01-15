<template>
	<div class="inputWrapper" :class="{ focus : focus, active : focus || value, error : hasError, ['theme_' + cleanArgs.theme] : true }">
		<div class="container">
			<input ref="input" :type="inputType" class="inputField" v-model="data" @focus="focus = true" @blur="focus = false"/>
			<label>{{label}}<span v-if="!required"> (optional)</span></label>
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
							{ name : "theme", type : "string", enum : ["light", "dark"] },
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
				cleanArgs.theme = cleanArgs.theme !== undefined ? cleanArgs.theme : "dark";
				
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
		margin-bottom: 1rem;
		position: relative;
		max-width: 400px;
		width: 100%;
	}
	
	.inputWrapper .container {
		border-bottom: 1px solid #999;
		height: 65px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.inputWrapper.focus .container {
		border-bottom: 1px solid $brand-blue;
	}
	
	.inputWrapper label {
		position: relative;
		top: 0px;
		color: #555;
		transition-property: font-size, top;
		transition-duration: .25s;
		font-size: 18px;
		pointer-events: none;
	}
	
	.inputWrapper.active label {
		position: relative;
		top: -15px;
		font-size: 14px;
	}
	
	.inputWrapper.focus label {
		color: $brand-blue;
	}
	
	.inputWrapper .showButton {
		position: relative;
		padding: 5px 10px;
		background: none;
		border: 1px solid #ccc;
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
		height: 100%;
		width: 100%;
		padding-top: 20px;
		display: block;
		border: 0;
		outline: none;
		background: none;
		font-size: 16px;
	}
	
	.inputWrapper.error .container {
		border-bottom: 1px solid $brand-red;
	}
	
	.inputWrapper.error label {
		color: $brand-red;
	}
	
	.inputWrapper.theme_dark .container {
		background: #ddd;
		padding-left: 12px;
		padding-right: 12px;
	}
</style>