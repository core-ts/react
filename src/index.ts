import * as React from "react"
import { ChangeEvent, ChangeEventHandler, FocusEvent, useEffect, useState } from "react"
export * from "./com"
export * from "./core"
export * from "./diff"
export * from "./edit"
export * from "./formutil"
export * from "./reflect"
export * from "./route"
export * from "./search"
export * from "./state"
export * from "./update"
export * from "./useEdit"
export * from "./useMessage"
export * from "./useSearch"
export * from "./util"
/*
type CallBackType<T> = (updatedValue: T) => void;
type SetStateType<T> = T | ((prev: T) => T);
type RetType = <T>(initialValue: T | (() => T)) => [T, (newValue: SetStateType<T>, callback?: CallBackType<T>) => void];

export const useCallbackState: RetType = <T>(initialValue: T | (() => T)) => {
  const [state, _setState] = useState<T>(initialValue);
  const callbackQueue = useRef<CallBackType<T>[]>([]);

  useEffect(() => {
    callbackQueue.current.forEach((cb) => cb(state));
    callbackQueue.current = [];
  }, [state]);

  const setState = (newValue: SetStateType<T>, callback?: CallBackType<T>) => {
    _setState(newValue);
    if (callback && typeof callback === "function") {
      callbackQueue.current.push(callback);
    }
  };
  return [state, setState];
};
*/
export function checked(s: string[] | string | undefined, v: string): boolean | undefined {
  if (s) {
    if (Array.isArray(s)) {
      return s.includes(v)
    } else {
      return s === v
    }
  }
  return false
}
export function value<T>(obj?: T): T {
  return obj ? obj : ({} as any)
}
export interface LoadingProps {
  error?: any
}
export const Loading = (props: LoadingProps) => {
  const loadingStyle = {
    top: "30%",
    backgroundColor: "white",
    border: "none",
    WebkitBoxShadow: "none",
    boxShadow: "none",
  }
  if (props.error) {
    return React.createElement("div", null, "Error Load Module!") // return (<div>Error Load Module!</div>);
  } else {
    return React.createElement(
      "div",
      { className: "loader-wrapper" },
      React.createElement("div", { className: "loader-sign", style: loadingStyle }, React.createElement("div", { className: "loader" })),
    )
    /*
    return (
      <div className='loader-wrapper'>
        <div className='loader-sign' style={loadingStyle}>
          <div className='loader' />
        </div>
      </div>
    );*/
  }
}
interface Locale {
  decimalSeparator: string
  groupSeparator: string
  currencyCode: string
  currencySymbol: string
  currencyPattern: number
}
interface InputProps {
  name?: string
  className?: string
  value?: string
  ["data-field"]?: string
  defaultValue?: string
  onChangeNumber?: (value: number) => void
  onChange?: ChangeEventHandler<HTMLInputElement>
  currencyOnBlur?: (event: Event | any, locale: Locale, currencyCode?: string, includingCurrencySymbol?: boolean) => void
  currencyCode?: string
  symbol?: boolean
  readOnly?: boolean
  locale?: Locale
  type?: string
  disabled?: boolean
  required?: boolean
  typeOutput?: string
  min?: string | number
  max?: string | number
  allowZero?: boolean
}
export const CurrencyInput = (props: InputProps) => {
  const [state, setState] = useState<string | undefined>(undefined)
  useEffect(() => {
    setState(props.value)
  }, [props.value])
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v1 = e.target.value
    setState(v1)
    if (props.onChange) {
      props.onChange(e)
    }
    if (props.onChangeNumber) {
      props.onChangeNumber(parseFloat(v1))
    }
  }
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (props.allowZero && e.target.value === "0") {
      setState("0")
      return
    }
    if (props.locale && props.currencyOnBlur) {
      props.currencyOnBlur(e, props.locale, props.currencyCode, props.symbol)
    }
    setTimeout(() => {
      const v2 = e.target.value
      setState(v2)
    }, 50)
  }
  // return <input className={props.className} onBlur={onBlur} type={props.type} name={props.name} onChange={props.onChange ? props.onChange : onChange} disabled={props.disabled} data-field={props['data-field']} min={props.min} max={props.max} value={state} />;
  return React.createElement("input", {
    className: props.className,
    onBlur: onBlur,
    type: props.type,
    name: props.name,
    onChange: props.onChange ? props.onChange : onChange,
    disabled: props.disabled,
    "data-field": props["data-field"],
    min: props.min,
    max: props.max,
    value: state,
  })
}
export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>
export function getParam(url: string, i?: number): string {
  const ps = url.split("/")
  if (!i || i < 0) {
    i = 0
  }
  return ps[ps.length - 1 - i]
}
export function formatDate(date: Date | null | undefined, format: string): string {
  if (!date) {
    return ""
  }
  const opts: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }
  const d2 = new Date(date).toLocaleString("en-US", opts)
  let od = format.replace("YYYY", d2.slice(6, 10))
  od = od.replace("MM", d2.slice(0, 2))
  od = od.replace("DD", d2.slice(3, 5))
  od = od.replace("HH", d2.slice(12, 14))
  od = od.replace("mm", d2.slice(15, 17))
  od = od.replace("ss", d2.slice(18, 20))
  return od
}
export function dateToString(date: Date | string): string {
  const d2 = typeof date !== "string" ? date : new Date(date)
  const year = d2.getFullYear()
  const month = String(d2.getMonth() + 1).padStart(2, "0")
  const day = String(d2.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
export function datetimeToString(date?: Date | string): string | undefined {
  if (!date || date === "") {
    return undefined
  }
  const d2 = typeof date !== "string" ? date : new Date(date)
  const year = d2.getFullYear()
  const month = String(d2.getMonth() + 1).padStart(2, "0")
  const day = String(d2.getDate()).padStart(2, "0")
  const hours = String(d2.getHours()).padStart(2, "0")
  const minutes = String(d2.getMinutes()).padStart(2, "0")
  const seconds = String(d2.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}
export function getNumber(event: ChangeEvent<HTMLSelectElement | HTMLInputElement>): number {
  return parseInt(event.currentTarget.value, 10)
}

export const scrollToFocus = (e: any, isUseTimeOut?: boolean) => {
  try {
    const element = e.target as HTMLInputElement
    const form = element.form
    if (form) {
      const container = form.childNodes[1] as HTMLElement
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.pageYOffset
      const middle = absoluteElementTop - window.innerHeight / 2
      const scrollTop = container.scrollTop
      const timeOut = isUseTimeOut ? 300 : 0
      const isChrome = navigator.userAgent.search("Chrome") > 0
      setTimeout(() => {
        if (isChrome) {
          const scrollPosition = scrollTop === 0 ? elementRect.top + 64 : scrollTop + middle
          container.scrollTo(0, Math.abs(scrollPosition))
        } else {
          container.scrollTo(0, Math.abs(scrollTop + middle))
        }
      }, timeOut)
    }
  } catch (e) {
    console.log(e)
  }
}
