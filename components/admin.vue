<template>
	<div id="admin" v-if="valid" :class="{ 'overlay-open' : trayOpen }">
		<div class="header">
			<slot name="header"></slot>
		</div>
		<div class="body">
			<div class="sidebar">
				<ul v-if="nav">
					<li v-for="item in nav" :key="item.name" @click="go(item.routerArgs)">
						<i v-if="item.icon" class="fas" :class="{ [item.icon] : true }"></i>
						<div>{{item.label}}</div>
					</li>
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
								{ name : "icon", type : "string" },
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
						{ name : "push", type : "boolean" },
						{ name : "args", type : "object", default : {} }
					],
					allowExtraKeys : false,
					throwOnInvalid : true
				});
				
				const route = this.routeMap[args.url];
				
				if (args.type === "main") {
					this.mainComponent = undefined;
					this.$nextTick(function() {
						if (args.push) {
							window.history.pushState({}, "", args.url);
						}
						
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
	@import "../css/theme.scss";
	
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
		font-family: $font-light;
		font-weight: 100;
		color: $brand-almost-black;
	}
	
	body a {
		color: $brand-blue;
	}
	
	h1 {
		font-family: $font-medium;
	}
	
	h2 {
		font-family: $font-medium;
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
	@import "../css/theme.scss";
	
	#admin {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	#admin.overlay-open {
		overflow: hidden;
		position: fixed;
	}
	
	.header {
		background: $brand-almost-black;
		color: $brand-light-gray;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;
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
		background: $brand-black;
	}
	
	.header .leftContainer .switcherContainer i {
		color: white;
		padding-left: 5px;
	}
	
	.header .leftContainer img {
		display: block;
	}
	
	.header .leftContainer .logoContainer:hover {
		background: $brand-black;
	}
	
	.header .userContainer {
		padding-right: 20px;
	}
	
	.header .userContainer a {
		margin-left: 10px;
	}
	
	.body {
		display: flex;
		flex: 1 1 auto;
	}
	
	.body .sidebar {
		width: 90px;
		background: $brand-shadow;
		flex-shrink: 0;
	}
	
	.body .sidebar ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.body .sidebar ul li {
		cursor: pointer;
		color: $brand-light-gray;
		text-decoration: none;
		display: block;
		text-align: center;
		width: 100%;
		padding: 20px 0px;
		border-bottom: 1px solid $brand-medium-gray;
		text-transform: uppercase;
		font-size: 14px;
	}
	
	.body .sidebar ul li i {
		font-size: 20px;
		padding-bottom: 5px;
	}
	
	.body .sidebar ul li:hover {
		background: $brand-almost-black;
	}
	
	.body .main {
		position: relative;
		padding: 20px;
		flex: 1 1 auto;
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
		overflow: auto;
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