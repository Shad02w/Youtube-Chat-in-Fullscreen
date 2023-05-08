<script lang="ts">
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    async function getData(): Promise<any> {
        await delay(1000)
        let res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        return res.json()
    }
</script>

{#await getData()}
    <div>Loading...</div>
{:then data}
    <div>{JSON.stringify(data, null, 4)}</div>
{:catch error}
    <div>{error.message}</div>
{/await}
