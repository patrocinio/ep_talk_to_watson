# ep_CollabTicker
## Function
Inserts the current localtime when the user types a the string defined in `triggerSequence` at the beginning of a line.
There is a very simple time-offset-correction implemented, which is triggered every `updateInterval` milliseconds.  

## Settings
```JSON
"ep_CollabTicker" : {
                         "updateInterval": "30000",
                         "triggerSequence": "###",
                       }
```
Sub-Settings:

* `updateInterval`, defaults to `30000`, `-1` means no auto-updating, the interval in which the time-offset gets updated
* `triggerSequence`, defaults to `###`, the characters the user has to write to trigger a timestamp-insertation
