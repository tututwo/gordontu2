<script>
  import "$lib/styles/prism-vsc-dark-plus.css"
  export let data
console.log(data)
</script>

<section class="w-full flex justify-center items-center">
  <article class="w-1/2">
    <h1>Blog</h1>
    <!-- like an instance geometry临时component? -->
    <svelte:component this={data.content} />
  </article>
</section>
