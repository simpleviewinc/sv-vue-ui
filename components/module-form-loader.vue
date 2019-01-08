<template>
	<div :class="name">
		<admin-form v-if="config"
			:title="config.title"
			:buttons="true"
			:data="data"
			:fields="config.fields"
			@submit="submit"
			@cancel="cancel"
		>
		</admin-form>
	</div>
</template>

<script>
	import adminForm from "./form.vue";
	import adminRouter from "../lib/router.js";
	import { validate } from "jsvalidator";
	
	export default {
		props : ["name", "routerArgs"],
		created : async function() {
			const module = await import(`${SV_VUE_UI_FORMMODULEPATH}/${this.name}.js`);
			const config = await module.default({ routerArgs : this.routerArgs });
			
			validate(config, {
				type : "object",
				schema : [
					{ name : "title", type : "string" },
					{ name : "fields", type : "array" },
					{
						name : "methods",
						type : "object",
						schema : [
							{ name : "getData", type : "function" },
							{ name : "save", type : "function" }
						],
						default : function() { return {} },
						allowExtraKeys : false
					}
				],
				allowExtraKeys : false,
				throwOnInvalid : true
			});
			
			this.data = config.methods.getData ? await config.methods.getData() : undefined;
			this.config = config;
		},
		data : function() {
			return {
				data : undefined,
				config : undefined
			}
		},
		methods : {
			cancel : async function() {
				adminRouter.back();
			},
			submit : async function({ data }) {
				try {
					await this.config.methods.save({ data });
				} catch(e) {
					adminRouter.errorDialog(e);
					return;
				}
				
				this.routerArgs.args.save();
			}
		},
		components : {
			adminForm
		}
	}
</script>