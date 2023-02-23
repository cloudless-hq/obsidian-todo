<script>
  export let data

  // const selectionState = {
  //           eState: {
  //               cursor: {
  //                   from: { line: item.line, ch: item.position.start.col },
  //                   to: { line: item.line + item.lineCount - 1, ch: item.position.end.col },
  //               },
  //               line: item.line,
  //           },
  //       };

  //       // MacOS interprets the Command key as Meta.
  //       context.app.workspace.openLinkText(
  //           item.link.toFile().obsidianLink(),
  //           item.path,
  //           evt.ctrlKey || (evt.metaKey && Platform.isMacOS),
  //           selectionState as any
  //       );
</script>

<style>
  .todo {
    background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(248, 248, 248) 100%);
    font-size: 13px;
    border-style: solid;
  }
  .todo.done {
    background: transparent;
  }
  .float-right {
    float: right;
  }
</style>

<div on:click class:done={data.completed} class="todo m-1 py-2 px-3 border-1 rounded {data.completed ? 'border-gray-200 text-gray-300' : 'border-gray-300'}">
  <svg class="inline-block {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} w-[15px] mt-[-4px] mb-[-1px] mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>

  {#if data.completed}
    <svg style="display: block;" class="absolute stroke-gray-300 mt-[-23px] w-[15px] p-[2px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  {/if}

  {data.text}

  <div class="inline-block w-1"> </div>

  {#if data.note}
    <svg class="w-[15px] {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} inline-block mt-[-4px] mb-[-1px] ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
  {/if}

  {#if data.due || data.start}
    <svg class="w-[15px] {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} inline-block mt-[-4px] mb-[-1px] ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  {/if}

  {#if data.children.length}
    <svg class="w-[15px] {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} inline-block mt-[-4px] mb-[-1px] ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><polyline points="3 6 4 7 6 5"></polyline><polyline points="3 12 4 13 6 11"></polyline><polyline points="3 18 4 19 6 17"></polyline></svg>
  {/if}

  {#if data.tags}
    <div class= "ml-1 inline-block float-right">
      {#each data.tags as tag}
        <div style="border-style: solid;" class="rounded-xl inline-block border-1 px-2 py-0 mx-1 text-xs bg-light-500 border-gray-200">{tag}</div>
      {/each}
    </div>
  {/if}
</div>
