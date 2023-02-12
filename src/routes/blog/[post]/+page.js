import {json} from "d3"
export async function load({ params }){
  const post = await import(`../${params.post}.md`)

  const { title, date } = post.metadata
  const content = post.default
  return {
    content,
    title,
    date,
  }
  ////////////////////////////////////////////////////
  ////////////////server side fetching////////////////
  ////////////////////////////////////////////////////
  // const posts = await json(`/api/posts`)
  // return {
  //   posts
  // }  
}