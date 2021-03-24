import SuggestionListHelper from './suggestion-list-helper';

export default class CommonUtils extends SuggestionListHelper {
  alertOptions = {
    autoClose: true,
    visibleTime: 3,
    message: '',
    background: 'green',
  };

  getAlertElm() {
    return document.querySelector('.__alert');
  }

  openAlert() {
    const elm: any = this.getAlertElm();
    if (elm) {
      elm.style.top = '10px';
      if (this.alertOptions.autoClose) {
        setTimeout(() => {
          elm.style.top = '-1000px';
        }, this.alertOptions.visibleTime * 1000);
      }
    }
  }
}
