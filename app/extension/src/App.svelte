<script lang="ts">
    let count = 0

    // console.log('123')
</script>

<div>
    <button class="button" on:click={() => (count += 1)}>Add Count: {count}</button>
</div>
<iframe
    title="youtube chat"
    allowtransparency={true}
    src="https://www.youtube.com/live_chat?is_popout=1&v=jfKfPfyJRdk&ycf=_self"
    width="400"
    height="600"
/>

<style>
    .button {
        width: 100px;
        height: 35px;
    }

    :global(#_ycf_root) {
        z-index: 3000;
        position: fixed;
        top: 0px;
        right: 0px;
    }
</style>
