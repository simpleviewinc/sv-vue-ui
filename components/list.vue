<template>
	<div class="admin-list">
		<div class="header">
			<h1>{{title}}</h1>
			<div class="buttons" v-if="buttons">
				<admin-button
					v-if="buttons.includes('create')"
					type="button"
					theme="primary"
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
							v-if="actions.includes('select')"
							type="button"
							theme="primary"
							@click="select(row)"
						>Select</admin-button>
						<admin-button
							v-if="actions.includes('edit')"
							type="icon"
							icon-class="fa-pencil-alt"
							@click="edit(row)"
						></admin-button>
						<admin-button
							v-if="actions.includes('remove')"
							type="icon"
							icon-class="fa-trash-alt"
							@click="remove(row)"
						></admin-button>
					</td>
					<td v-for="column in columns">{{row[column.name]}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import adminButton from "./button.vue";
	import { advancedPropsMixin } from "../lib/utils.js";
	
	export default {
		mixins : [
			advancedPropsMixin({
				schema : [
					{
						name : "columns",
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "name", type : "string", required : true },
								{ name : "label", type : "string", required : true }
							],
							allowExtraKeys : false
						}
					},
					{ name : "title", type : "string" },
					{ name : "actions", type : "array", schema : { type : "string", enum : ["select", "edit", "remove"] } },
					{ name : "buttons", type : "array", schema : { type : "string", enum : ["create"] } },
					{ name : "data", type : "array" }
				],
				prop : "valid"
			})
		],
		data : function() {
			return {}
		},
		created : async function() {
			this.$emit("filter", {});
		},
		methods : {
			create : function() {
				this.$emit("create");
			},
			select : async function(row) {
				this.$emit("select", { row });
			},
			edit : function(row) {
				this.$emit("edit", { row });
			},
			remove : function(row) {
				this.$emit("remove", { row });
			}
		},
		components : {
			adminButton
		}
	}
</script>

<style lang="scss" scoped>
	@import "../css/theme.scss";
	
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