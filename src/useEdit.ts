import { useEffect, useState } from "react"
import { Params, useNavigate, useParams } from "react-router"
import { messageByHttpStatus } from "./common"
import { Attribute, Attributes, ErrorMessage, LoadingService, Locale, resources, ResourceService, UIService } from "./core"
import { createModel as createModel2 } from "./edit"
import { focusFirstError, setReadOnly } from "./formutil"
import { hideLoading, initForm, showLoading } from "./input"
import { clone, makeDiff } from "./reflect"
import { localeOf } from "./state"
import { DispatchWithCallback, getModelName as getModelName2, useMergeState, useUpdate } from "./update"

export function buildKeys(attributes: Attributes): string[] {
  if (!attributes) {
    return []
  }
  const ks = Object.keys(attributes)
  const ps = []
  for (const k of ks) {
    const attr: Attribute = attributes[k]
    if (attr.key === true) {
      ps.push(k)
    }
  }
  return ps
}
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
export function buildId<ID>(p: Readonly<Params<string>>, keys?: string[]): ID | null {
  if (!keys || keys.length === 0 || keys.length === 1) {
    if (keys && keys.length === 1) {
      if (p[keys[0]]) {
        return p[keys[0]] as any
      }
    }
    return p["id"] as any
  }
  const id: any = {}
  for (const key of keys) {
    let v = p[key]
    if (!v) {
      v = p[key]
      if (!v) {
        return null
      }
    }
    id[key] = v
  }
  return id
}

export interface EditParameter {
  resource: ResourceService
  showMessage: (msg: string, option?: string) => void
  showError: (m: string, callback?: () => void, header?: string) => void
  confirm: (m2: string, yesCallback?: () => void, header?: string, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void
  ui?: UIService
  getLocale?: (profile?: string) => Locale
  loading?: LoadingService
  // status?: EditStatusConfig;
}
export interface GenericService<T, ID, R> {
  metadata?(): Attributes | undefined
  keys?(): string[]
  load(id: ID, ctx?: any): Promise<T | null>
  patch?(obj: Partial<T>, ctx?: any): Promise<R>
  create(obj: T, ctx?: any): Promise<R>
  update(obj: T, ctx?: any): Promise<R>
  delete?(id: ID, ctx?: any): Promise<number>
}
export interface MetaModel {
  keys?: string[]
  version?: string
}
export function build(attributes: Attributes, name?: string): MetaModel | undefined {
  if (!attributes) {
    return undefined
  }
  if (resources.cache && name && name.length > 0) {
    let meta: MetaModel = resources._cache[name]
    if (!meta) {
      meta = buildMetaModel(attributes)
      resources._cache[name] = meta
    }
    return meta
  } else {
    return buildMetaModel(attributes)
  }
}

function buildMetaModel(attributes: Attributes): MetaModel {
  if (!attributes) {
    return {}
  }
  /*
  if (model && !model.source) {
    model.source = model.name;
  }
  */
  const md: MetaModel = {}
  const pks: string[] = new Array<string>()
  const keys: string[] = Object.keys(attributes)
  for (const key of keys) {
    const attr: Attribute = attributes[key]
    if (attr) {
      if (attr.version) {
        md.version = key
      }
      if (attr.key === true) {
        pks.push(key)
      }
    }
  }
  md.keys = pks
  return md
}
export function handleVersion<T>(obj: T, version?: string): void {
  if (obj && version && version.length > 0) {
    const v = (obj as any)[version]
    if (v && typeof v === "number") {
      ;(obj as any)[version] = v + 1
    } else {
      ;(obj as any)[version] = 1
    }
  }
}

export interface BaseEditComponentParam<T, ID> {
  // status?: EditStatusConfig;
  backOnSuccess?: boolean
  name?: string
  metadata?: Attributes
  keys?: string[]
  version?: string
  setBack?: boolean
  patchable?: boolean

  // addable?: boolean;
  readOnly?: boolean
  // deletable?: boolean;

  createSuccessMsg?: string
  updateSuccessMsg?: string

