<script lang="ts">
    import ChatOverlay from './ChatOverlay.svelte'
    let count = 0
</script>

<button class="button" on:click={() => (count += 1)}>Add Count: {count}</button>
<p>hi</p>
<ChatOverlay />

<style>
    .button {
        position: fixed;
        top: 0px;
        right: 0px;
        z-index: 3000;
        width: 100px;
        height: 35px;
    }
</style>
