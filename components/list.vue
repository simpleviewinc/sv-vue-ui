<template>
	<div class="admin-list">
		<div class="header">
			<h1>{{title}}</h1>
			<div class="buttons">
				<admin-button
					v-if="buttons.create"
					type="button"
					actionType="primary"
					@click="create"
				>Create New</admin-button>
			</div>
		</div>
		<table>
			<thead>
				<tr>
					<th>
						Actions
					</th>
					<th v-for="item in columns">{{item.label}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, i) in data">
					<td>
						<admin-button
							v-if="actions.select"
							type="button"
							action-type="primary"
							@click="select(row)"
						>Select</admin-button>
						<admin-button
							v-if="actions.edit"
							type="icon"
							icon-class="fa-pencil-alt"
							@click="edit(row)"
						></admin-button>
						<admin-button
							v-if="actions.remove"
							type="icon"
							icon-class="fa-trash-alt"
							@click="remove(row)"
						></admin-button>
					</td>
					<td v-for="column in columns">{{row[column.name]}}</td>
				</tr>
			</tbody>
		</table>
		<admin-dialog
			v-if="rowToRemove"
			title="Delete?"
			text="This will will permanently delete this item."
		>
			<div slot="buttons">
				<admin-button type="button" @click="dialogRemoveCancel">Cancel</admin-button>
				<admin-button type="button" action-type="destructive" @click="dialogRemoveRemove">Remove</admin-button>
			</div>
		</admin-dialog>
	</div>
</template>

<script>
	import adminButton from "./button.vue";
	import adminDialog from "./dialog.vue";
	import adminRouter from "@public/js/admin-router.js";
	import adminState from "@public/js/admin-state.js";
	import { allowedKeys } from "@public/js/utils.js";
	
	export default {
		props : {
			columns : Array,
			title : String,
			api : Object,
			methods : {
				type : Object,
				default : function() { return {}; },
				validator : allowedKeys(["getData", "select", "remove"])
			},
			createUrl : String,
			idColumn : {
				type : String,
				required : true
			},
			actions : {
				type : Object,
				default : function() { return {}; },
				validator : allowedKeys(["select", "edit", "remove"])
			},
			buttons : {
				type : Object,
				default : function() { return {}; },
				validator : allowedKeys(["create"])
			},
			routerArgs : Object,
			defaultFilter : Object
		},
		data : function() {
			if (this.actions.edit === true && this.createUrl === undefined) {
				throw new Error("Action edit requires 'createUrl'");
			}
			
			if (this.actions.select === true && this.methods.select === undefined) {
				throw new Error("Action select requires 'methods.select'");
			}
			
			return {
				data : [],
				selectedRow : undefined,
				rowToRemove : false
			}
		},
		computed : {
			queryColumns : function() {
				return [...this.columns.map(val => val.name), this.idColumn].join(" ");
			}
		},
		created : async function() {
			const data = await this.api.find({ filter : this.defaultFilter, fields : `docs { ${this.queryColumns} }` });
			this.data = data.docs;
		},
		methods : {
			dialogRemoveCancel : function() {
				this.rowToRemove = undefined;
			},
			dialogRemoveRemove : async function() {
				await this.api.remove({ filter : { [this.idColumn] : this.rowToRemove[this.idColumn] } });
				this.rowToRemove = undefined;
				adminRouter.go(this.routerArgs);
			},
			create : function() {
				adminRouter.go({
					url : this.createUrl,
					type : "overlay",
					args : {
						save : () => {
							adminRouter.back();
							adminRouter.go(this.routerArgs);
						}
					}
				});
			},
			select : async function(row) {
				await this.methods.select(row);
			},
			edit : function(row) {
				adminRouter.go({
					url : this.createUrl,
					type : 'overlay',
					args : {
						filter : {
							[this.idColumn] : row[this.idColumn]
						},
						save : () => {
							adminRouter.back();
							adminRouter.go(this.routerArgs);
						}
					}
				});
			},
			remove : function(row) {
				this.rowToRemove = row;
			}
		},
		components : {
			adminDialog,
			adminButton
		}
	}
</script>

<style lang="scss" scoped>
	@import "@public/css/theme.scss";
	
	.admin-list .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	
	.admin-list h1 {
		margin-bottom: 0px;
	}
	
	.admin-list table {
		width: 100%;
		border: 0;
		margin: 0;
		border-collapse: collapse;
		border-spacing: 0;
	}
	
	.admin-list thead tr {
		background: #5b5852;
	}
	
	.admin-list table th {
		text-align: left;
		padding: 10px;
		color: white;
		border-right: 1px solid #7a7772;
	}
	
	.admin-list table tbody {
		border: 1px solid #ccc;
		border-top: 0px;
	}
	
	.admin-list table tbody tr {
		background: #f3f0ea;
	}
	
	.admin-list table tbody tr:nth-of-type(even) {
		background: #fefdfc;
	}
	
	.admin-list table tbody td {
		padding: 10px;
	}
</style>