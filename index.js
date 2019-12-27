"use strict"

const config = require("./config"),
      Queen  = require("./queen"),
      Drone  = require("./drone"),
	  events = require("events")

const eventEmitter = new events.EventEmitter()


// Log errors when in production; crash when not in production
if (config.NODE_ENV === "production")
	process.on("unhandledRejection", logError)
else
	process.on("unhandledRejection", up => { throw up })


// Overwrite console methods with empty ones
if (config.DISABLE_LOGS) {
	const methods = ["log", "debug", "warn", "info", "table"]
    for (const method of methods) {
        console[method] = () => {}
    }
}


let counter = 0
const bots = []

bots.push(
	new Queen(counter, config.TOKENS[counter++], eventEmitter),
	new Drone(counter, config.TOKENS[counter++], eventEmitter),
	new Drone(counter, config.TOKENS[counter++], eventEmitter)
)

for (const bot of bots) {
	bot.login()
}


// --------------------------------------------------------------------------


/**
 * DM's garlicOS and logs error
 */
function logError(err) {
	console.error(err)
	const sendThis = (err.message)
		? `ERROR! ${err.message}`
		: `ERROR! ${err}`

	// Yes, I hardcoded my own user ID. I'm sorry.
	client.fetchUser("206235904644349953")
		.then(me => me.send(sendThis))
		.catch(console.error)
}
