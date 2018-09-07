
// Requirements for certain util functions
const {exec} = require('child_process')
const fs = require('fs')

// basic Maybe functor
class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  isNothing() {
    return this.$value === null || this.$value === undefined
  }

  constructor(x) {
    this.$value = x
  }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.$value))
  }

  inspect() {
    return this.isNothing() ? 'Nothing' : `Just ${this.$value}`
  }
}

// compose :: [fn] -> ((fn, fn) -> [fn] -> fn) -> fn
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

// regTest :: String -> String -> Boolean
const regTest = regexString => testText => regexString.test(testText)

// remove :: String -> [String] -> [String]
const remove = item => array => array.slice((array.indexOf(item) + 1), array.length)

// indexOf :: a -> [a] -> Number
const indexOf = item => array => array.indexOf(item)

// split :: String -> String -> [String]
const split = sep => str => str.split(sep);

// replace :: (String, String) -> String -> String
const replace = (whatToReplace, substitute) => str => str.replace(whatToReplace, substitute)

// slice :: (Number, Number) -> String -> String
const slice = (start, end) => str => str.slice(start, end);

const spaceSplit = split(' ')

const newLineSplit = split('\n')

// join :: String -> [a] -> String
const join = sep => array => array.join(sep)

const spaceJoin = join(' ')

const defaultJoin = join('')

// purify's the object
const purify = x => JSON.parse(JSON.stringify(x))

// push :: (a, b) -> b
const push = (x, array) => array.push(x)

// prop :: (String -> {a/b}) -> a/b
const prop = property => object => object[property]

// equalModifier :: (a/b -> a/b) -> a/b
const equalModifier = modifier => objProp => objProp = modifier

// modObjKickBack :: ((a/b, a/b) -> {a/b}) -> {a/b}
const modObjKickBack = (prop, value) => object => {
  let newObj = purify(object)
  newObj[prop] = value
  return newObj
}

const modObjArrPushKickBack = (prop, value) => object => {
  let newObj = purify(object)
  if (!newObj[prop]) newObj[prop] = []
  newObj[prop].push(value)
  return newObj
}

// boolValTranslator :: Condition -> Boolean
const boolValTranslator = val => val ? true : false

// getTodaysDateInUTC :: () -> String
const getTodaysDateInUTC = () => {
  const tD = new Date()
  return `${tD.getUTCFullYear()}/${("0" + (tD.getUTCMonth() + 1)).slice(-2)}/${("0" + tD.getUTCDate()).slice(-2)}`
}

// getTodaysDateInUTC :: () -> String
const checkIfDMOrPublic = (msg) => msg.split(' ')[1] ? msg.split(' ')[1] : msg.split(' ')[0] // if in DM the mssge has an added 'doge' string -> this gets rid of it

// returnTrue :: () -> Boolean
const returnTrue = () => true

// execPromise :: (fn -> Promise) -> String
const execPromise = cmd => new Promise( (resolve, reject) => {
  exec(cmd, function(err, stdout, stderr) {
    if (err) return reject(err)
    return resolve(stdout);
  });
});

// readFilePromise :: (fn -> Promise) -> String
const readFilePromise = credentialPath => new Promise( (resolve, reject) => {
  fs.readFile(credentialPath, (err, content) => {
    if (err) return reject(err)
    return resolve(content);
  })
});

// trim :: String -> String
const trim = str => str.trim()

module.exports = {
  Maybe,
  boolValTranslator,
  indexOf,
  remove,
  replace,
  compose,
  split,
  slice,
  regTest,
  purify,
  modObjKickBack,
  modObjArrPushKickBack,
  prop,
  equalModifier,
  spaceSplit,
  spaceJoin,
  newLineSplit,
  checkIfDMOrPublic,
  returnTrue,
  execPromise,
  readFilePromise,
  defaultJoin,
  getTodaysDateInUTC,
  trim,
  join
}
