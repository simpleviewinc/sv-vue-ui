<template>
	<div class="form-field-tagselect" v-if="valid">
		<div class="loading" v-if="options === undefined">
			Loading... <i class="fas fa-spinner fa-spin"></i>
		</div>
		<form-field-text
			v-if="options"
			@focus="focus"
			@blur="blur"
			:label="label"
			errorMessage=""
		></form-field-text>
		<div class="options" v-if="showDropdown && options">
			<div class="option validOption" v-for="option in availableOptions" :key="option.value" @click="choose(option)">{{option.label}}</div>
			<div class="option noneOption" v-if="!availableOptions.length">None</div>
		</div>
		<div class="chosen" v-if="chosen">
			<div class="item" v-for="item in chosen">{{item.label}} <i class="fas fa-times" @click="remove(item)"></i></div>
		</div>
	</div>
</template>

<script>
	import formFieldText from "./form-field-text.vue";
	import { advancedPropsMixin, mirrorProp } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{ name : "value", type : "array", schema : { type : "string" } },
					{ name : "label", type : "string", required : true },
					{ name : "errorMessage", type : "string" },
					{ name : "required", type : "boolean" },
					{
						name : "args",
						type : "object",
						schema : [
							{ name : "getOptions", type : "function", required : true }
						],
						allowExtraKeys : false,
						required : true
					}
				],
				prop : "valid"
			}),
			mirrorProp({ name : "errorMessage" })
		],
		data : function() {
			return {
				showDropdown : false,
				data : this.value ? this.value.slice() : [],
				options : undefined
			};
		},
		computed : {
			chosen : function() {
				if (this.options === undefined) { return; }
				
				return this.options.filter(val => this.data.includes(val.value));
			},
			availableOptions : function() {
				return this.options.filter(val => !this.data.includes(val.value));
			}
		},
		mounted : async function() {
			this.options = await this.args.getOptions();
		},
		watch : {
			data : function() {
				this.$emit("input", this.data.length > 0 ? this.data : undefined);
			}
		},
		methods : {
			focus : async function() {
				this.showDropdown = true;
			},
			blur : function() {
				setTimeout(() => {
					this.showDropdown = false;
				}, 100);
			},
			choose : function(option) {
				this.data.push(option.value);
				this.showDropdown = false;
			},
			remove : function(option) {
				this.data.splice(this.data.indexOf(option.value), 1);
			}
		},
		components : {
			formFieldText
		}
	}
</script>

<style scoped>
	@import "../css/theme.scss";
	
	.form-field-tagselect {
		max-width: 400px;
	}
	
	.options {
		width: 400px;
		max-height: 300px;
		position: absolute;
		background: white;
		z-index: 1;
		overflow-y: scroll;
		border: 1px solid #ccc;
	}
	
	.options .option {
		padding: 5px 12px;
		cursor: pointer;
	}
	
	.options .noneOption {
		font-style: italic;
		color: $brand-gray;
	}
	
	.options .validOption:hover {
		background: $brand-blue;
		color: white;
	}
	
	.chosen {
		margin-top: 1rem;
	}
	
	.chosen .item {
		background: $brand-light-gray;
		padding: 5px 10px;
		display: inline-block;
		margin-right: 5px;
		margin-bottom: 5px;
	}
	
	.chosen .item:hover {
		background: $brand-gray;
	}
	
	.chosen .item i {
		cursor: pointer;
		padding-left: 5px;
	}
</style>