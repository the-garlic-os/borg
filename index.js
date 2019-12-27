"use strict"

const config = require("./config"),
      Queen  = require("./queen"),
      Drone  = require("./drone")


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
	new Queen(counter, config.TOKENS[counter++]),
	new Drone(counter, config.TOKENS[counter++]),
	new Drone(counter, config.TOKENS[counter++])
)

for (const bot of bots) {
	bot.login()
}


// --------------------------------------------------------------------------


/**
 * DMs the admins and logs an error
 * 
 * @param {string} err - an error
 */
function logError(err) {
	console.error(err)

	// Only try to DM the admins if there is a bot to send from
	if (!bots[0]) return

	const sendThis = (err.message)
		? `ERROR! ${err.message}`
		: `ERROR! ${err}`

	// Bot's client variable
	// If it doesn't exist, get its superclass's client
	const client = bots[0].client || bots[0].super.client()

	for (const key in config.ADMINS) {
		const userId = config.ADMINS[key]
		client.fetchUser(userId)
			.then(user => user.send(sendThis))
			.catch(console.error)
	}

}
