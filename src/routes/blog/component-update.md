---
title: Post OnTwoe
date: "2022-12-14"
---

# Component Initialization and Updates

I often see 

>> this must be called during component initialisation

in Svelte's docs, but what exactly is **Component Initialization**???

After inquiring some smart people on the Internet, I would like to jog down some notes about what's included in **Component Initialization** in case of forgetting it again, like I always do.

## The Early Stage: run `<script>` once

TL DR:

<p class="text-3xl font-bold">Component initialization includes everything you write in .svelte, but callbacks.</p>

It includes those imports:

```svelte
<script>
	import abc from "./abc.js"
  
  import { onMount } from "svelte"
</script>
```

Sync tasks:

```html
<script>
	let x = 1, y = 2
  
  function thisGetsCalled(){}
  thisGetsCalled()
  
  function thisNotCalled(){}
  // because I didn't invoke it: thisNotCalled()
</script>
```

Microtasks that are schedule to run.

```html
<script>
	function thisGetsCalled(){
    thisAlsoCalled() {}
    thisAlsoCalled()
  }
  thisGetsCalled()
</script>
```

Macrotasks like `setTimeOut` runs during **Component Initialization** but not the callbacks inside it. Remember? *Callbacks* are not run during **Component Initialization**, and whatever inside `setTimeOut` is considered as *callback*.

Lihau has this wonderful [thread](https://twitter.com/lihautan/status/1396111979799093254) about Component Initialization, and he introduced this trick: 

> *In `<script>`, put everything inside ONE function. Whatever runs at the first time also runs during **Component Initialization**.*

## A Bit Later: Mounting

Basically when `<scirpt>` is run. Elements defined in *.svelte*, which is just the markup you wrote, is added to the DOM. This step is called **component mouting**. You can access the DOM elements from now on.

## The End: Stuff inside onMount()

If you defined `onMount` earlier, you should know `onMount` runs during **Component Initialization**, but not its callback. But guess what? This is the time!

Once components are *mounted*. Stuff inside `onMount` looks around see what's available, then **RUN**. In this [stackoverflow](https://stackoverflow.com/questions/61577631/sveltejs-components-with-or-without-onmount) answer, it points out the difference between using `onMount` and `setTimeOut` is about what's available when *callbacks* of each finally runs. I higly recommend you to take a look at the answer.

###### A bit more about lifecycle functions: `onMount()`

* Lifecycle functions like `onMount` to me are more like a **timer**. It marks some point on the timeline of Svelte's working progress, here we called it **Component Initialization** progress.

  For example, `onMount` marks the moment right after the component is *mounted*. It is a **relative time point**: if I got a lot of elements to add and large datasets to load, then statements inside `onMount` would not for run a while because It needs to wait for everything else getting loaded/*mounted*.

* `setTimeOut(()=>{}, 1000)` then marks an **absolute point on the timeline**: 1 second. Regardless of loading data or mouting component, its callback just got push to the task queue to run after 1 second.



# Svelte's Updating Pattern

While making data visualization using Svelte, I often want to add animation or transition in Svelte. Sometimes I don't get to see any animation playing. What kind mistake is that? It's all due to Svelte's special updating pattern.

For example, if I want to change/update DOM elements via clicking a button, **pay attention to the console**:

<iframe src="https://svelte.dev/repl/7145bafa507a4bec8d8a9adb4a3cd9b5?version=3.44.2" class="w-[70vw] l-[-20vw]" height='600' title="Svelte temperature each demo"></iframe>

`foo` and `bar` are changed to 2 and 5 respectively based on what you see in the *console*. However, when I try to log the DOM element's content, I still see the old `1+2=3`. WHY???

Ruben Leija made an [awesome graph](https://linguinecode.com/post/3-methods-to-run-code-after-dom-update-in-svelte).

![img](/Users/gordontu/Documents/Learning/Data Viz Designer 养成/Svelte Blog/Component Init/svelte-lifecycle-flow.png)

If I may brief it:

When you change those variables in `<script>`, they ARE changed in `<script>`. No problem here.

Once Svelte is about to compile the code to `.js` to update the DOM, this very action is **batched!** 

Svelte is kind of saying: *Hey, you sync task go first, I will keep collecting those pending changes to be made in the DOM*. Once those tasks are done, aka before the next micro task, Svelte then allow DOM to be updated.

In our case:

1. You click the button, and`handleUpdate` changes `foo` and `bar`, 
2. then `console.log(foo, bar)` shows you the changed `foo` and `bar`
3. At this moment, while `foo` and `bar` are supposed to notify DOM about the updated data. Svelte artifically *batches* this very change to be made in DOM so that DOM elments don't get updated yet.
4. Then `console.log(divEl.textContent)`. Since `foo` and `bar` changed as variable in `<script>` but not in DOM yet. Of course, you are going to see the old `1 + 2 = 3`

###### A bit about `beforeUpdate()`

Watch out: lifecycle function alert:`beforeUpdate()`. Like `onMount` and other lifecycle functions, it marks a point on Svelte's working progress timeline. This point happens to be right **before DOM gets updated**. You can say it is after the 3rd step and before the 4th step above. Statements inside `beforeUpdate()` will run right before those pending state changes are about to be exectioned.

My take home message here is

> Code to change DOM elements + Code to be run once DOM is changed. The later code section probably won't run successfully since Svelte haven't changed the DOM yet even though code to change DOM elements is run.

**BUT**!

`tick()` can give you some help:

```html
<script>
	changeTheDOM ()
  await tick()
  doThisOnceDOMChanged()
</script>
```

`tick()` basically cashed in those *pending state changes*: Don't wait. Just do it now!



