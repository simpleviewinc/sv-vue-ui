<template>
	<div :class="name">
		<admin-form v-if="config"
			ref="form"
			:title="config.title"
			:buttons="true"
			:data="config.data"
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
			const data = await module.default({ routerArgs : this.routerArgs });
			
			validate(data, {
				type : "object",
				schema : [
					{ name : "title", type : "string" },
					{ name : "data", type : "object" },
					{ name : "fields", type : "array" },
					{ name : "save", type : "function" }
				],
				allowExtraKeys : false,
				throwOnInvalid : true
			});
			
			this.config = data;
		},
		data : function() {
			return {
				config : undefined
			}
		},
		methods : {
			cancel : async function() {
				adminRouter.back();
			},
			submit : async function({ data }) {
				try {
					await this.config.save({ data });
				} catch(e) {
					alert(e.message);
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