import {setValue} from 'reflectx';
import {formatter} from 'ui-plus';
import {storage} from 'uione';
import {Locale} from 'uione';
import {UIService} from 'uione';
import {BaseViewComponent} from './BaseViewComponent';
import {HistoryProps} from './HistoryProps';
import {valueOf} from './util';

export class BaseComponent<W extends HistoryProps, I> extends BaseViewComponent<W, I> {
  constructor(props) {
    super(props);
    this.uiS1 = storage.ui();
    this.updateState = this.updateState.bind(this);
    this.updateFlatState = this.updateFlatState.bind(this);
    this.updatePhoneState = this.updatePhoneState.bind(this);
    this.updateDateState = this.updateDateState.bind(this);
    this.prepareCustomData = this.prepareCustomData.bind(this);
  }
  private uiS1: UIService;
  /*
  protected handleSubmitForm(e) {
    if (e.which === 13) {
      if (document.getElementById('sysAlert').style.display !== 'none') {
        document.getElementById('sysYes').click();
      } else {
        document.getElementById('btnSave').click();
      }
    } else if (e.which === 27) {
      document.getElementById('sysNo').click();
    }
  }
*/
  protected scrollToFocus = (e: any, isUseTimeOut = false) => {
    try {
      const element = e.target;
      const container = e.target.form.childNodes[1];
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2);
      const scrollTop = container.scrollTop;
      const timeOut = isUseTimeOut ? 300 : 0;
      const isChrome = navigator.userAgent.search('Chrome') > 0;
      setTimeout(() => {
        if (isChrome) {
          const scrollPosition = scrollTop === 0 ? (elementRect.top + 64) : (scrollTop + middle);
          container.scrollTo(0, Math.abs(scrollPosition));
        } else {
          container.scrollTo(0, Math.abs(scrollTop + middle));
        }
      }, timeOut);
    } catch (e) {
      console.log(e);
    }
  }

  prepareCustomData(data) { }

  protected updatePhoneState = (event) => {
    const re = /^[0-9\b]+$/;
    const value = formatter.removePhoneFormat(event.currentTarget.value);
    if (re.test(value) || !value) {
      this.updateState(event);
    } else {
      const splitArr = value.split('');
      let responseStr = '';
      splitArr.forEach(element => {
        if (re.test(element)) {
          responseStr += element;
        }
      });
      event.currentTarget.value = responseStr;
      this.updateState(event);
    }
  }

  protected updateDateState = (name, value) => {
    const props: any = this.props;
    const modelName = this.form.getAttribute('model-name');
    const state = this.state[modelName];
    if (props.setGlobalState) {
      const data = props.shouldBeCustomized ? this.prepareCustomData({ [name]: value }) : { [name]: value };
      props.setGlobalState({ [modelName]: { ...state, ...data } });
    } else {
      this.setState({[modelName]: {...state, [name]: value}});
    }
  }

  protected updateState = (e: any, callback?: any, locale?: Locale) => {
    const props: any = this.props;
    const ctrl = e.currentTarget;
    const updateStateMethod = props.setGlobalState;
    const modelName = ctrl.form.getAttribute('model-name');
    const propsDataForm = props[modelName];
    const type = ctrl.getAttribute('type');
    const isPreventDefault = type && (['checkbox', 'radio'].indexOf(type.toLowerCase()) >= 0 ? false : true);
    if (isPreventDefault) {
      e.preventDefault();
    }
    if (
      ctrl.nodeName === 'SELECT' &&
      ctrl.value &&
      ctrl.classList.contains('invalid')) {
      this.uiS1.removeErrorMessage(ctrl);
    }
    if (updateStateMethod) {
      const form = ctrl.form;
      const formName = form.name;
      if (!locale) {
        locale = this.getLocale();
      }
      const res = valueOf(ctrl, locale, e.type);
      if (res.mustChange) {
        const dataField = ctrl.getAttribute('data-field');
        const field = (dataField ? dataField : ctrl.name);
        if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
          const data = props.shouldBeCustomized ? this.prepareCustomData({ [ctrl.name]: res.value }) : { [ctrl.name]: res.value };
          props.setGlobalState({ [formName]: { ...propsDataForm, ...data } });
        } else {
          setValue(propsDataForm, field, ctrl.value);
          props.setGlobalState({ [formName]: { ...propsDataForm } });
        }
      }
    } else {
      const form = ctrl.form;
      if (form) {
        if (modelName && modelName !== '') {
          const ex = this.state[modelName];
          const dataField = ctrl.getAttribute('data-field');
          const field = (dataField ? dataField : ctrl.name);
          const model = Object.assign({}, ex);
          if (type && type.toLowerCase() === 'checkbox') {
            const ctrlOnValue = ctrl.getAttribute('data-on-value');
            const ctrlOffValue = ctrl.getAttribute('data-off-value');
            const onValue = ctrlOnValue ? ctrlOnValue : true;
            const offValue = ctrlOffValue ? ctrlOffValue : false;

            model[field] = ctrl.checked ? onValue : offValue;
            const objSet = {};
            objSet[modelName] = model;
            if (callback) {
              this.setState(objSet, callback);
            } else {
              this.setState(objSet);
            }
          } else if (type && type.toLowerCase() === 'radio') {
            if (field.indexOf('.') < 0 && field.indexOf('[') < 0 ) {
              model[field] = ctrl.value;
            } else {
              setValue(model, field, ctrl.value);
            }
            const objSet = {};
            objSet[modelName] = model;
            if (callback) {
              this.setState(objSet, callback);
            } else {
              this.setState(objSet);
            }
          } else {
            const tloc = (!locale ? this.getLocale() : locale);
            const data = valueOf(ctrl, tloc, e.type);

            if (data.mustChange) {
              if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
                model[field] = data.value;
              } else {
                setValue(model, field, data.value);
              }
              const objSet = {};
              objSet[modelName] = model;
              if (callback) {
                this.setState(objSet, callback);
              } else {
                this.setState(objSet);
              }
            }
          }
        } else {
          this.updateFlatState(e, callback);
        }
      } else {
        this.updateFlatState(e, callback);
      }
    }
  }

  private updateFlatState(e: any, callback?: () => void, locale?: Locale) {
    const ctrl = e.currentTarget;
    const stateName = ctrl.name;
    const objSet = {};
    const type = ctrl.getAttribute('type');
    if (type && type.toLowerCase() === 'checkbox') {
      if (ctrl.id && stateName === ctrl.id) {
        const origin = this.state[stateName];
        objSet[stateName] = (origin ? !origin : true);
        this.setState(objSet);
      } else {
        let value = this.state[stateName];
        value.includes(ctrl.value) ? value = value.filter(v => v !== ctrl.value) : value.push(ctrl.value);
        this.setState({ [ctrl.name]: value });
      }
    } else {
      const tloc = (!locale ? this.getLocale() : locale);
      const data = valueOf(ctrl, tloc, e.type);
      if (data.mustChange) {
        objSet[stateName] = data.value;
        if (callback) {
          this.setState(objSet, callback);
        } else {
          this.setState(objSet);
        }
      }
    }
  }
}
