<template>
	<div :class="name">
		<admin-list
			v-if="loaded && access"
			:title="config.title"
			:showBack="showBack"
			:columns="config.columns"
			:actions="config.actions"
			:buttons="config.buttons"
			:data="data"
			@cancel="cancel"
			@filter="filter"
		></admin-list>
		<div v-if="access === false">
			<h1>Permission Denied</h1>
			<p>User lacks access to this module.</p>
		</div>
	</div>
</template>

<script>
	import adminList from "./list.vue";
	import adminRouter from "../lib/router.js";
	import { validate } from "jsvalidator";
	
	export default {
		props : ["name", "routerArgs"],
		created : async function() {
			const module = await import(`${SV_VUE_UI_LISTMODULEPATH}/${this.name}.js`);
			const config = module.default({ routerArgs : this.routerArgs });
			
			validate(config, {
				type : "object",
				schema : [
					{ name : "title", type : "string" },
					{ name : "permissions", type : "object", default : function() { return {} } },
					{ name : "columns", type : "array" },
					{ name : "createUrl", type : "string" },
					{ name : "idColumn", type : "string", default : "id" },
					{ name : "actions", type : "array", default : function() { return [] } },
					{ name : "buttons", type : "array", default : function() { return [] } },
					{
						name : "methods",
						type : "object",
						schema : [
							{ name : "checkPerms", type : "function" },
							{ name : "getData", type : "function" },
							{ name : "remove", type : "function" }
						],
						allowExtraKeys : false
					}
				],
				allowExtraKeys : false,
				throwOnInvalid : true
			});
			
			this.config = config;
			
			await this.checkAccess();
			await this.processButtons();
			await this.processActions();
			
			this.loaded = true;
		},
		data : function() {
			return {
				config : undefined,
				data : undefined,
				loaded : false,
				access : undefined
			}
		},
		computed : {
			showBack : function() {
				return this.routerArgs.type === "overlay" ? true : false;
			}
		},
		methods : {
			processActions : async function() {
				for(let [key, action] of Object.entries(this.config.actions)) {
					if (typeof action === "string" && !["edit", "select", "remove"].includes(action)) {
						throw new Error("Invalid action name.");
					}
					
					if (typeof action === "object" && !action.name.match(/^custom_.+/)) {
						throw new Error("Invalid custom action, must be prefixed 'custom_' e.g. 'custom_name'.");
					}
					
					// setup default actions
					if (action === "edit") {
						this.config.actions[key] = {
							name : "edit",
							type : "icon",
							"icon-class" : "fa-pencil-alt",
							click : ({ row }) => {
								this.edit({ row });
							}
						}
					} else if (action === "remove") {
						this.config.actions[key] = {
							name : "remove",
							type : "icon",
							"icon-class" : "fa-trash-alt",
							click : ({ row }) => {
								this.remove({ row });
							}
						}
					} else if (action === "select") {
						this.config.actions[key] = {
							name : "select",
							type : "button",
							theme : "primary",
							label : "Select",
							click : ({ row }) => {
								this.select({ row });
							}
						}
					}
					
					const permName = `action_${this.config.actions[key].name}`;
					const perms = this.config.permissions[permName];
					if (perms) {
						const valid = await this.config.methods.checkPerms({ name : permName, perms : perms });
						if (!valid) {
							this.config.actions[key] = undefined;
						}
					}
				}
				
				// filter out undefined values because they failed perm checks
				this.config.actions = this.config.actions.filter(val => val);
			},
			processButtons : async function() {
				for(let [key, button] of Object.entries(this.config.buttons)) {
					if (typeof button === "string" && !["create"].includes(button)) {
						throw new Error("Invalid button name.");
					}
					
					if (typeof button === "object" && !button.name.match(/^custom_.+/)) {
						throw new Error("Invalid custom button, must be prefixed 'custom_' e.g. 'custom_name'.");
					}
					
					// setup default actions
					if (button === "create") {
						this.config.buttons[key] = {
							name : "create",
							label : "Create New",
							type : "button",
							theme : "primary",
							click : () => { this.create() }
						}
					}
					
					const permName = `button_${this.config.buttons[key].name}`;
					const perms = this.config.permissions[permName];
					if (perms) {
						const valid = await this.config.methods.checkPerms({ name : permName, perms : perms });
						if (!valid) {
							this.config.buttons[key] = undefined;
						}
					}
				}
				
				// filter out undefined values because they failed perm checks
				this.config.buttons = this.config.buttons.filter(val => val);
			},
			checkAccess : async function() {
				const accessPerms = this.config.permissions.access;
				if (accessPerms) {
					this.access = await this.config.methods.checkPerms({ name : "access", perms : accessPerms });
				} else {
					this.access = true;
				}
			},
			cancel : function() {
				adminRouter.back();
			},
			edit : function({ row }) {
				adminRouter.go({
					url : this.config.createUrl,
					type : "overlay",
					args : {
						filter : {
							[this.config.idColumn] : row[this.config.idColumn]
						},
						save : () => {
							adminRouter.back();
							adminRouter.go(this.routerArgs);
						}
					}
				});
			},
			filter : async function() {
				this.data = await this.config.methods.getData();
			},
			create : function() {
				adminRouter.go({
					url : this.config.createUrl,
					type : "overlay",
					args : {
						save : () => {
							adminRouter.back();
							adminRouter.go(this.routerArgs);
						}
					}
				});
			},
			remove : async function({ row }) {
				const buttons = [
					{
						name : "cancel",
						type : "button",
						theme : "none",
						label : "Cancel",
						click : () => {
							adminRouter.dialogClose()
						}
					},
					{
						name : "remove",
						type : "button",
						theme : "destructive",
						label : "Delete",
						inProgress : false,
						click : async () => {
							buttons[1].inProgress = true;
							
							try {
								await this.config.methods.remove({ filter : { [this.config.idColumn] : row[this.config.idColumn] } });
							} catch(e) {
								adminRouter.errorDialog(e);
								return;
							}
							
							adminRouter.dialogClose();
							adminRouter.go(this.routerArgs);
						}
					}
				]
				
				adminRouter.dialogOpen({
					title : "Delete?",
					text : "This will will permanently delete this item.",
					buttons : buttons
				});
			},
			select : function({ row }) {
				this.routerArgs.args.select({ row });
			}
		},
		components : {
			adminList
		}
	}
</script>