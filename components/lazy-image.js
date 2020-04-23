// Taken from https://dev.to/bennypowers/lets-build-web-components-part-7-hybrids-187l with modifications
import { html, define, dispatch } from '../lib/hybrids.js';

const style = html`
  <style>
    :host {
      display: block;
      position: relative;
    }

    #image,
    #placeholder ::slotted(*) {
      position: absolute;
      top: 0;
      left: 0;
    }

    #placeholder ::slotted(*),
    #image.loaded {
      opacity: 1;
    }

    #image,
    #placeholder.loaded ::slotted(*) {
      opacity: 0;
    }
  </style>
`;

const constant = (x) => () => x;
const isIntersecting = ({ isIntersecting }) => isIntersecting;
const intersect = (options) => {
  if (!('IntersectionObserver' in window)) return constant(true);
  return {
    connect: (host, propName) => {
      const observerCallback = (entries) =>
        (host[propName] = entries.some(isIntersecting));
      const observer = new IntersectionObserver(observerCallback, options);
      const disconnect = () => observer.disconnect();
      observer.observe(host);
      return disconnect;
    },
  };
};

const bubbles = true;
const composed = true;
const detail = { value: true };
const onLoad = (host) => {
  host.loaded = true;
  dispatch(host, 'loaded-changed', { bubbles, composed, detail });
};

const render = ({ alt, src, intersecting, loaded }) => html`
  ${style}
  <div
    id="placeholder"
    class="${{ loaded }}"
    aria-hidden="${String(!!intersecting)}"
  >
    <slot name="placeholder"></slot>
  </div>

  <img
    id="image"
    class="${{ loaded }}"
    aria-hidden="${String(!intersecting)}"
    src="${intersecting ? src : undefined}"
    alt="${alt}"
    onload="${onLoad}"
  />
`;

export const LazyImage = {
  src: '',
  alt: '',
  loaded: false,
  intersecting: intersect({ rootMargin: '10px' }),
  render,
};
