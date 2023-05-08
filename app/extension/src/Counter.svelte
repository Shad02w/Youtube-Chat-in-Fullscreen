<script lang="ts">
    let count = 0
</script>

<button class="button" on:click={() => (count += 1)}>Add Count: {count}</button>

<style>
    .button {
        position: fixed;
        top: 0px;
        right: 0px;
        z-index: 3000;
        background: yellow;
        width: 100px;
        height: 35px;
    }
</style>
