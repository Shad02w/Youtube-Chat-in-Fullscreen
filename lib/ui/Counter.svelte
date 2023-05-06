<script lang="ts">
    export let name: string | number
    export let count = 0
    function increment() {
        count += 1
    }

    export function reset() {
        count = 0
    }
</script>

<p>Username: {name}</p>
<button type="button" on:click={increment}>Add Count: {count}</button>
