import { html, define } from '../lib/hybrids.js';

export function increaseCount(host) {
  host.count += 2;
}

export const SimpleCounter = {
  count: 0,
  render: ({ count }) => html`
    <button onclick="${increaseCount}">
      Count: ${count}
    </button>
  `,
};

define('simple-counter', SimpleCounter);