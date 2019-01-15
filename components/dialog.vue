<template>
	<div class="admin-dialog" v-if="valid">
		<div class="mask"></div>
		<div class="content">
			<h2>{{title}}</h2>
			<p>{{text}}</p>
			<div class="buttons">
				<admin-button
					v-for="button in buttons"
					:key="button.name"
					:type="button.type"
					:theme="button.theme"
					:inProgress="button.inProgress"
					@click="button.click"
				>{{button.label}}</admin-button>
			</div>
		</div>
	</div>
</template>

<script>
	import adminButton from "./button.vue";
	import { advancedPropsMixin } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{ name : "title", type : "string", required : true },
					{ name : "text", type : "string", required : true },
					{
						name : "buttons",
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "name", type : "string", required : true },
								{ name : "type", type : "string", required : true },
								{ name : "theme", type : "string", required : true },
								{ name : "label", type : "string", required : true },
								{ name : "inProgress", type : "boolean" },
								{ name : "click", type : "function", required : true }
							],
							allowExtraKeys : false
						}
					}
				],
				prop : "valid"
			})
		],
		components : {
			adminButton
		}
	}
</script>

<style scoped>
	.admin-dialog {
		position: fixed;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
	}
	
	.admin-dialog .mask {
		height: 100%;
		width: 100%;
		position: absolute;
		background: black;
		opacity: .6;
	}
	
	.admin-dialog .content {
		position: relative;
		background: white;
		max-width: 400px;
		width: 100%;
		padding: 20px;
		margin: 0 auto;
		top: -50%;
		margin-top: 50%;
	}
	
	.admin-dialog .buttons {
		display: flex;
		justify-content: flex-end;
	}
	
	.admin-dialog .content h2 {
		margin-top: 0px;
	}
</style>