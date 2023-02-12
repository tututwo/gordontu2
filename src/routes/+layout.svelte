<script>
  import "../app.css";

  import "$lib/styles/blog.css"
  import Header from "$lib/components/Header.svelte"
</script>

<Header />
<main class="w-full">
  <slot />
</main>