import * as qs from 'query-string';

export function buildFromUrl<S>(): S {
  return buildParameters(window.location.search);
}
export function buildParameters<T>(url: string): T {
  let urlSearch = url;
  const i = urlSearch.indexOf('?');
  if (i >= 0) {
    urlSearch = url.substring(i + 1);
  }
  const parsed: any = qs.parse(urlSearch);
  return parsed;
}
