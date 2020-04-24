import { LazyImage } from './lazy-image.js';
import { html, define } from '../lib/hybrids.js';

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
`;

// const url = (seed) =>
//   `https://source.unsplash.com/100x100/?nature,water?random=${seed}`;
const url = (seed) => `https://picsum.photos/100/100?random=${seed}`;

const genRandomId = (range) => Math.ceil(Math.random(range) * range);
const sleep = (m) => new Promise((r) => setTimeout(r, m));

const genRandomLazyImage = (seed) =>
  html`
<lazy-image class="img"
    src="${url(seed)}"
    alt="lazily loaded image"
>
  <img class="preloader" slot="placeholder" src="assets/preloader.svg"></img>
</lazy-image>
`.define({ LazyImage });

export const LazyImageGallery = {
  range: 1000,
  render: ({ range }) => html`
    ${style} ${[...Array(30)].map((_, i) => genRandomLazyImage(i))}
  `,
};
