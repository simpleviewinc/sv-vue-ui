<template>
	<div id="admin" v-if="valid">
		<div class="header">
			<slot name="header"></slot>
		</div>
		<div class="body">
			<div class="sidebar">
				<ul v-if="nav">
					<li v-for="item in nav" :key="item.name" @click="go(item.routerArgs)">{{item.label}}</li>
				</ul>
			</div>
			<div class="main" v-if="mainComponent">
				<component v-bind="mainComponent"></component>
			</div>
		</div>
		<div class="overlay" :class="{ open : trayOpen }">
			<div class="mask"></div>
			<transition-group
				name="tray-anim"
				tag="div"
				class="trays"
				@after-leave="closeComplete"
			>
				<div
					class="tray"
					v-for="(trayComponent, i) in trayComponents"
					:key="i"
				>
					<component v-bind="trayComponent"></component>
				</div>
			</transition-group>
		</div>
		<admin-dialog
			v-if="dialog"
			:title="dialog.title"
			:text="dialog.text"
			:buttons="dialog.buttons"
		></admin-dialog>
	</div>
</template>

<script>
	import adminRouter from "../lib/router.js";
	import adminDialog from "./dialog.vue";
	import { validate } from "jsvalidator";
	import { advancedPropsMixin } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{
						name : "routeMap",
						type : "indexObject",
						schema : {
							type : "object",
							schema : [
								{ name : "is", type : "object", required : true },
								{ name : "name", type : "string" }
							],
							allowExtraKeys : false
						}
					},
					{
						name : "nav",
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "name", type : "string", required : true },
								{ name : "label", type : "string", required : true },
								{ name : "routerArgs", type : "object" }
							],
							allowExtraKeys : false
						}
					}
				],
				prop : "valid"
			})
		],
		props : ["routeMap", "nav"],
		data : function() {
			return {
				dialog : undefined,
				mainComponent : undefined,
				trayComponents : [],
				trayOpen : false,
				email : ""
			}
		},
		created : async function() {
			// pass calls from the adminRouter to our routeHandler
			adminRouter.$on("dialog", this.dialogHandler);
			adminRouter.$on("errorDialog", this.errorDialogHandler);
			adminRouter.$on("go", this.goHandler);
			adminRouter.$on("back", this.backHandler);
			window.onpopstate = (event) => {
				// this.mainComponent = routeMap[document.location.pathname];
			}
			
			this.$emit("created");
		},
		methods : {
			go : function(args) {
				adminRouter.go(args);
			},
			dialogHandler : function(args) {
				if (args === undefined) {
					this.dialog = undefined;
					return;
				}
				
				validate(args, {
					type : "object",
					schema : [
						{ name : "title", type : "string" },
						{ name : "text", type : "string" },
						{ name : "buttons", type : "array" }
					],
					allowExtraKeys : false,
					throwOnInvalid : true
				});
				
				this.dialog = args;
			},
			errorDialogHandler : function(e) {
				this.dialog = {
					title : "Error",
					text : e.message,
					buttons : [
						{
							name : "ok",
							type : "button",
							theme : "primary",
							label : "Ok",
							click : () => {
								this.dialog = undefined;
							}
						}
					]
				}
			},
			backHandler : function(args) {
				this.closeTray();
			},
			goHandler : function(args) {
				validate(args, {
					type : "object",
					schema : [
						{ name : "url", type : "string", required : true },
						{ name : "type", type : "string", enum : ["main", "overlay"], default : "main" },
						{ name : "args", type : "object", default : {} }
					],
					allowExtraKeys : false,
					throwOnInvalid : true
				});
				
				const route = this.routeMap[args.url];
				
				if (args.type === "main") {
					this.mainComponent = undefined;
					this.$nextTick(function() {
						window.history.pushState({}, "", args.url);
						
						this.mainComponent = {
							is : route.is,
							name : route.name,
							routerArgs : args
						};
					});
				} else if (args.type === "overlay") {
					this.trayOpen = true;
					this.trayComponents.push({
						is : route.is,
						name : route.name,
						routerArgs : args
					});
				}
			},
			closeComplete : function() {
				if (this.trayComponents.length === 0) {
					this.trayOpen = false;
				}
			},
			closeTray : function() {
				this.trayComponents.pop();
			}
		},
		components: {
			adminDialog
		}
	}
</script>

<style lang="scss">
	@import "@simpleview/vue-ui/css/theme.scss";
	
	* {
		box-sizing: border-box;
	}
	
	html {
		height: 100%;
	}
	
	body {
		height: 100%;
		min-height: 100%;
		margin: 0;
		padding: 0;
		font-family: "Museo Sans W01";
		font-weight: 100;
	}
	
	body a {
		color: $brand-blue;
	}
	
	h1 {
		font-family: "Museo Sans 500";
	}
	
	.body .main h1 {
		margin-top: 0px;
		padding-top: 0px;
	}
	
	.overlay h1 {
		margin-top: 0px;
		padding-top: 0px;
	}
</style>

<style scoped>
	#admin {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	
	.header {
		background: #1a1a1a;
		color: #bebebe;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.header .leftContainer {
		height: 60px;
		display: flex;
	}
	
	.header .leftContainer .logoContainer {
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 0px 20px;
		height: 100%;
	}
	
	.header .leftContainer .switcherContainer {
		display: flex;
		align-items: center;
		padding: 0px 20px;
		height: 100%;
		cursor: pointer;
	}
	
	.header .leftContainer .switcherContainer:hover {
		background: black;
	}
	
	.header .leftContainer .switcherContainer i {
		color: white;
		padding-left: 5px;
	}
	
	.header .leftContainer img {
		display: block;
	}
	
	.header .leftContainer .logoContainer:hover {
		background: black;
	}
	
	.header .userContainer {
		padding-right: 20px;
	}
	
	.header .userContainer a {
		margin-left: 10px;
	}
	
	.body {
		display: flex;
		flex: 1;
	}
	
	.body .sidebar {
		width: 90px;
		background: #313131;
	}
	
	.body .sidebar ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.body .sidebar ul li {
		cursor: pointer;
		color: #999;
		text-decoration: none;
		display: block;
		text-align: center;
		width: 100%;
		padding: 20px 0px;
		border-bottom: 1px solid #999;
	}
	
	.body .sidebar ul li:hover {
		background: #1A1A1A;
	}
	
	.body .main {
		padding: 20px;
		flex: 1;
	}
	
	.overlay {
		position: fixed;
		left: 0px;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 100vw;
	}
	
	.overlay.open {
		left: 0px;
		display: block;
	}
	
	.overlay .mask {
		position: absolute;
		top: 0px;
		right: 0px;
		left: 0px;
		bottom: 0px;
		background: black;
		opacity: .6;
	}
	
	.overlay.open .mask {
		display: block;
	}
	
	.overlay .trays {
		height: 100%;
	}
	
	.overlay .tray {
		position: absolute;
		width: 90%;
		margin-left: 10%;
		height: 100%;
		background: white;
		padding: 20px;
		border-left: 1px solid black;
	}
	
	.overlay .trayHeader {
		margin-bottom: 1rem;
	}
	
	.overlay .trayHeader .back {
		cursor: pointer;
	}
	
	.tray-anim-enter, .tray-anim-leave-to {
		transform: translateX(100%);
	}
	
	.tray-anim-enter-to {
		transform: translateX(0);
	}
	
	.tray-anim-enter-active, .tray-anim-leave-active {
		transition: transform .1s;
	}
</style>