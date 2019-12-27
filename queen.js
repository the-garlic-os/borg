"use strict"

const chalk   = require("chalk"),
	  config  = require("./config"),
	  Drone   = require("./drone"),
	  event   = require("./assimilator")

class Queen extends Drone {
	constructor(id, token) {
		super(id, token)

		this.id = id

		super.client().on("message", async message => {
			const authorId = message.author.id

			if (!this.isBanned(authorId) // Not banned from using Schism
			&& (this.allowedIn(message.channel.id) // Channel is either whitelisted or is a DM channel
				|| message.channel.type === "dm")
			&& message.author.id !== super.client().user.id) { // Not self

				if (message.content.startsWith(config.PREFIX)){
					this.handleCommands(message)
				}
			}
		})


		super.client().on("guildCreate", guild => {
			this.log(`---------------------------------\nAdded to a new server.\n${guild.name} (ID: ${guild.id})\n${guild.memberCount} members\n---------------------------------`)
		})

		super.client().on("guildDelete", guild => {
			this.log(`---------------------------------\nRemoved from a server.\n${guild.name} (ID: ${guild.id})\n---------------------------------`)
		})
	}


	log(...args) {
		console.log(chalk.bold(`[QUEEN] [${this.id}] ${args.join(" ")}`))
	}
	

	login() {
		super.login()
	}


	randomUserId() {
		const index = ~~(Math.random() * userIdCache.length - 1)
		return userIdCache[index]
	}


	/**
	 * Parses a message whose content is presumed to be a command
	 *   and performs the corresponding action.
	 * 
	 * @param {Message} messageObj - Discord message to be parsed
	 * @return {Promise<string>} Resolve: name of command performed; Reject: error
	 */
	async handleCommands(message) {
		if (message.author.bot) return null // Don't take commands from bots

		this.log(`${this.location(message)} Received a command from ${message.author.tag}: ${message.content}`)

		const args = message.content.slice(config.PREFIX.length).split(/ +/)
		const command = args.shift().toLowerCase()

		const admin = this.isAdmin(message.author.id)
		switch (command) {
			case "allsay":
				if (!admin) break
				event.emit("say", message.channel.id, args.join(" "))
				break
		}
		return command
	}


	/**
	 * Sets the custom nicknames from the config file
	 * 
	 * @return {Promise<void>} Resolve: nothing (there were no errors); Reject: array of errors
	 */
	async updateNicknames(nicknameDict) {
		const errors = []

		for (const serverName in nicknameDict) {
			const [ serverId, nickname ] = nicknameDict[serverName]
			const server = super.client().guilds.get(serverId)
			if (!server) {
				this.log(`Nickname configured for a server that Schism is not in. Nickname could not be set in ${serverName} (${serverId}).`)
				continue
			}
			server.me.setNickname(nickname)
				.catch(errors.push)
		}

		if (errors.length > 0)
			throw errors
		else
			return
	}


	/**
	 * Get status name from status code
	 * 
	 * @param {number} code - status code
	 * @return {string} status name
	 */
	status(code) {
		return ["Playing", "Streaming", "Listening", "Watching"][code]
	}


	/**
	 * TODO: make this not comically unreadable
	 * 
	 * @param {string} mention - a string like "<@1234567891234567>"
	 * @return {string} user ID
	 */
	mentionToUserId(mention) {
		return (mention.startsWith("<@") && mention.endsWith(">"))
			? mention.slice(
				(mention.charAt(2) === "!")
					? 3
					: 2
				, -1
			)
			: null
	}


	/**
	 * Is [val] in [obj]?
	 * 
	 * @param {any} val
	 * @param {Object} object
	 * @return {Boolean} True/false
	 */
	has(val, obj) {
		for (const i in obj) {
			if (obj[i] === val)
				return true
		}
		return false
	}


	isAdmin(userId) {
		return this.has(userId, config.ADMINS)
	}


	isBanned(userId) {
		return this.has(userId, config.BANNED)
	}


	allowedIn(channelId) {
		return this.has(channelId, config.CHANNELS)
	}


	/**
	 * Is Object [obj] empty?
	 * 
	 * @param {Object} obj
	 * @return {Boolean} empty or not
	 */
	isEmpty(obj) {
		for (const key in obj) {
			if (obj.hasOwnProperty(key))
				return false
		}
		return true
	}


	/**
	 * Shortcut to a reusable message location string
	 * 
	 * @param {Message} message
	 * @return {string} - "[Server - #channel]" format string
	 */
	location(message) {
		return (message.channel.type == "dm")
			? `[Direct message]`
			: `[${message.guild.name} - #${message.channel.name}]`
	}
}

module.exports = Queen
