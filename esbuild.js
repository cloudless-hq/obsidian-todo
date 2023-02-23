import { context as esbContext } from 'https://deno.land/x/esbuild@v0.17.8/mod.js'
import { sveltePlugin } from '/Users/jan/Dev/cloudless/atreyu/cli/esbuild-plugin-svelte-tailwind.ts'
import { parseMetafile, ayuPlugin } from '/Users/jan/Dev/cloudless/atreyu/cli/esbuild-plugin-ayu.ts'

const prod = false

const context = await esbContext({
	banner: {
		js: `// THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
         // if you want to view the source, please visit the github repository of this plugin`,
	},
	entryPoints: [ 'src/main.ts' ],
	bundle: true,
  plugins:[
    ayuPlugin({
      atreyuPath: '/Users/jan/Dev/cloudless/atreyu'
    }),

    sveltePlugin({
      // dev,
      // clean,
      inFolder: 'src',
      globalCssTarget: './styles.css'
      // addGlobalBuildRes: cb => {
      //   globalBuildRes = cb()
      // }
    }),
  ],
	external: [
		'obsidian',
		'electron',
		'@codemirror/autocomplete',
		'@codemirror/collab',
		'@codemirror/commands',
		'@codemirror/language',
		'@codemirror/lint',
		'@codemirror/search',
		'@codemirror/state',
		'@codemirror/view',
		'@lezer/common',
		'@lezer/highlight',
		'@lezer/lr'
		// ...import builtin-modules
  ],
	format: 'cjs',
	target: 'es2018',
	logLevel: 'info',
	sourcemap: prod ? false : 'inline',
	treeShaking: true,
	outfile: 'main.js',
})

if (prod) {
	await context.rebuild()
	Deno.exit(0)
} else {
	await context.watch()
}