import { useCallback, useEffect, useRef, useState } from "react"
import { Locale, resources } from "./core"
import { buildFlatState, buildState, handleEvent, localeOf } from "./state"

export function removePhoneFormat(phone: string): string {
  if (phone) {
    return phone.replace(resources.phone, "")
  } else {
    return phone
  }
}

export function getModelName(form?: HTMLFormElement | null, name?: string): string {
  if (form) {
    const a = form.getAttribute("model-name")
    if (a && a.length > 0) {
      return a
    }
    const b = form.name
    if (b) {
      if (b.endsWith("Form")) {
        return b.substring(0, b.length - 4)
      }
      return b
    }
  }
  if (name && name.length > 0) {
    return name
  }
  return ""
}
const m = "model"
const _getModelName = (f2?: HTMLFormElement | null): string => {
  return getModelName(f2, m)
}

export type Callback<T> = (value?: T) => void
export type DispatchWithCallback<T> = (value: T, callback?: Callback<T>) => void

export function useMergeState<T>(initialState?: T | (() => T)): [T, DispatchWithCallback<Partial<T>>] {
  const [state, _setState] = useState(initialState ? initialState : ({} as any))

  const callbackRef = useRef<Callback<T>>()

  const setState = useCallback(
    (newState: Partial<T>, callback?: Callback<T>): void => {
      callbackRef.current = callback
      _setState((prevState: any) => Object.assign({}, prevState, newState))
    },
    [state],
  )

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state)
    }
  }, [state])

  return [state, setState]
}

export const useUpdate = <T>(
  initialState: T,
  getName?: ((f?: HTMLFormElement | null) => string) | string,
  getLocale?: (() => Locale) | Locale,
  removeErr?: (ctrl: HTMLInputElement) => void,
) => {
  const [state, setState] = useMergeState<T>(initialState)
  const [rerender, setRerender] = useState(false)

  // trigger re-render page when change state in useSearch
  useEffect(() => {
    setRerender(!rerender)
  }, [state])

  const updatePhoneState = (event: any) => {
    const re = /^[0-9\b]+$/
    const target = event.currentTarget as HTMLInputElement
    const value = removePhoneFormat(target.value)
    if (re.test(value) || !value) {
      updateState(event)
    } else {
      const splitArr = value.split("")
      let responseStr = ""
      splitArr.forEach((element) => {
        if (re.test(element)) {
          responseStr += element
        }
      })
      target.value = responseStr
      updateState(event)
    }
  }
  const getModelName: (f2?: HTMLFormElement | null) => string = typeof getName === "function" ? getName : _getModelName

  const updateState = (e: any, callback?: (prev: any) => void, lc?: Locale) => {
    const ctrl = e.currentTarget as HTMLInputElement
    let mn: string = m
    if (getName) {
      if (typeof getName === "string") {
        mn = getName
      } else {
        mn = getName(ctrl.form)
      }
    } else {
      mn = _getModelName(ctrl.form)
    }
    const l = localeOf(lc, getLocale)
    handleEvent(e, removeErr)
    const objSet = buildState<T, any>(e, state, ctrl, mn, l)
    if (objSet) {
      if (callback) {
        setState({ ...objSet }, callback)
      } else {
        setState(objSet)
      }
    }
  }
  const updateFlatState = (e: any, callback?: () => void, lc?: Locale) => {
    const objSet = buildFlatState<T, any>(e, state, lc)
    if (objSet) {
      if (callback) {
        setState(objSet, callback)
      } else {
        setState(objSet)
      }
    }
  }
  return {
    getModelName,
    updateState,
    updatePhoneState,
    updateFlatState,
    getLocale,
    setState,
    state,
  }
}
