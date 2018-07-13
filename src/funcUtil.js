
// Requirements for certain util functions
const {exec} = require('child_process')
const fs = require('fs')
//

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const regTest = regexString => testText => regexString.test(testText)

const remove = item => array => array.slice((array.indexOf(item) + 1), array.length)

const indexOf = item => array => array.indexOf(item)

const split = sep => str => str.split(sep);

const slice = (start, end) => str => str.slice(start, end);

const spaceSplit = split(' ')

const newLineSplit = split('\n')

const join = sep => array => array.join(sep)

const spaceJoin = join(' ')

const defaultJoin = join('')

const purify = x => JSON.parse(JSON.stringify(x))

const push = (x, array) => array.push(x)

const prop = property => object => object[property]

const equalModifier = modifier => prop => prop = modifier

const modObjKickBack = (prop, value) => object => {
  let newObj = purify(object)
  newObj[prop] = value
  return newObj
}

const boolValTranslator = val => val ? true : false

const getTodaysDateInUTC = () => {
  const tD = new Date()
  return `${tD.getUTCFullYear()}/${("0" + (tD.getUTCMonth() + 1)).slice(-2)}/${("0" + tD.getUTCDate()).slice(-2)}`
}

const checkIfDMOrPublic = (msg) => msg.split(' ')[1] ? msg.split(' ')[1] : msg.split(' ')[0] // if in DM the mssge has an added 'doge' string -> this gets rid of it

const returnTrue = () => true

const execPromise = cmd => new Promise( (resolve, reject) => {
  exec(cmd, function(err, stdout, stderr) {
    if (err) return reject(err)
    return resolve(stdout);
  });
});

const readFilePromise = credentialPath => new Promise( (resolve, reject) => {
  fs.readFile(credentialPath, (err, content) => {
    if (err) return reject(err)
    return resolve(content);
  })
});

module.exports = {
  boolValTranslator,
  indexOf,
  remove,
  compose,
  split,
  slice,
  regTest,
  purify,
  modObjKickBack,
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
  getTodaysDateInUTC
}
