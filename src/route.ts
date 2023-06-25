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
  try {
    const parsed: any = convertToObject(qs.parse(urlSearch));
    return parsed;
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function convertToObject(input: any) {
  const output = {};

  for (let key in input) {
    const value = input[key];
    const keys = key.split('.');

    let currentObj = output as any;
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];

      if (!currentObj[currentKey]) {
        if (i === keys.length - 1) {
          currentObj[currentKey] = value;
        } else {
          currentObj[currentKey] = {};
        }
      }

      currentObj = currentObj[currentKey];
    }
  }

  return output;
}
