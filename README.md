# hubot-doge-utility-functions

hubot-doge-utility-functions is a multi-purpose hubot utility package needed as a dependency in the doge-bot (a robust hubot housing several programs).

## Installation

`npm install --save hubot-doge-utility-functions`

In order to access the utility functions include them at the top of your JS file:

```
// using ES6 destructuring to instantiate FU and RBU
const {FU, RBU} = require('hubot-doge-utility-functions')
```
Then access them off of the `FU` and `RBU` objects:
```
module.exports = (robot) => {

  // hubot robot respond method
  robot.respond(/hello world/i, (msg) => {

    RBU.newUserCheckAndCreate(robot, msg.message.user.id)


  })
}

```
