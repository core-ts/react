# react-hook-core

A TypeScript utility library for React applications. It provides reusable building blocks for common data-entry and administration screens: form-state updates, search filters, pagination, sorting, URL query handling, edit/save workflows, object comparison, locale-aware numeric input, and a small set of shared React components.

The library is used by the `react-admin` frontend, but its exported helpers are not tied to a particular admin application or backend API.

## What it provides

| Area | Main capabilities |
|---|---|
| Form state | Update a model from input, select, textarea, checkbox, and radio events; support nested field paths and typed values. |
| Search and lists | Filter models, page-size and page changes, sort state, result messages, and URL synchronization. |
| Routing | Read URL query parameters into typed models and navigate back with an unsaved-change confirmation. |
| Edit workflows | Create an initial model from attribute metadata and handle common create/update results. |
| Object utilities | Clone objects, compare values, calculate changed fields, create partial updates, and set nested values. |
| Locale and numbers | Normalize phone/fax and numeric strings; parse and format currency-like input using locale settings. |
| React helpers | A message hook and small reusable components for loading, error, select, page-size, and search UI. |
| Keyboard input | Allow valid digit, integer, and decimal keystrokes while preserving common editing shortcuts. |

This package is a collection of helpers, not a data-fetching framework or a global state-management solution. For example, search functions call a callback supplied by the application; they do not make HTTP requests themselves.

## Installation

```bash
npm install react-hook-core
```

### Runtime dependency note

The current `package.json` lists `react` and `query-string` under `devDependencies`, not `dependencies` or `peerDependencies`. The source imports React at runtime, and `route.ts` imports `query-string` at runtime. Make sure the consuming application provides compatible versions of these packages. The navigation helper types also reference `NavigateFunction` from `react-router`.

The package manifest should be reviewed before publishing or consuming this package in an environment that installs production dependencies only. In particular, `query-string` should be declared as a runtime dependency (or otherwise guaranteed by the application), and React should normally be declared as a peer dependency for a React library.

## Quick start

### 1. Keep a form model in React state

`updateState` reads the changed control and updates the corresponding model property. It uses the control's `data-field` attribute when present; otherwise it uses `name`. Nested paths such as `address.city` are supported by the underlying `setValue` helper.

```tsx
import { useState } from "react"
import { updateState } from "react-hook-core"

interface User {
  username: string
  displayName: string
  active: boolean
}

export function UserForm() {
  const [user, setUser] = useState<User>({
    username: "",
    displayName: "",
    active: true,
  })

  return (
    <form>
      <input
        name="username"
        value={user.username}
        onChange={(e) => updateState(e, user, setUser)}
      />

      <input
        name="displayName"
        value={user.displayName}
        onChange={(e) => updateState(e, user, setUser)}
      />

      <input
        type="checkbox"
        name="active"
        checked={user.active}
        onChange={(e) => updateState(e, user, setUser)}
      />
    </form>
  )
}
```

