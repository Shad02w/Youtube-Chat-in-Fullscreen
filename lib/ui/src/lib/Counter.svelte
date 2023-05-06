<script lang="ts">
    let count = 0

    function addCount() {
        count += 1
    }
</script>

<button on:click={addCount}>Add Count: {count}</button>
