import { html, define } from '../lib/hybrids.js';

const lightgrey = '#aaa';
const style = html`
  <style>
    .input {
      width: 100%;
      min-width: 300px;
      box-sizing: border-box;
    }

    .list {
      width: 100%;
      min-width: 300px;
      padding: 10px;
      box-sizing: border-box;
      border: solid 1px ${lightgrey};
      border-radius: 8px;
      margin: 5px 0 0;
    }

    .list-item {
      list-style-type: none;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .list-item:hover,
    .list-item-selected {
      color: #fff;
      background-color: #7f3ea4;
    }
  </style>
`;

// Props
const itemsList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Computed
const filteredList = ({ itemsList, query }) =>
  !query
    ? []
    : itemsList.filter((x) => x.toLowerCase().includes(query.toLowerCase()));

// Method
const onKeydown = (host, e) => {
  const { selectedIdx, filteredList } = host;
  if (e.key === 'ArrowDown' && selectedIdx < filteredList.length - 1)
    host.selectedIdx++;
  if (e.key === 'ArrowUp' && selectedIdx > 0) host.selectedIdx--;
  if (e.key === 'Enter') onSelect(host);
};

const onSelect = (host, e) => {
  const { filteredList, selectedIdx } = host;
  const selectedValue = filteredList[selectedIdx];
  console.log(selectedValue);
  host.query = selectedValue;
  host.hasSelected = true;
};

// Definition
export const MyDropdown = {
  itemsList,
  filteredList,
  query: '',
  selectedIdx: 0,
  hasSelected: false,
  render: ({ filteredList, query, selectedIdx, hasSelected }) => html`
    ${style}

    <input
      class="input"
      type="text"
      placeholder="Type a month name..."
      value="${query}"
      oninput="${html.set('query')}"
      onkeydown="${onKeydown}"
    />

    ${query &&
    !hasSelected &&
    html`
      <ul class="list">
        ${filteredList.map((val, idx) =>
          html`
            <li
              class="${{
                'list-item': true,
                'list-item-selected': selectedIdx === idx,
              }}"
              onmouseover="${html.set('selectedIdx', idx)}"
              onclick="${onSelect}"
            >
              <slot name="item">${val}</slot>
            </li>
          `.key(idx)
        )}
      </ul>
    `}
  `,
};
