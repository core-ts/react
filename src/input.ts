import { LoadingService, Locale, ResourceService, UIService } from "./core"

interface ResourceInput {
  resource: ResourceService
}
export function getResource(p: ResourceService | ResourceInput): ResourceService {
  const x: any = p
  if (x.value && x.format && typeof x.value === "function") {
    return x
  } else {
    return x.resource
  }
}
interface ShortSearchParameter {
  auto?: boolean
}
export function getAutoSearch(p: ResourceService | ShortSearchParameter): boolean {
  const x: any = p
  if (x.value && x.format && typeof x.value === "function") {
    return true
  }
  return x.auto
}
interface UIInput {
  ui?: UIService
}
export function getUIService(p: ResourceService | UIInput, ui0?: UIService): UIService {
  if (ui0) {
    return ui0
  }
  return (p as any).ui
}
interface LoadingInput {
  loading?: LoadingService
}
export function getLoadingFunc(p: ResourceService | LoadingInput, ui0?: LoadingService): LoadingService {
  if (ui0) {
    return ui0
  }
  return (p as any).loading
}
interface ShowMessageInput {
  showMessage: (msg: string, option?: string) => void
}
export function getMsgFunc(p: ResourceService | ShowMessageInput, showMsg?: (msg: string, option?: string) => void): (msg: string) => void {
  if (showMsg) {
    return showMsg
  }
  return (p as any).showMessage
}
interface ConfirmInput {
  confirm: (m2: string, yesCallback?: () => void, header?: string, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void
}
export function getConfirmFunc(
  p: ResourceService | ConfirmInput,
  cf?: (m2: string, yesCallback?: () => void, header?: string, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void,
): (m2: string, yesCallback?: () => void, header?: string, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void {
  if (cf) {
    return cf
  }
  return (p as any).confirm
}
interface GetLocaleInput {
  getLocale?: (profile?: string) => Locale
}
export function getLocaleFunc(p: ResourceService | GetLocaleInput, getLoc?: () => Locale): () => Locale {
  if (getLoc) {
    return getLoc
  }
  return (p as any).getLocale
}
interface ShowErrorInput {
  showError: (m: string, callback?: () => void, header?: string) => void
}
export function getErrorFunc(
  p: ResourceService | ShowErrorInput,
  showErr?: (m: string, callback?: () => void, header?: string) => void,
): (m: string, callback?: () => void, header?: string) => void {
  if (showErr) {
    return showErr
  }
  return (p as any).showError
}

export function showLoading(s?: LoadingService): void {
  if (s) {
    s.showLoading()
  }
}
export function hideLoading(s?: LoadingService): void {
  if (s) {
    s.hideLoading()
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
