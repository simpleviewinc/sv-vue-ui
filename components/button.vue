<template>
	<div class="admin-button">
		<template v-if="isButton">
			<button type="button" :class="classes" @click="click"><slot></slot></button>
		</template>
		<template v-if="isIcon">
			<i v-if="isIcon" class="fas" :class="classes" @click="click"></i>
		</template>
	</div>
</template>

<script>
	import adminRouter from "@public/js/admin-router.js";
	
	export default {
		props : {
			type : {
				type : String,
				required : true,
				validator : function(value) {
					return ["icon", "button"].includes(value);
				}
			},
			actionType : {
				type : String,
				validator : function(value) {
					return ["primary", "neutral", "destructive"].includes(value);
				}
			},
			iconClass : {
				type : String
			},
			go : {
				type : Object
			}
		},
		computed : {
			classes : function() {
				const temp = [];
				
				if (this.actionType) {
					temp.push(this.actionType);
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
				if (this.go !== undefined) {
					adminRouter.go(this.go);
				}
				
				this.$emit("click");
			}
		}
	}
</script>

<style scoped>
	@import "@public/css/theme.scss";
	
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
		padding: 10px 20px;
		border-radius: 5px;
		color: black;
		background: none;
		text-decoration: none;
		text-transform: uppercase;
		cursor: pointer;
	}
	
	.admin-button button.primary {
		background: $highlight-color;
		color: white;
	}
	
	.admin-button button.destructive {
		background: $error-color;
		color: white;
	}
</style>