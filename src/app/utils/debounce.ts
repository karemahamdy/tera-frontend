/**
 * debounce calls a function when a user has not carried out an event in a specific amount of time,
 * throttle calls a function at intervals of a specified time while the user is carrying out an event.
 * For example, if we debounce the search function with a timer of 300 milliseconds,
 * the function is only called if the user did not perform a search in 300 milliseconds.
 * However, if we throttle the search function with 300 milliseconds, the function is called every 300 milliseconds as the user is typing.
 */

type AnyFunction = (...args: any[]) => any;

export function debounce<T extends AnyFunction>(fn: T, wait: number = 500): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    const context = this;
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

export function throttle<T extends AnyFunction>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let throttled = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!throttled) {
      fn.apply(this, args);
      throttled = true;
      setTimeout(() => {
        throttled = false;
      }, wait);
    }
  };
}
