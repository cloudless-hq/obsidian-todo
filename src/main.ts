import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf } from 'obsidian'
import Main from './components/main.svelte'

interface TodoPluginSettings {
	mySetting: string
}

const DEFAULT_SETTINGS: TodoPluginSettings = {
	mySetting: 'default'
}

export const TODO_VIEW_TYPE = 'todo-view'

export class TodoView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType() {
    return TODO_VIEW_TYPE
  }

  getDisplayText () {
    return 'Todos'
  }

  onOpen () {
    const container = this.containerEl.children[1]

    container.empty()

    this.component = new Main({
      target: container,
      props: {
        dataView: this.app.plugins?.plugins?.dataview?.api,
        reload: cb => {
          cb() // initial load
          this.registerEvent(this.app.metadataCache.on('dataview:metadata-change', cb)) // update after changes
        }
      }
    })

    // console.log('waiting raady', this.ready, this.app.metadataCache.initialized)
    // this.registerEvent(this.app.metadataCache.on('dataview:index-ready', arg => {
    //   console.log('raady', this.app.metadataCache.initialized)
    //   this.ready = true
    //   this.component.$set({ ready: true })
    // }))
  }

  onClose () {
    this.component.$destroy()
  }
}


export default class TodoPlugin extends Plugin {
	settings: TodoPluginSettings

  async activateView() {
    this.app.workspace.detachLeavesOfType(TODO_VIEW_TYPE)

    const leaf = this.app.workspace.getLeaf() // false

    await leaf.setViewState({
      type: TODO_VIEW_TYPE,
      active: true
    })

    this.app.workspace.revealLeaf(leaf)
      // this.app.workspace.getLeavesOfType(TODO_VIEW_TYPE)[0])
  }

	async onload () {
		await this.loadSettings()

    this.registerView(TODO_VIEW_TYPE, leaf => new TodoView(leaf))

		const ribbonIconEl = this.addRibbonIcon('list-checks', 'TodoView', (e: MouseEvent) => {
			// new Notice('This is a notice!')
      this.activateView()
		})

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class')

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem()
		statusBarItemEl.setText('Status Bar Text')

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open()
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView)
		// 		if (markdownView) {
		// 			// If checking is true, we're simply 'checking' if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open()
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TodoSettingTab(this.app, this))

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000))

    // setTimeout(() => {
    //   this.activateView()
    // }, 1000)
	}

	onunload () {
    this.app.workspace.detachLeavesOfType(TODO_VIEW_TYPE)
	}

	async loadSettings () {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings () {
		await this.saveData(this.settings)
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app)
// 	}
// 	onOpen () {
// 		const {contentEl} = this
// 		contentEl.setText('Woah!')
// 	}
// 	onClose () {
// 		const {contentEl} = this
// 		contentEl.empty()
// 	}
// }

class TodoSettingTab extends PluginSettingTab {
	plugin: TodoPlugin

	constructor(app: App, plugin: TodoPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display (): void {
		const { containerEl } = this

		containerEl.empty()

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'})

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value)
					this.plugin.settings.mySetting = value
					await this.plugin.saveSettings()
				}))
	}
}
