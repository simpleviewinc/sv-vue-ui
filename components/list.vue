<template>
	<div class="admin-list" v-if="valid">
		<div class="header">
			<div class="headerLeft">
				<i v-if="showBack" class="back fas fa-arrow-left" @click="cancel"></i>
				<h1>{{title}}</h1>
			</div>
			<div class="buttons" v-if="buttons">
				<admin-button
					v-for="button in buttons"
					:key="button.name"
					:type="button.type"
					:theme="button.theme"
					@click="button.click"
				>{{button.label}}</admin-button>
			</div>
		</div>
		<table>
			<thead>
				<tr>
					<th class="actions" v-if="actions.length">
						Actions
					</th>
					<th v-for="item in columns">{{item.label}}</th>
				</tr>
			</thead>
			<tbody v-if="data">
				<tr v-for="(row, i) in data">
					<td class="actions" v-if="actions.length">
						<admin-button
							v-for="action in actions"
							:key="action.name"
							:type="action.type"
							:icon-class="action['icon-class']"
							:theme="action.theme"
							@click="action.click({ row })"
						>{{action.label}}</admin-button>
					</td>
					<td v-for="column in columns">{{row[column.name]}}</td>
				</tr>
			</tbody>
		</table>
		<div v-if="data === undefined">
			<p>Loading... <i class="fas fa-spinner fa-spin"></i></p>
		</div>
		<div v-if="data && data.length === 0">
			<p>There are no items that match the current filter.</p>
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
					{ name : "showBack", type : "boolean" },
					{
						name : "actions",
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "name", type : "string", required : true },
								{ name : "label", type : "string" },
								{ name : "type", type : "string", required : true },
								{ name : "icon-class", type : "string" },
								{ name : "theme", type : "string" },
								{ name : "click", type : "function", required : true }
							],
							allowExtraKeys : false
						}
					},
					{
						name : "buttons",
						type : "array",
						schema : {
							type : "object",
							schema : [
								{ name : "name", type : "string", required : true },
								{ name : "label", type : "string", required : true },
								{ name : "type", type : "string", required : true },
								{ name : "theme", type : "string" },
								{ name : "click", type : "function", required : true }
							],
							allowExtraKeys : false
						}
					},
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
			cancel : function() {
				this.$emit("cancel");
			}
		},
		components : {
			adminButton
		}
	}
</script>

<style scoped>
	@import "../css/theme.scss";
	
	.admin-list .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	
	.admin-list .headerLeft {
		display: flex;
		align-items: center;
	}
	
	.admin-list .headerLeft .back {
		padding-right: 10px;
		cursor: pointer;
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
		font-family: $font-heavy;
		font-size: 14px;
		border-bottom: 1px solid $brand-light-gray;
	}
	
	.admin-list table th {
		text-align: left;
		padding: 10px 10px 10px 10px;
		color: black;
		font-weight: normal;
	}
	
	.admin-list table tbody {
		border-top: 0px;
	}
	
	.admin-list table tbody tr {
		background: $brand-zebra;
	}
	
	.admin-list table tbody tr:nth-of-type(even) {
		background: white;
	}
	
	.admin-list table tbody td {
		padding: 10px;
	}
	
	.admin-list table thead th.actions {
		width: 150px;
	}
	
	.admin-list table tbody td.actions {
		white-space: nowrap;
	}
</style>