import { html, dispatch } from '../lib/hybrids.js';

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

    .list-item-selected,
    .list-item-selected:hover {
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

// Methods
const onKeydown = (host, e) => {
  if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) e.preventDefault();

  const { selectedIdx, filteredList } = host;
  if (e.key === 'ArrowDown' && selectedIdx < filteredList.length - 1)
    host.selectedIdx++;
  if (e.key === 'ArrowUp' && selectedIdx > 0) host.selectedIdx--;
  if (e.key === 'Enter') onSelect(host);
};

const onSelect = (host, e) => {
  const { filteredList, selectedIdx } = host;
  const selectedValue = filteredList[selectedIdx];
  if (selectedValue) {
    host.query = selectedValue;
    host.hasSelected = true;
  }
  dispatch(host, 'select', { detail: host.query });
};

// Side Effects
const query = {
  connect: (host, key) => {
    host[key] = host[key] || '';
  },
  observe: (host, value, lastValue) => {
    dispatch(host, 'type', {
      detail: {
        oldVal: lastValue,
        newVal: value,
      },
    });
    if (!lastValue || (lastValue && value && lastValue.length > value.length)) {
      host.hasSelected = false;
    }
  },
};

const filteredList = {
  get: ({ itemsList, query }) =>
    !query
      ? []
      : itemsList.filter((x) => x.toLowerCase().includes(query.toLowerCase())),
  observe: (host, value, lastValue) => {
    const { selectedIdx } = host;
    if (value.length - 1 < selectedIdx) {
      host.selectedIdx = 0;
    }
  },
};

// Factories
function refs(query) {
  return ({ render }) => {
    if (typeof render === 'function') {
      const target = render();
      return target.querySelectorAll(query);
    }

    return null;
  };
}

// Definition
export const MyDropdown = {
  itemsList,
  filteredList,
  query,
  selectedIdx: 0,
  hasSelected: false,
  placeholder: 'Type a month name...',
  listItems: refs('li'),
  render: ({
    filteredList,
    query,
    selectedIdx,
    hasSelected,
    placeholder,
  }) => html`
    ${style}

    <input
      class="input"
      type="text"
      placeholder="${placeholder}"
      value="${query}"
      oninput="${html.set('query')}"
      onkeydown="${onKeydown}"
    />

    ${query &&
    filteredList.length > 0 &&
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