`updateState` mutates the supplied model and then calls the setter with a shallow copy (`{ ...model }`) to trigger a React render. Call it with the current model and its corresponding state setter. For numeric and locale-aware fields, see [Form state and value conversion](#form-state-and-value-conversion).

### 2. Build a searchable list

The library defines the filter and result contracts, plus helpers for pagination, sorting, and URL state. The application still owns the API call and the React state.

```tsx
import { useState } from "react"
import {
  Filter,
  SearchResult,
  getOffset,
  onPageChanged,
  resources,
} from "react-hook-core"

interface User {
  userId: string
  username: string
}

interface UserFilter extends Filter {
  status?: string
}

async function loadUsers(filter: UserFilter): Promise<SearchResult<User>> {
  // Call the application's API client here.
  // The service can use getOffset(filter.limit, filter.page, filter.firstLimit)
  // to calculate the requested offset.
  return { list: [], total: 0 }
}

export function UserList() {
  const [filter, setFilter] = useState<UserFilter>({
    limit: resources.defaultLimit,
  })
  const [users, setUsers] = useState<User[]>([])

  const search = async (nextFilter: UserFilter) => {
    const result = await loadUsers(nextFilter)
    setUsers(result.list)
  }

  const changePage = (page: number, size: number) => {
    onPageChanged({ page, size }, search, filter)
    setFilter({ ...filter, page, limit: size })
  }

  return (
    <div>
      {/* Render users and connect your pager to changePage. */}
      <span>{users.length} loaded</span>
    </div>
  )
}
```

The example illustrates the callback-oriented API. In a real screen, keep filter updates and the search callback coordinated so that the API request, displayed rows, and URL all represent the same filter. The helpers generally mutate the filter passed to them; see [Search, pagination, sorting, and URL state](#search-pagination-sorting-and-url-state).

### 3. Show message and validation feedback

`useMessage` stores a message and a CSS class for the caller to render.

```tsx
import { useMessage } from "react-hook-core"

export function MessageExample() {
  const { msg, showMessage, showError, hideMessage } = useMessage({})

  return (
    <section>
      <div className={msg.alertClass}>{msg.message}</div>
      <button type="button" onClick={() => showMessage("Saved")}>Show</button>
      <button type="button" onClick={() => showError("Unable to save")}>Error</button>
      <button type="button" onClick={hideMessage}>Hide</button>
    </section>
  )
}
```

The hook does not render an alert itself. The consuming application supplies the markup and CSS for the `alert alert-info` and `alert alert-error` class names.

## API guide

All modules are re-exported from the package entry point (`src/index.ts`). Consumers can import from `react-hook-core` rather than importing individual source files.

### Form state and value conversion

The main functions are in `state.ts`:

| API | Purpose |
|---|---|
| `updateState(event, model, setModel, decimalSeparator?, formatStr?, callback?)` | Read a form control and update its model field. |
| `formatAndUpdateState(event, model, setModel, formatStr?, decimalSeparator?, callback?)` | Convenience wrapper that places `formatStr` before `decimalSeparator`. |
| `updateStateAndCallback(event, model, setModel, callback?, decimalSeparator?, formatStr?)` | Convenience wrapper that places the callback before locale/format arguments. |
| `updateNumber(event, model, setModel, decimalSeparator?, callback?, formatStr?)` | Update a numeric field using numeric normalization. |
| `getDecimalSeparator(input)` | Read `data-decimal-separator` from the input or its form; defaults to `.`. |
| `normalizeInteger(value)` | Keep digits `0`–`9`. |
| `normalizeNumber(value)` | Keep digits and convert comma / Arabic decimal separator to `.`. |
| `removeSeparators(value)` | Keep digits and `.`. |
| `valueOfCheckbox(input)` | Return the checked value, optionally using `data-on-value` and `data-off-value`. |

`updateState` uses these conventions:

- The model field is taken from `data-field`, falling back to the control's `name`.
- A `SELECT` stores its selected value as a string and updates its `data-value` attribute.
- A checkbox whose `name` and `id` differ is treated as part of a string-value array. Other checkboxes are treated as booleans or use `data-on-value` / `data-off-value`.
- Radio buttons store their selected string value.
- `date` and `datetime-local` inputs are converted to ISO strings; `time` inputs are converted to epoch milliseconds.
- `data-type="phone"`, `"fax"`, `"integer"`, and `"number"` trigger their corresponding normalization.
- Dotted field paths are handled by `reflect.setValue`. The setter also recognizes bracket notation for arrays, but its indexed-array behavior should be tested before relying on arbitrary array positions.

For example, a locale-aware number input can use `data-type="number"` and the locale's decimal separator:

```tsx
<input
  name="amount"
  data-type="number"
  value={String(model.amount ?? "")}
  onChange={(e) => updateState(e, model, setModel, locale.decimalSeparator)}
/>
```

`updateState` is intended for browser form events. It directly reads and sometimes changes DOM attributes such as `data-value`; it is not a general-purpose immutable object reducer.

### Search, pagination, sorting, and URL state

The main contracts in `search.ts` are:

- `Filter`: `q`, `page`, required `limit`, optional `firstLimit`, `fields`, and `sort`.
- `SearchResult<T>`: `list` plus optional `total`, `next`, and `last`.
- `SearchService<T, S>`: an application-provided `search(filter, limit?, offset?, fields?)` method returning a `Promise<SearchResult<T>>`.
- `PageChange`, `Pagination`, and `Sortable`: page and sort state shapes used by the helpers.

Important helper groups:

| Group | APIs |
|---|---|
| Filter initialization | `mergeFilter`, `isArray`, `initFilter` |
| Visible fields / result display | `getFields`, `getPageTotal`, `formatText`, `buildMessage` |
| Query-string synchronization | `addParametersIntoUrl`, `updateUrl` |
| Sort model | `buildSort`, `setSort`, `buildSortFilter`, `getSortId`, `setSortFilter`, `sort`, `handleSort`, `getSortElement`, `toggleSortStyle`, `removeSortStatus`, `onSort`, `sortOnChange` |
| Search and paging events | `getNumber`, `handleToggle`, `onToggleSearch`, `resetSearch`, `onClearQ`, `onPageSizeChanged`, `onPageChanged`, `onSearch` |
| Offset calculation | `getOffset` |

A common list-screen sequence is:

1. Create a filter with at least `limit`.
2. Use `buildFromUrl` / `buildParameters` or `initFilter` to restore filter and paging state.
3. Call the application's search service with the filter and an offset from `getOffset`.
4. Use `onPageChanged`, `onPageSizeChanged`, `onSearch`, and sorting helpers to update the filter and invoke the application's search callback.
5. Use `updateUrl` or `addParametersIntoUrl` when the screen should reflect filter state in the browser URL.

`resources.defaultLimit` is `24`; `resources.limits` defaults to `[12, 24, 60, 100, 120, 180, 300, 600]`. `getOffset(limit, page, firstLimit)` supports a different first-page size. The helpers do not make requests or own list state.

Some helpers mutate their arguments. In particular, `mergeFilter`, `initFilter`, `buildSortFilter`, `setSortFilter`, and the event handlers may update the supplied filter or sort state. When using React state, account for this mutation and pass a new object to the state setter when needed.

`addParametersIntoUrl` uses `window.location` and `window.history.replaceState`; it is browser-only. It serializes supported primitive, date, array, and one-level nested filter values into the current URL. It intentionally omits the configured fields parameter.

### Route and navigation helpers

`route.ts` exports:

| API | Purpose |
|---|---|
| `buildFromUrl(model?)` | Parse `window.location.search` into an object or a model-shaped object. |
| `buildParameters(url, model?)` | Parse a URL/query string into an object. |
| `convertToObject(input, model?)` | Convert a parsed key/value map into nested properties, or map it using a model as a type template. |
| `onBack(event, navigate, confirm, resource, current, original?, keys?, version?)` | Prevent the default event and run the back-navigation check. |
| `goBack(navigate, confirm, resource, current, original?, keys?, version?)` | Navigate back immediately when there are no tracked changes; otherwise ask for confirmation. |

When a model is supplied to `buildParameters` / `convertToObject`, the model's values determine the conversion type for each property. Date, number, boolean, string, array, and nested-object fields receive corresponding conversions. Without a model, dotted query keys become nested objects and string values that look numeric or boolean are converted.

`onBack` and `goBack` expect the application to supply its router's `navigate` function and a confirmation callback. The confirmation UI is not included in this package.

### Create and update workflows

`edit.ts` exports:

- `createModel<T>(attributes?)`: create an initial object using an `Attributes` map.
- `isSuccessful(result)`: interpret a numeric/object/error-array result.
- `afterSaved(...)`: show form validation errors, a save-success alert, not-found, or conflict feedback; after success it navigates back when a `navigate` function is supplied.
- `afterCreated(...)`: similar handling for create operations, using caller-provided success and duplicate messages.

`createModel` uses each attribute's `name` as the resulting object property and initializes by `type`:

| Attribute type | Initial value |
|---|---|
| `string`, `text` | `""` |
| `integer`, `number` | `0` |
| `array` | `[]` |
| `boolean` | `false` |
| `date` | `new Date()` |
| `object` | A recursively created object when `typeof` is supplied; otherwise `{}` |
| `ObjectId` | `null` |
| Other / unspecified type | `""` |

The result handlers use the following convention: an array is treated as a list of `ErrorMessage` validation errors; a positive number or object is treated as success; `afterSaved` treats `0` as not found and other non-success values as conflict. `afterCreated` treats a non-success, non-error-array result as a duplicate/failure and displays the supplied duplicate message.

### Object reflection and comparison

`reflect.ts` contains general object helpers:

| API | Purpose |
|---|---|
| `clone(value)` | Recursively clone arrays and plain objects; clone `Date` values by timestamp. |
| `diff(a, b)` | Return field names whose values differ, comparing keys in both objects. |
| `makeDiff(current, original?, keys?, version?)` | Build a partial object containing changed values, plus explicitly included keys/version when supplied. |
| `hasDiff(current, original?, keys?, version?)` | Check whether `makeDiff` produces a non-empty result. |
| `equal(a, b)`, `equalArrays(a, b)` | Compare values, arrays, dates, and nested objects. |
| `isEmpty(object)` | Check whether an object has own enumerable properties. |
| `notIn(a, b)` | Return values from the second string array that are not in the first. |
| `getArray(list, name, value)` | Filter objects whose named property equals a value. |
| `getDiffArray(list, name, value)` | Filter objects whose named property does not equal a value. |
| `getDirectValue(object, key)` | Read an own direct property, or return `null`. |
| `setValue(object, path, value)` | Assign a value through a dotted / bracketed property path. |

`diff` and `makeDiff` are intended for model comparison and partial-update construction, not as a general JSON Patch implementation. `clone` handles ordinary objects, arrays, and dates; it does not preserve prototypes or special object types. `setValue` parses bracket notation, but array assignment may append rather than replace a requested index, so verify the behavior for the exact paths used by a form.

### Approval / comparison models

`diff.ts` exports the types `DiffModel<T, ID>`, `ApprService<ID>`, `DiffService<T, ID>`, `DiffApprService<T, ID>`, and `DiffState<T>`, plus:

- `formatDiffModel(model, formatFields?)`: clone a diff model, normalize `origin` and `value` from JSON strings when needed, default missing sides to empty objects, and optionally format object fields.
- `getDataFields(form?)`: recursively find DOM elements carrying a non-empty `data-field` attribute.

The service interfaces describe contracts only; they do not implement an approval API.

### Shared React components

`com.ts` exports small components that render basic HTML elements and expect the application to provide matching styles:

| Component | Purpose |
|---|---|
| `Error` | Render an error heading/message and an optional back button. |
| `PageSizeSelect` | Render a page-size select; defaults to `pageSizes`. |
| `Select` | Render a select from `{ value, text? }` items. |
| `Search` | Render a search input and optional page-size, clear, toggle, and search buttons. |

`index.ts` additionally exports:

- `Loading`: loading markup, or `Error Load Module!` when its `error` prop is truthy.
- `CurrencyInput`: an input wrapper with locale-aware blur formatting through the supplied `currencyOnBlur` callback and optional numeric change callback. If an `onChange` prop is supplied, it replaces the component's internal change handler; in that case its internal state update and `onChangeNumber` callback are not run by the component.

These components use class names such as `loader-wrapper`, `loader-sign`, `loader`, `error-header`, `error-body`, `btn-search`, and `btn-filter`. Their visual appearance depends on CSS provided by the consuming application; the package does not include a theme or stylesheet.

### Locale, currency, date, and keyboard utilities

`core.ts` exports:

- `Locale`, describing country/date/number/currency settings.
- `ErrorMessage`, with `field`, `code`, and optional `param` / `message`.
- `Type`, `Attribute`, and `Attributes`, used by `createModel`.
- `StringMap`, `LoadingService`, `pageSizes`, `sizes`, `resources`, `normalizePhone`, and `normalizeFax`.

`util.ts` exports `enLocale` and `valueOf(input, locale?, eventType?)`. `valueOf` reads a checkbox or a regular input; numeric and currency behavior is selected through the input's `data-type` attribute.

The package entry point also exports:

- `formatDate`, `dateToString`, `datetimeToString`, and `numberToString`.
- `getParam`, `checked`, `includes`, and `value`.
- `scrollToFocus` for the library's expected form DOM layout.
- `digitKeyDown`, `integerKeyDown`, and `numberKeyDown`, plus React event wrappers `digitOnKeyDown`, `integerOnKeyDown`, and `numberOnKeyDown`.

The keyboard helpers allow common control keys and Ctrl/Cmd shortcuts. `integerKeyDown` and `numberKeyDown` allow a leading minus sign only when the input's `min` attribute represents a negative number. `numberKeyDown` accepts one configured decimal separator (`.`, `,`, or `٫`). These are key filters, not complete validation; pasted values and programmatic changes still need validation.

## Project structure

```text
react-hook-core/
├── src/
│   ├── index.ts       # Package entry point and general React/input helpers
│   ├── core.ts        # Shared types, resources, locale, page-size defaults
│   ├── state.ts       # Form event -> model state conversion
│   ├── search.ts      # Filters, pagination, sorting, URL synchronization
│   ├── route.ts       # Query parsing and back-navigation helpers
│   ├── edit.ts        # Model creation and save/create result handling
│   ├── reflect.ts     # Clone, equality, diff, and nested property assignment
│   ├── diff.ts        # Approval/diff model contracts and DOM data-field lookup
│   ├── com.ts         # Small shared React components
│   ├── useMessage.ts  # useMessage hook
│   └── util.ts        # Locale-aware input value conversion
├── lib/               # Compiled CommonJS JavaScript
├── package.json
└── tsconfig.json
```

## Build

The package compiles TypeScript from `src/` into `lib/` using the root `tsconfig.json`.

```bash
npm run build:lib
```

To remove the compiled output:

```bash
npm run clean:lib
```

The current `package.json` does not define a test or lint script. The provided source archive also does not include a test suite.

## Implementation notes and limitations

- **Browser-oriented helpers:** URL synchronization, focus scrolling, DOM field discovery, and form-state conversion access `window`, `document`, `navigator`, or DOM nodes. Do not call these helpers during server-side rendering.
- **Application-owned services:** `SearchService`, `DiffService`, `ApprService`, loading, alerts, and confirmation are interfaces/callback contracts. The library does not implement HTTP clients, modals, notifications, or backend behavior.
- **Mutable model helpers:** several search, edit, and state functions mutate supplied objects before or while updating state. Review the specific function's behavior when using immutable-state conventions.
- **CSS is external:** components emit markup and class names but do not ship styles.
- **Currency formatting is delegated:** `CurrencyInput` calls the supplied `currencyOnBlur`; it does not provide a complete built-in currency formatter. `valueOf` implements its own input normalization rules.
- **Date behavior:** `dateToString` and `datetimeToString` use the local time zone through `Date` getters. `formatDate` formats a date through an `en-US` locale string and token replacement; it is not a general date-formatting engine.
- **Package metadata should be checked:** `package-lock.json` records a different root version and an older dependency set than `package.json`. The TypeScript configuration also targets ES5, uses CommonJS, and does not emit declaration files (`declaration: false`); the package manifest points `types` to `src/index.ts`.

## License

MIT
