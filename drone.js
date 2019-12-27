"use strict"

const chalk   = require("chalk"),
      Discord = require("discord.js"),
      event   = require("./assimilator")



class Drone {
	constructor(id, token) {
		this.id = id
		this.token = token
		this.client = new Discord.Client()

		this.color = Math.floor(Math.random() * 16777215).toString(16) // Random hex color

		this.client.on("ready", () => {
			this.log(`Logged in as ${this.client.user.tag}.`)

		})

		event.on("say", (channelId, thingToSay) => {
			const channel = this.client.channels.get(channelId)
			channel.send(thingToSay)
				.then( ({ content }) => this.log(`Said ${content}`))
		})

	}

	
	log(...args) {
		console.log(chalk.hex(`#${this.color}`)(`[DRONE] [${this.id}]`, ...args))
	}


	login() {
		this.log("Logging in...")
		this.client.login(this.token)
	}


	client() {
		return this.client
	}
}

module.exports = Drone
