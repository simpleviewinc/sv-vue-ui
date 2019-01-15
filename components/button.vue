<template>
	<div class="admin-button" v-if="valid">
		<template v-if="isButton">
			<button type="button" :class="classes" @click="click"><slot></slot> <i class="spinner fas fa-spinner fa-spin" v-if="inProgress"></i></button>
		</template>
		<template v-if="isIcon">
			<i v-if="isIcon" class="fas" :class="classes" @click="click"></i>
		</template>
	</div>
</template>

<script>
	import { advancedPropsMixin } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{ name : "type", type : "string", enum : ["icon", "button"], required : true },
					{ name : "theme", type : "string", enum : ["primary", "none", "destructive"] },
					{ name : "inProgress", type : "boolean" },
					{ name : "iconClass", type : "string" }
				],
				prop : "valid"
			})
		],
		data : function() {
			return {}
		},
		computed : {
			classes : function() {
				const temp = [];
				
				if (this.theme) {
					temp.push(`theme_${this.theme}`);
				}
				
				if (this.isIcon) {
					temp.push(this.iconClass);
				}
				
				return temp;
			},
			isIcon : function() {
				return this.type === "icon";
			},
			isButton : function() {
				return this.type === "button";
			}
		},
		methods : {
			click : function() {
				this.$emit("click");
			}
		}
	}
</script>

<style scoped>
	@import "../css/theme.scss";
	
	.admin-button {
		display: inline-block;
	}
	
	.admin-button i {
		cursor: pointer;
		color: black;
		padding: 10px 10px;
	}
	
	.admin-button button {
		border: 0;
		padding: 14px 24px;
		text-decoration: none;
		text-transform: uppercase;
		cursor: pointer;
		font-family: $font-heavy;
	}
	
	.admin-button button .spinner {
		color: white;
		padding: 0px 0px 0px 0px;
	}
	
	.admin-button button.theme_none {
		background: none;
		color: $brand-almost-black;
	}
	
	.admin-button button.theme_primary {
		background: $brand-blue;
		color: white;
	}
	
	.admin-button button.theme_destructive {
		background: $brand-red;
		color: white;
	}
</style>