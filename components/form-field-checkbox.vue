<template>
	<div class="form-field-browse-tags">
		<h3>{{label}}</h3>
		<div class="loading" v-if="options === undefined">
			Loading... <i class="fas fa-spinner fa-spin"></i>
		</div>
		<div class="options" v-if="options">
			<div class="option" v-for="option in options" :key="option.value">
				<i
					class="far"
					:class="{ 'fa-square' : !data.includes(option.value), 'fa-check-square' : data.includes(option.value) }"
					@click="click(option)"
				></i>
				<span>{{option.label}}</span>
			</div>
		</div>
	</div>
</template>

<script>
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
				data : this.value ? this.value.slice() : [],
				options : undefined
			}
		},
		mounted : async function() {
			this.options = await this.args.getOptions();
			this.data = this.data.filter(val => this.optionValues.includes(val));
		},
		computed : {
			optionValues : function() {
				return this.options.map(val => val.value);
			}
		},
		methods : {
			click : function(option) {
				const index = this.data.indexOf(option.value);
				if (index === -1) {
					this.data.push(option.value);
				} else {
					this.data.splice(index, 1);
				}
			}
		},
		watch : {
			data : function() {
				this.$emit("input", this.data.length > 0 ? this.data : undefined);
			}
		}
	}
</script>
	
<style scoped>
	@import "../css/theme.scss";
	
	.option {
		margin-bottom: 5px;
		display: flex;
		align-items: center;
	}
	
	.option i {
		cursor: pointer;
		margin-right: 5px;
		font-size: 20px;
	}
</style>