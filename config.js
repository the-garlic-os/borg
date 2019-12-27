"use strict"

// Load environment variables to const config
// JSON parse any value that is JSON parseable
const config = require("./defaults")
for (const key in process.env) {
	try {
		config[key] = JSON.parse(process.env[key])
	} catch (e) {
		config[key] = process.env[key]
	}
}

module.exports = config
