import './lazy-image.js';
import { html, define  } from '../lib/hybrids.js';


const style = html`
  <style>
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }

    .img {
      height: 100px;
      width: 100px;
      position: relative;
      margin: 5px;
    }
    .preloader {
      height: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  </style>
`

const unsplashUrl = (seed) => `https://source.unsplash.com/100x100/?nature,water?random=${seed}`;
// const picsumUrl = "https://picsum.photos/id/${id}/200/100";

const genRandomId = (range) => Math.ceil(Math.random(range) * range);
const sleep = m => new Promise(r => setTimeout(r, m))

const genRandomLazyImage = (seed) => html`
<lazy-image class="img"
    src="${unsplashUrl(seed)}"
    alt="lazily loaded image"
>
  <img class="preloader" slot="placeholder" src="assets/preloader.svg"></img>
</lazy-image>
`

export const LazyImageGallery = {
  range: 1000,
  render: ({ range }) => html`
    ${style}
    ${
      [...Array(30)].map((_, i) => genRandomLazyImage(i))
    }
  `,
}


define('lazy-image-gallery', LazyImageGallery);