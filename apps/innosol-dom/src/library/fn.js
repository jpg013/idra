// Usage : compose functions right to left
// compose(minus8, add10, multiply10)(4) === 42

// The resulting function can accept as many arguments as the first function does
// compose(add2, multiply)(4, 10) === 42

export const compose = (...fns) => {
  return fns.reduce((f, g) => (...args) => f(g(...args)));
};
