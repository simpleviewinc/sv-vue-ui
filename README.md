# sv-admin-ui
Vue component library for admin interfaces. Used in sv-auth and Barberstock re-write.

# Setup

## Necessary Dependencies

Your projects package.json file will need to install the following packages and allow them to be accessible by your webpack bundle system.

* vue
* jsvalidator

## Module List/Form loading

When list and form modules are loaded we check a specific folder for their existance. In order for this to work you will need to set a webpack alias for

* SV_VUE_UI_FORMMODULEPATH - The path to locate form modules.
* SV_VUE_UI_LISTMODULEPATH - The path to locate list modules.

Example

```
	resolve: {
		alias: {
			'@modules' : `${__dirname}/modules`,
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			SV_VUE_UI_FORMMODULEPATH : JSON.stringify("@modules"),
			SV_VUE_UI_LISTMODULEPATH : JSON.stringify("@modules")
		})
	]
```