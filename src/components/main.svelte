<script>
  import SidebarLayout from '/_ayu/src/components/sidebar-layout/components/sidebar-layout.svelte'
  import Sidebar from '/Users/jan/Dev/cloudless/main/apps/lists/app/src/components/sidebar.svelte'
  import Todo from './todo.svelte'

  export let dataView
  export let reload

  let parentEntries = []
  let projects = []

  // TODO: debounce
  reload(() => {
    parentEntries = dataView.pages().file.lists.filter(entry => !entry.parent)
    projects = dataView.pages().where(entry => entry.type === 'project').values.map(project => ({title: project.file.name}))
  })

  function parseDataViewItem (todo) {
    let cleanText = todo.text.replace(/\[[^\]]*\] */g, '').replace('  ', ' ').trim()

    todo.tags.forEach(tag => {
      cleanText = cleanText.replaceAll(tag, '')
    })

    const text = cleanText.split('\n')[0]

    return {
      id: todo.path + '#' + text,
      text,
      completed: todo.completed,
      note: cleanText.split('\n')[1],
      due: todo.due,
      start: todo.start,
      children: todo.children,
      tags: todo.tags.map(tag => tag.replace('#', ''))
    }
  }

  const badges = {
    next: {
      alert: 3,
      normal: 4
    },
    current: {
      normal: 1
    },
    inbox: {
      normal: 2
    }
  }

  let activeView = 'current'
  function sideBarSelect (e) {
    activeView = e.detail.selected
  }
</script>

<style>
  :global(.workspace-leaf-content[data-type='todo-view'] .view-content) {
    background-color: #f9f9f9;
    padding-left: 0;
    padding-top: 0;
  }
  :global(.workspace-leaf-content[data-type='todo-view'] .view-header) {
    border-bottom: 1px solid #f1f1f1;
  }

  /* Constants */
  :global(:root) {
    /* --font-default: "Roboto", -apple-system, "BlinkMacSystemFont", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; */
    --text-default: rgb(0,0,0);
    --background-main: rgb(192, 195, 204);
    --background-side: rgb(218, 215, 214);
    --tags: rgb(202, 224, 250);
    --highlight: rgb(155, 144, 146);
    --badges-default: rgb(146, 146, 146);
    --badges-alert: rgb(252, 68, 120);
    --text-section-head: rgb(149, 142, 144);

    --fa-primary-color: rgb(130, 130, 130);
    --fa-secondary-color: rgb(150, 150, 150);
    --fa-secondary-opacity: 1;
  }
  :global(.ayu_components_sidebar) {
    font-size: 14px;
  }
</style>

<SidebarLayout top="0" height="100%" sideWidth="240px">
  <Sidebar slot="sidebar" active={activeView} {badges} {projects} on:select={sideBarSelect} />

  <div slot="main" class="main p-8">
    {#each parentEntries as entry}
      <Todo data={parseDataViewItem(entry)} on:click={() => {console.log(entry)}}></Todo>

      <!-- {#if entry.children}
        <div class="ml-6">
          {#each entry.children as child}
            <Todo data={parseDataViewItem(child)}></Todo>
          {/each}
        </div>
      {/if} -->
    {/each}
  </div>
</SidebarLayout>
