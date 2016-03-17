# MicorosftHealth-lib

Microsoft API library for node.js


## Install

```sh
$ npm install --save microsofthealth-lib
```
## Client API

### Microsoft cloud API endpoints

#### MicrosoftHealth.getActivities(options, callback)
The options is a `option` object, and the callback is of the form `function(err, data)`. The `data` is the activites done by the user.

#### MicrosoftHealth.getSummaries(options, callback)
The options is a `option` object, and the callback is of the form `function(err, data)`. The `data` is the summary of the activities done by the user.

#### MicrosoftHealth.getProfile(options, callback)
The options is a `option` object, and the callback is of the form `function(err, data)`. The `data` is the profile detail of user.

#### MicrosoftHealth.getDevices(options, callback)
The options is a `option` object, and the callback is of the form `function(err, data)`. The `data` is the devices used by the user.
