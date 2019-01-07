<template>
	<div class="form-field-toggle" v-if="valid">
		<div class="input" @click="toggle" :class="{ active : data }">
			<div class="slide"></div>
			<div class="knob"></div>
		</div>
		<div class="label">
			{{label}}
		</div>
	</div>
</template>

<script>
	import { advancedPropsMixin } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{ name : "value", type : "boolean", required : true },
					{ name : "label", type : "string", required : true }
				],
				prop : "valid"
			})
		],
		data : function() {
			return {
				data : this.value
			}
		},
		methods : {
			toggle : function() {
				this.data = !this.data;
			}
		},
		watch : {
			value : function(newVal) {
				this.data = newVal;
			},
			data : function() {
				this.$emit("input", this.data);
			}
		}
	}
</script>

<style scoped>
	@import "../css/theme.scss";
	
	.form-field-toggle {
		position: relative;
		display: flex;
		margin-bottom: 20px;
	}
	
	.input {
		margin-right: 50px;
		cursor: pointer;
	}
	
	.slide {
		position: absolute;
		top: 3px;
		width: 40px;
		height: 14px;
		background: black;
		border-radius: 7px;
		opacity: .4;
	}
	
	.knob {
		position: absolute;
		left: 0px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
		background: white;
		transition: transform .1s;
	}
	
	.input.active .slide {
		background: $highlight-color;
	}
	
	.input.active .knob {
		background: $highlight-color;
		transform: translateX(23px);
	}
</style>