import { LoadingService, StringMap } from "./core"

export function messageByHttpStatus(status: number, resource: StringMap): string {
  const k = "error_" + status
  let msg = resource[k]
  if (!msg || msg.length === 0) {
    msg = resource.error_500
  }
  return msg
}
export function error(err: any, resource: StringMap, ae: (msg: string, callback?: () => void, header?: string) => void) {
  const title = resource.error
  let msg = resource.error_internal
  if (!err) {
    ae(msg, undefined, title)
    return
  }
  const data = err && err.response ? err.response : err
  if (data) {
    const status = data.status
    if (status && !isNaN(status)) {
      msg = messageByHttpStatus(status, resource)
    }
    ae(msg, undefined, title)
  } else {
    ae(msg, undefined, title)
  }
}

export function showLoading(loading?: LoadingService | ((firstTime?: boolean) => void)): void {
  if (loading) {
    if (typeof loading === "function") {
      loading()
    } else {
      loading.showLoading()
    }
  }
}
export function hideLoading(loading?: LoadingService | (() => void)): void {
  if (loading) {
    if (typeof loading === "function") {
      loading()
    } else {
      loading.hideLoading()
    }
  }
}

export function initForm(form?: HTMLFormElement, initMat?: (f: HTMLFormElement) => void): HTMLFormElement | undefined {
  if (form) {
    setTimeout(() => {
      if (initMat) {
        initMat(form)
      }
      focusFirstElement(form)
    }, 100)
  }
  return form
}
export function focusFirstElement(form: HTMLFormElement): void {
  let i = 0
  const len = form.length
  for (i = 0; i < len; i++) {
    const ctrl = form[i] as HTMLInputElement
    if (!(ctrl.readOnly || ctrl.disabled)) {
      let nodeName = ctrl.nodeName
      const type = ctrl.getAttribute("type")
      if (type) {
        const t = type.toUpperCase()
        if (t === "BUTTON" || t === "SUBMIT") {
          ctrl.focus()
        }
        if (nodeName === "INPUT") {
          nodeName = t
        }
      }
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT" && nodeName !== "CHECKBOX" && nodeName !== "RADIO") {
        ctrl.focus()
        /*
        try {
          ctrl.setSelectionRange(0, ctrl.value.length)
        } catch (err) {}
         */
        return
      }
    }
  }
}
