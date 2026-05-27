static createAssert(onSuccess = this.defaultOnSuccess, onError = this.defaultOnError, specificOutputs = {}) {
  return function (condition, message) {
    if (["string","number"].includes(typeof condition) && condition in specificOutputs) {
      return specificOutputs[condition](message);
    } else if (condition) {
      return onSuccess(message);
    } else {
      return onError(message);
    }
  }
}