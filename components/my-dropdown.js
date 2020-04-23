import { html, define } from '../lib/hybrids.js';

const style = html`
  <style>
    .input, .list {
      min-width: 300px;
    }
  </style>
`

const itemsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


const onInput = (host, { target }) => {
  host.query = target.value;
  // host.filteredList = host.itemsList.filter(x => x.includes(host.query));
  console.log(host.filteredList);
}


const filteredList = {
  get: ({ itemsList, query }) => itemsList.filter(x => x.toLowerCase().includes(query.toLowerCase())),
};


export const MyDropdown = {
  itemsList,
  filteredList,
  query: '',
  render: ({ filteredList, query }) => html`
    ${style}

    <input
      class="input"
      type="text"
      value="${query}"
      oninput="${onInput}" />

    <ul class="list">
      ${
        filteredList.map((val, idx) =>
          html`
            <li>
              <slot name="item">${val}</slot>
            </li>
          `
        )
      }
    </ul>
  `,
};

define('my-dropdown', MyDropdown);