  handleNotFound?: (form?: HTMLFormElement) => void
  getModelName?: (f?: HTMLFormElement) => string
  getModel?: () => T
  showModel?: (m: T) => void
  createModel?: () => T
  onSave?: (isBack?: boolean) => void
  validate?: (obj: T, callback: (obj2?: T) => void) => void
  succeed?: (msg: string, origin: T, version?: string, isBack?: boolean, model?: T) => void
  fail?: (result: ErrorMessage[]) => void
  postSave?: (res: number | T | ErrorMessage[], origin: T, version?: string, isPatch?: boolean, backOnSave?: boolean) => void
  handleError?: (error: any) => void
  handleDuplicateKey?: (result?: T) => void
  load?: (i: ID | null, callback?: (m: T, showM: (m2: T) => void) => void) => void
  doSave?: (obj: T, diff?: T, version?: string, isBack?: boolean) => void
  // prepareCustomData?: (data: any) => void; // need to review
}
export interface HookBaseEditParameter<T, ID, S> extends BaseEditComponentParam<T, ID> {
  refForm: any
  initialState: S
  service: GenericService<T, ID, number | T | ErrorMessage[]>
  resource: ResourceService
  showMessage: (msg: string) => void
  showError: (m: string, callback?: () => void, header?: string) => void
  getLocale?: () => Locale
  confirm: (m2: string, yesCallback?: () => void, header?: string, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void
  ui?: UIService
  loading?: LoadingService
}
export interface EditComponentParam<T, ID, S> extends BaseEditComponentParam<T, ID> {
  initialize?: (
    id: ID | null,
    ld: (i: ID | null, cb?: (m: T, showF: (model: T) => void) => void) => void,
    setState2: DispatchWithCallback<Partial<S>>,
    callback?: (m: T, showF: (model: T) => void) => void,
  ) => void
  callback?: (m: T, showF: (model: T) => void) => void
}
export interface HookPropsEditParameter<T, ID, S, P> extends HookPropsBaseEditParameter<T, ID, S, P> {
  initialize?: (
    id: ID | null,
    ld: (i: ID | null, cb?: (m: T, showF: (model: T) => void) => void) => void,
    setState2: DispatchWithCallback<Partial<S>>,
    callback?: (m: T, showF: (model: T) => void) => void,
  ) => void
  callback?: (m: T, showF: (model: T) => void) => void
}
export interface HookPropsBaseEditParameter<T, ID, S, P> extends HookBaseEditParameter<T, ID, S> {
  props: P
  // prepareCustomData?: (data: any) => void;
}
export const useEdit = <T, ID, S>(
  refForm: any,
  initialState: S,
  service: GenericService<T, ID, number | T | ErrorMessage[]>,

  p2: EditParameter,
  p?: EditComponentParam<T, ID, S>,
) => {
  const params = useParams()
  const baseProps = useCoreEdit(refForm, initialState, service, p2, p)
  useEffect(() => {
    if (refForm) {
      const registerEvents = p2.ui ? p2.ui.registerEvents : undefined
      initForm(baseProps.refForm.current, registerEvents)
    }
    const n = baseProps.getModelName(refForm.current)
    const obj: any = {}
    obj[n] = baseProps.createModel()
    baseProps.setState(obj)
    let keys: string[] | undefined
    if (p && !p.keys && service && service.metadata) {
      const metadata = p.metadata ? p.metadata : service.metadata()
      if (metadata) {
        const meta = build(metadata)
        keys = p.keys ? p.keys : meta ? meta.keys : undefined
        const version = p.version ? p.version : meta ? meta.version : undefined
        p.keys = keys
        p.version = version
      }
    }
    const id = buildId<ID>(params, keys)
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback)
    } else {
      try {
        baseProps.load(id, p ? p.callback : undefined)
      } catch (error) {
        p2.showError(error as string)
        hideLoading(p2.loading)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { ...baseProps }
}
export const useEditProps = <T, ID, S, P>(
  props: P,
  refForm: any,
  initialState: S,
  service: GenericService<T, ID, number | T | ErrorMessage[]>,
  p2: EditParameter,
  p?: EditComponentParam<T, ID, S>,
) => {
  const params = useParams()
  const baseProps = useCoreEdit<T, ID, S, P>(refForm, initialState, service, p2, p, props)
  useEffect(() => {
    if (refForm) {
      const registerEvents = p2.ui ? p2.ui.registerEvents : undefined
      initForm(baseProps.refForm.current, registerEvents)
    }
    const n = baseProps.getModelName(refForm.current)
    const obj: any = {}
    obj[n] = baseProps.createModel()
    baseProps.setState(obj)
    let keys: string[] | undefined
    if (p && !p.keys && service && service.metadata) {
      const metadata = p.metadata ? p.metadata : service.metadata()
      if (metadata) {
        const meta = build(metadata)
        keys = p.keys ? p.keys : meta ? meta.keys : undefined
        const version = p.version ? p.version : meta ? meta.version : undefined
        p.keys = keys
        p.version = version
      }
    }
    const id = buildId<ID>(params, keys)
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback)
    } else {
      baseProps.load(id, p ? p.callback : undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { ...baseProps }
}
export const useEditOneProps = <T, ID, S, P>(p: HookPropsEditParameter<T, ID, S, P>) => {
  return useEditProps(p.props, p.refForm, p.initialState, p.service, p, p)
}
export const useEditOne = <T, ID, S>(p: HookBaseEditParameter<T, ID, S>) => {
  return useEdit(p.refForm, p.initialState, p.service, p, p)
}
export const useCoreEdit = <T, ID, S, P>(
  refForm: any,
  initialState: S,
  service: GenericService<T, ID, number | T | ErrorMessage[]>,
  p1: EditParameter,
  p?: BaseEditComponentParam<T, ID>,
  props?: P,
) => {
  /*
  const {
    backOnSuccess = true,
    patchable = true,
    addable = true
  } = p; */
  const navigate = useNavigate()
  // const addable = (p && p.patchable !== false ? true : undefined);

  const [running, setRunning] = useState<boolean>()

  const getModelName = (f?: HTMLFormElement | null): string => {
    if (p && p.name && p.name.length > 0) {
      return p.name
    }
    return getModelName2(f)
  }
  const baseProps = useUpdate<S>(initialState, getModelName, p1.getLocale)

  const { state, setState } = baseProps
  const [flag, setFlag] = useMergeState({
    newMode: false,
    setBack: false,
    // addable,
    readOnly: p ? p.readOnly : undefined,
    originalModel: undefined,
  })

  const showModel = (model: T) => {
    const n = getModelName(refForm.current)
    const objSet: any = {}
    objSet[n] = model
    setState(objSet)
    if (p && p.readOnly) {
      const f = refForm.current
      setReadOnly(f)
    }
  }

  const resetState = (newMode: boolean, model: T, originalModel?: T) => {
    setFlag({ newMode, originalModel } as any)
    showModel(model)
  }

  const _handleNotFound = (form?: any): void => {
    if (form) {
      setReadOnly(form)
    }
    const resource = p1.resource.resource()
    p1.showError(resource.error_404, () => window.history.back, resource.error)
  }
  const handleNotFound = p && p.handleNotFound ? p.handleNotFound : _handleNotFound

  const _getModel = () => {
    const n = getModelName(refForm.current)
    if (props) {
      return (props as any)[n] || (state as any)[n]
    } else {
      return (state as any)[n]
    }
  }
  const getModel = p && p.getModel ? p.getModel : _getModel

  const back = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event) {
      event.preventDefault()
    }
    if (flag.newMode === true) {
      navigate(-1)
    } else {
      const obj = getModel()
      const diffObj = makeDiff(flag.originalModel, obj)
      const objKeys = Object.keys(diffObj)
      if (objKeys.length === 0) {
        navigate(-1)
      } else {
        const resource = p1.resource.resource()
        p1.confirm(
          resource.msg_confirm_back,
          () => {
            navigate(-1)
          },
          resource.confirm,
          resource.no,
          resource.yes,
        )
      }
    }
  }
  const _createModel = (): T => {
    const metadata = p && p.metadata ? p.metadata : service.metadata ? service.metadata() : undefined
    if (metadata) {
      const obj = createModel2<T>(metadata)
      return obj
    } else {
      const obj: any = {}
      return obj
    }
  }
  const createModel = p && p.createModel ? p.createModel : _createModel

  const create = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const obj = createModel()
    resetState(true, obj, undefined)
    const u = p1.ui
    if (u) {
      setTimeout(() => {
        u.removeFormError(refForm.current)
      }, 100)
    }
  }

  const _onSave = (isBack?: boolean) => {
    const resource = p1.resource.resource()
    if (p && p.readOnly) {
      if (flag.newMode === true) {
        p1.showError(resource.error_permission_add, undefined, resource.error_permission)
      } else {
        p1.showError(resource.error_permission_edit, undefined, resource.error_permission)
      }
    } else {
      if (running === true) {
        return
      }
      const obj = getModel()
      const metadata = p && p.metadata ? p.metadata : service.metadata ? service.metadata() : undefined
      let keys: string[] | undefined
      let version: string | undefined
      if (p && metadata && (!p.keys || !p.version)) {
        const meta = build(metadata)
        keys = p.keys ? p.keys : meta ? meta.keys : undefined
        version = p.version ? p.version : meta ? meta.version : undefined
      }
      if (flag.newMode) {
        validate(obj, () => {
          p1.confirm(
            resource.msg_confirm_save,
            () => {
              doSave(obj, undefined, version, isBack)
            },
            resource.confirm,
            resource.no,
            resource.yes,
          )
        })
      } else {
        const diffObj = makeDiff(flag.originalModel, obj, keys, version)
        const objKeys = Object.keys(diffObj)
        if (objKeys.length === 0) {
          p1.showMessage(resource.msg_no_change)
        } else {
          validate(obj, () => {
            p1.confirm(
              resource.msg_confirm_save,
              () => {
                doSave(obj, diffObj as any, version, isBack)
              },
              resource.confirm,
              resource.no,
              resource.yes,
            )
          })
        }
      }
    }
  }
  const onSave = p && p.onSave ? p.onSave : _onSave

  const save = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    event.persist()
    onSave()
  }

  const _validate = (obj: T, callback: (obj2?: T) => void) => {
    if (p1.ui) {
      const valid = p1.ui.validateForm(refForm.current, localeOf(undefined, p1.getLocale))
      if (valid) {
        callback(obj)
      }
    } else {
      callback(obj)
    }
  }
  const validate = p && p.validate ? p.validate : _validate

  const _succeed = (msg: string, origin: T, version?: string, isBack?: boolean, model?: T) => {
    if (model) {
      setFlag({ newMode: false })
      if (model && flag.setBack === true) {
        resetState(false, model, clone(model))
      } else {
        handleVersion(origin, version)
      }
    } else {
      handleVersion(origin, version)
    }
    p1.showMessage(msg)
    if (isBack) {
      back(undefined)
    }
  }
  const succeed = p && p.succeed ? p.succeed : _succeed

  const _fail = (result: ErrorMessage[]) => {
    const resource = p1.resource.resource()
    const f = refForm.current
    const u = p1.ui
    if (u && f) {
      const unmappedErrors = u.showFormError(f, result)
      focusFirstError(f)
      if (unmappedErrors && unmappedErrors.length > 0) {
        const t = resource.error
        if (p1.ui && p1.ui.buildErrorMessage) {
          const msg = p1.ui.buildErrorMessage(unmappedErrors)
          p1.showError(msg, undefined, t)
        } else {
          p1.showError(unmappedErrors[0].field + " " + unmappedErrors[0].code + " " + unmappedErrors[0].message, undefined, t)
        }
      }
    } else {
      const t = resource.error
      if (result.length > 0) {
        p1.showError(result[0].field + " " + result[0].code + " " + result[0].message, undefined, t)
      } else {
        p1.showError(t, undefined, t)
      }
    }
  }
  const fail = p && p.fail ? p.fail : _fail

  const _handleError = function (err: any) {
    if (err) {
      const resource = p1.resource.resource()
      setRunning(false)
      hideLoading(p1.loading)
      const errHeader = resource.error
      const errMsg = resource.error_internal
      const data = err && err.response ? err.response : err
      if (data.status === 400) {
        const errMsg = resource.error_400
        p1.showError(errMsg, undefined, errHeader)
      } else {
        p1.showError(errMsg, undefined, errHeader)
      }
    }
  }
  const handleError = p && p.handleError ? p.handleError : _handleError

  const _postSave = (r: number | T | ErrorMessage[], origin: T, version?: string, isPatch?: boolean, backOnSave?: boolean) => {
    setRunning(false)
    const resource = p1.resource.resource()
    hideLoading(p1.loading)
    const x: any = r
    const successMsg = resource.msg_save_success
    const newMod = flag.newMode
    // const st = createEditStatus(p ? p.status : undefined);
    if (Array.isArray(x)) {
      fail(x)
    } else if (!isNaN(x)) {
      if (x > 0) {
        succeed(successMsg, origin, version, backOnSave)
      } else {
        if (newMod && x <= 0) {
          handleDuplicateKey()
        } else if (!newMod && x === 0) {
          handleNotFound()
        } else {
          const title = resource.error
          const err = resource.error_version
          p1.showError(err, undefined, title)
        }
      }
    } else {
      const result = r as T
      if (isPatch) {
        const keys = Object.keys(result as any)
        const a: any = origin
        for (const k of keys) {
          a[k] = (result as any)[k]
        }
        succeed(successMsg, a, undefined, backOnSave, a)
      } else {
        succeed(successMsg, origin, version, backOnSave, r as T)
      }
      p1.showMessage(successMsg)
    }
  }
  const postSave = p && p.postSave ? p.postSave : _postSave

  const _handleDuplicateKey = (result?: T) => {
    const resource = p1.resource.resource()
    p1.showError(resource.error_duplicate_key, undefined, resource.error)
  }
  const handleDuplicateKey = p && p.handleDuplicateKey ? p.handleDuplicateKey : _handleDuplicateKey

  const _doSave = (obj: T, body?: Partial<T>, version?: string, isBack?: boolean) => {
    setRunning(true)
    showLoading(p1.loading)
    const isBackO = isBack != null && isBack !== undefined ? isBack : false
    const patchable = p ? p.patchable : true
    if (flag.newMode === false) {
      if (service.patch && patchable !== false && body && Object.keys(body).length > 0) {
        service
          .patch(body)
          .then((res: number | T | ErrorMessage[]) => {
            postSave(res, obj, version, true, isBackO)
          })
          .catch(handleError)
      } else {
        service
          .update(obj)
          .then((res: number | T | ErrorMessage[]) => postSave(res, obj, version, false, isBackO))
          .catch(handleError)
      }
    } else {
      service
        .create(obj)
        .then((res: number | T | ErrorMessage[]) => postSave(res, obj, version, false, isBackO))
        .catch(handleError)
    }
  }

  const doSave = p && p.doSave ? p.doSave : _doSave

  const _load = (_id: ID | null, callback?: (m: T, showM: (m2: T) => void) => void) => {
    const id: any = _id
    if (id != null && id !== "") {
      setRunning(true)
      showLoading(p1.loading)
      service
        .load(id)
        .then((obj: T | null) => {
          if (!obj) {
            handleNotFound(refForm.current)
          } else {
            setFlag({ newMode: false, originalModel: clone(obj) })
            if (callback) {
              callback(obj, showModel)
            } else {
              showModel(obj)
            }
          }
          setRunning(false)
          hideLoading(p1.loading)
        })
        .catch((err: any) => {
          const data = err && err.response ? err.response : err
          const resource = p1.resource.resource()
          const title = resource.error
          let msg = resource.error_internal
          if (data && data.status === 422) {
            fail(err.response?.data)
            const obj = err.response?.data?.value
            if (obj) {
              callback ? callback(obj as T, showModel) : showModel(obj as T)
            }
          } else {
            if (data && data.status === 404) {
              handleNotFound(refForm.current)
            } else {
              if (data.status && !isNaN(data.status)) {
                msg = messageByHttpStatus(data.status, resource)
              }
              if (data && (data.status === 401 || data.status === 403)) {
                setReadOnly(refForm.current)
              }
              p1.showError(msg, undefined, title)
            }
          }
          setRunning(false)
          hideLoading(p1.loading)
        })
    } else {
      const obj = createModel()
      setFlag({ newMode: true, originalModel: undefined })
      if (callback) {
        callback(obj, showModel)
      } else {
        showModel(obj)
      }
    }
  }
  const load = p && p.load ? p.load : _load

  return {
    ...baseProps,
    back,
    refForm,
    ui: p1.ui,
    resource: p1.resource.resource(),
    flag,
    running,
    setRunning,
    showModel,
    getModelName,
    resetState,
    handleNotFound,
    getModel,
    createModel,
    create,
    save,
    onSave,
    // eslint-disable-next-line no-restricted-globals
    confirm,
    validate,
    showMessage: p1.showMessage,
    succeed,
    fail,
    postSave,
    handleDuplicateKey,
    load,
    doSave,
  }
}
