<script>
  import SidebarLayout from '/_ayu/src/components/sidebar-layout/components/sidebar-layout.svelte'
  import Sidebar from '/Users/jan/Dev/cloudless/main/apps/lists/app/src/components/sidebar.svelte'
  import Todo from './todo.svelte'

  export let dataView
  export let reload

  const open = {}
  let entries
  let grouped
  let projects = []

  // TODO: debounce
  reload(() => {
    entries = dataView.pages().file.lists.filter(entry => !entry.parent)
    grouped = entries.groupBy(entry => entry.header.path).map(group =>  ({key: group.key, rows: group.rows.groupBy(row => row.header.subpath) }))

    // .groupBy(row => { console.log(row); return row. }) // ).map(group => group.rows.
    //
    console.log(grouped)
    // entries = parentEntries.reduce((entry, aggr) => {
    //   if (!entries[entry.header.path]) {
    //     entries[entry.header.path] = {}
    //   }
    //   if (!entries[entry.header.path][entry.header.subpath]) {
    //     entries[entry.header.path][entry.header.subpath] = {}
    //   }
    // }, {})
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
    padding: 0;
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
  h3 {
    margin-block-end: 0;
    margin-left: 0.25rem;
    margin-bottom: 11px;
    font-size: 18px;
    color: #363636;
  }
  h4 {
    margin-block-start: 15px;
    margin-block-end: 12px;
    font-size: 15px;
    color: #757575;
    margin-left: 0.25rem;
  }
</style>

<SidebarLayout top="0" height="100%" sideWidth="240px">
  <Sidebar slot="sidebar" active={activeView} {badges} {projects} on:select={sideBarSelect} />

  <div slot="main" class="main p-8">
    {#each grouped as fileRow}
      <h3>{@html fileRow.key.replace('.md', '').split('/').join(' <div class="text-gray-400 inline">/</div> ')}</h3>
      {#each fileRow.rows.find(row => row.key === undefined)?.rows || [] as entry, i}
        <Todo open={open[i]} data={parseDataViewItem(entry)} on:dblclick={() => { open[i] = true}} on:click={() => {console.log(entry)}}></Todo>

        {#if open[i] && entry.children}
          <div class="ml-6">
            {#each entry.children as child}
              <Todo data={parseDataViewItem(child)} on:click={() => {console.log(entry)}}></Todo>
            {/each}
          </div>
        {/if}
      {/each}


      {#each fileRow.rows as headerRow}
        {#if headerRow.key !== undefined}
          <h4>{headerRow.key}</h4>
          {#each headerRow.rows as entry, i}
            <Todo open={open[i]} data={parseDataViewItem(entry)} on:dblclick={() => { open[i] = true}} on:click={() => {console.log(entry)}}></Todo>

            {#if open[i] && entry.children}
              <div class="ml-6">
                {#each entry.children as child}
                  <Todo data={parseDataViewItem(child)} on:click={() => {console.log(entry)}}></Todo>
                {/each}
              </div>
            {/if}
          {/each}
        {/if}
      {/each}
    {/each}

    <div class="h-50vh"></div>
  </div>
</SidebarLayout>
