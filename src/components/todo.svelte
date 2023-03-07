<script>
  export let data
  export let open = false
  // TODO: bump feature (counter and last date)
  // TODO: progress for projects and today
  // TODO: smart link and show same todo titles
  // TODO: convert parent task to label, area, project
  // todo: list vs file vs tag (see superlist)
  // TODO: hide completed from current view (keep new completed until klick again)
  // TODO: exclamationmark important tag
  // TODO: convert headline to tag
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
    height: 35px;
    white-space: nowrap;
    max-width: 900px;
  }
  .todo.done {
    background: transparent;
  }
  .float-right {
    float: right;
  }


  .notes {
    background: rgb(247, 245, 235 );
  }
  .notes .input-field {
    margin-top: -2px;
  }
  input.input-field::placeholder {
    color: rgb(173, 173, 185)!important;
  }
  textarea::placeholder {
    color: rgb(173, 173, 185)!important;
  }

  .fal {
    color: rgb(198, 198, 198);
    font-size: 13px;
  }

  .task-box {
    background-color: white;
    background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(248, 248, 248) 100%);
    border-radius: 5px;
    border: 1px solid rgb(209, 210, 213);
    border-bottom-color: rgb(201, 201,205);
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
    margin-left: auto;
    max-width: 850px;
    margin-right: auto;
    user-select: none;
  }
  .task-box > div {
    padding: 9px 10px 9px 11px;
    border-bottom: 1px solid rgba(200, 200, 200, .2);
    display:flex;
  }

  .task-box > div.last {
    border-bottom: none;
  }

  /* .task-box.done {
    color: #c6c6c6;
    border-color: #ececec;
    opacity: 0.8;
  } */

  .task-box.editing {
    box-shadow: 0px 1px 4px 0px #e8e8e8;
    /* margin-top: 15px;
    margin-bottom: 15px; */
  }

  .tagslist {
    list-style: none;
    margin: 0;
    margin-right: 10px;
    display:inline-block;
  }

  .tag {
    display: inline-block;
    background-color: var(--tags);
    border: 1px solid rgb(126 155 189);
    border-radius: 10px;
    padding: 2px 10px;
    margin: 0 2px;
    cursor: pointer;
  }

  .tag::after {
    content: "x";
    margin-right: 2px;
    margin-left: 5px;
    opacity: .2;
  }
  .tag:hover::after {
    opacity: .5;
  }

  .input-field {
    border:none;
    background: transparent;
    font-size: 13px;
    color: var(--text-default);
    flex-grow: 1;
    box-shadow: none;
    padding: 0;
  }
  input.input-field {
    height: 18px;
  }

  .date {
    font-size: 13px;
    color: var(--text-default);
    border: none;
    font-family: var(--font-default);
    background: transparent;
  }
  .date::webkit-calendar-picker-indicator {
    display:none;
  }
  input[type=date]::-webkit-inner-spin-button,
  input[type=date]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .icon {
    margin-right: 15px;
    display: inline-block;
    text-align: center;
    font-size: 13px;
  }
  textarea:focus {
    outline: none;
    border-color: none;
    box-shadow: none;
  }
  .text-edit {
    text-overflow: ellipsis;
    max-width: calc(100% - 40px);
    overflow: hidden;
  }
</style>

{#if !open}
  <div on:click on:dblclick on:keydown class:done={data.completed} class="todo m-1 py-2 px-3 overflow-hidden border-1 rounded {data.completed ? 'border-gray-200 text-gray-300' : 'border-gray-300'}">
    <div style="line-height: 11px;" class="inline-block relative mt-[-4px]" on:keydown on:click|stopPropagation={() => {data.completed = !data.completed}}>
      <svg class="inline-block {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} w-[15px] h-[15px] mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>

      {#if data.completed}
        <svg style="display: block;" class="absolute stroke-gray-300 mt-[-15px] h-[15px] w-[15px] p-[2px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      {/if}
    </div>

    <div contenteditable spellcheck="false" class="text-edit inline-block">{data.text}</div>

    <div class="inline-block w-1"></div>

    {#if data.note}
      <svg class="w-[15px] {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} inline-block h-[15px] ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
    {/if}

    {#if data.due || data.start}
      <svg class="w-[15px] {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} inline-block h-[15px] ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    {/if}

    {#if data.children.length}
      <svg class="w-[15px] {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} inline-block h-[15px] ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><polyline points="3 6 4 7 6 5"></polyline><polyline points="3 12 4 13 6 11"></polyline><polyline points="3 18 4 19 6 17"></polyline></svg>
    {/if}

    {#if data.tags}
      <div class= "ml-1 inline-block float-right">
        {#each data.tags as tag}
          <div style="border-style: solid;" class="rounded-xl inline-block border-1 px-2 py-0 mx-1 text-xs bg-light-500 border-gray-200">{tag}</div>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="task-box editing">
    <div class="title">
      <div class="icon ayu_pages__app">
        <div class="inline-block relative mt-[-4px]">
          <svg class="inline-block {data.completed ? 'stroke-gray-300' : 'stroke-gray-400'} w-[15px] h-[15px] mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>

          {#if data.completed}
            <svg style="display: block;" class="absolute stroke-gray-300 mt-[-15px] h-[15px] w-[15px] p-[2px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {/if}
        </div>
      </div>
      <input type="text" placeholder="New Task" class="input-field" value={data.text}>
    </div>

    <div class="tags">
      <div class="icon ayu_pages__app"><span class="fal fa-tags"></span></div>
        <ul class="tagslist">
            {#each data.tags as tag}
              <li class="tag">{tag}</li>
            {/each}
          </ul>
        <input type="text" class="input-field" placeholder="Tags">
    </div>

    <div class="notes">
      <div class="icon ayu_pages__app"><span class="fal fa-file-alt ayu_pages__app"></span></div>
      <textarea name="notes" placeholder="Notes" class="input-field" rows="3" value={data.note || ''}></textarea>
    </div>
    <div class="duedate > last ayu_pages__app">
      <div class="icon ayu_pages__app"><span class="fal fa-clock ayu_pages__app"></span></div>
      <input type="date" placeholder="Due Date" class="date">
    </div>
  </div>
{/if}
