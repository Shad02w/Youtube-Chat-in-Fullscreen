<script lang="ts">
    // async function getData(): Promise<any> {
    //     let res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    //     return res.json()
    // }

    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async function getData(): Promise<any> {
        await delay(1000)
        return { title: 'Hello World' }
    }
</script>

{#await getData()}
    <div>Loading...</div>
{:then data}
    <div>{data.title}</div>
{:catch error}
    <div>{error.message}</div>
{/await}
