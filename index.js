const express = require('express')
const port = 8000
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const got = require ('got')

//Define base URL, we will append queries to this api reference
const BASE_URL = 'https://api.dineoncampus.com/v1/location/menu?site_id=5751fd2590975b60e04891fe&platform=0&'

// Be sure to change botId for testing and production
const botId = "134ad64e73ea10a1b5d038c45a"

//Initialize global menu object
let menu = {}

function getDate(date) {
	//Gets a date string formatted properly for the api requests
	//Format is YYYY/MM/DD
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	return (year + '-' + month + '-' + day)
}

async function fReq(locID, date) {
	const reqURL = (BASE_URL + 'location_id=' + locID + '&date=' + date)
	const response = await got(reqURL)
	const json = await JSON.parse(response.body)
	return json
}

async function getMenu(location, date) {
	menu[location.name] = {}
	let json = await fReq(location.id, date)
	if (json.menu !== undefined) {
		let periods = json.menu.periods.map(async(el) => {
			menu[location.name][el.name] = {}
			let categories = el.categories.map(async(cat) => {
				menu[location.name][el.name][cat.name] = []
				let items = cat.items.map(async(item) => {
					menu[location.name][el.name][cat.name].push(item.name)

				})
			})
			return
		})
		Promise.all(periods).then((periods) => {
		}).catch((error) => {
			console.log(error)
		})
	}
}

async function run() {
	//get and format date for use in api requests
	const date = getDate(new Date())
	const response = await got('https://api.dineoncampus.com/v1/locations/all_locations?site_id=5751fd2590975b60e04891fe&platform=0')
	const json = await JSON.parse(response.body)
	//Store location data in array so that we can query the api with it later
	locations = await json.locations.map(loc => {
		return ({name: loc.name, id: loc.id})
	})
	locations.forEach((location) => {
		getMenu(location, date).catch((error) => {
			console.log(error)
		})
	})
}

//run for the first time
run()
//run again every hour to constantly update menu
setInterval(() => {run()}, 3600000)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

function broadcast(message) {
	// make the bot wait a little because its so darn fast! :)
	setTimeout(() => {
		request.post(
			"https://api.groupme.com/v3/bots/post",
			{ json: { "bot_id": botId, "text": message}}
		)
	}, 500)
}

const variations = {
	fulbright: [
	'fulbright',
	'fullbright'
	],
	brough: [
	'brough',
	],
}

/*A function to handle user messages so that the location names match
those that are in the global menu object, BE VERY CAREFUL to replace
variations with the CORRECT location name that exists in the menu object*/
function sanitize(string) {
	let message = string
	
	variations.fulbright.forEach((variation) => {
		message = message.replace(variation, 'fulbright dining hall')
	})
	variations.brough.forEach((variation) => {
		message = message.replace(variation, 'brough dining hall')
	})

	return message
}

// April Fools!
function aprilFools(location, period) {

	let grossStuff = ['Fried Worms', 'A normal burger but the cheese is moldy', 'A burger where everything is expired but the cheese is fine', 'Literal feces w/ rum sauce', 'Cold-ass Broccoli', 'Poppy-seed Beagle', 'Sheep\'s head', 'Pasta with toenail clippings', 'Garlic Mashed Potatoes, because heaven forbid we ever have regular mashed potatoes', 'Raw pork chops', 'Plastic-flavored Poptarts', 'Fermented Shark', 'Shell-in Sea Turtle', 'Miscellaneous Jelly Beans', 'Glob of dip-spit', 'Goat eye spread on toast', 'Barnacles', 'Curry Pancakes', 'Cod dipped in Seawater', '[Insert mediocre mexican food that no one really likes, but the other lines actually manage to be worse, so, what the hell]', 'Four Cheese Lasgna, but every cheese is cheddar', 'Bear Back Ribs', 'Canned Macaroni & Cheese', 'Mayonaise Sandwiches', 'Raw Oysters', 'Thousand Year Old Eggs', 'Mustard Pie']

	function shuffle(array) {
	  	var currentIndex = array.length, temporaryValue, randomIndex;
	  	// While there remain elements to shuffle...
	  	while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
	  	}
  		return array;
	}

	let shuffledStuff = shuffle(grossStuff)
	shuffledStuff = shuffledStuff.slice(0, 6)

	let menuItemsString = shuffledStuff.join(', ')
	let response = `${period} at ${location} will have the following: ${menuItemsString}.`

	return response
}

function readMenu(location, period) {
	
	let time = period.toLowerCase()
	let categories

	if (location == "Brough Dining Hall") {
		switch (time) {
			case "breakfast":
			categories = ["Breakfast", "Culinary Table", "Pastry"]
				break
			case "lunch":
			categories = ["Ark N Style Grub", "Wok of Fame", "Platinum Grill"]
				break
			case "dinner":
			categories = ["Ark N Style Grub", "Wok of Fame", "Platinum Grill"]
				break
			default:
			categories = ["Ark N Style Grub", "Wok of Fame", "Platinum Grill"]
		}
	}
	
	if (location == "Fulbright Dining Hall") {
		switch (time) {
			case "breakfast":
			categories = ["Breakfast", "Culinary Table", "Pastry"]
				break
			case "lunch":
			categories = ["Entree", "Culinary Table"]
				break
			case "dinner":
			categories = ["Entree", "Culinary Table"]
				break
			default:
			categories = ["Entree", "Culinary Table"]
		}
	}

	let menuItemsArray = []
	categories.forEach((category) => {
		for (var line in menu[location][period]) {
			if (menu[location][period].hasOwnProperty(line)) {

				// If the name of the line in the global menu object matches
				// one of the category names that we want to look at...
				if (line == category) {
					// Push the items of that line to our menuItems variable
					menu[location][period][line].forEach((item) => {
						menuItemsArray.push(item)
					})
				}
			}
		}
	})

	let menuItemsString = menuItemsArray.join(', ')
	let response = `${period} at ${location} will have the following: ${menuItemsString}.`

	return response
}

// Search dining halls for menu item
function find(string) {

	if (string.length < 3) {
		console.log('cannot search for a string shorter than 3 characters')
		return
	}
	
	// Search fulbright
	const search = (location) => {
		let items = []		// item to be found
		let locations = [] 	// locations to be found at
		let times = [] 		// times available
		let lines = [] 		// lines to be found in
		for (var period in menu[location]) {
			if (menu[location].hasOwnProperty(period)) {
				for (var category in menu[location][period]) {
					if (menu[location][period].hasOwnProperty(category)) {
						menu[location][period][category].forEach((item) => {
							if (item.toLowerCase().includes(string.toLowerCase())) {
								items.push(item)
								times.push(period)
								lines.push(category)
							}
						})
					}
				}
			}
		}
		let responses = {
			Breakfast: [],
			Lunch: [],
			Dinner: []
		}

		items.forEach((item, index) => {
			responses[times[index]].push(`${items[index]} | ${lines[index]}`)
		})

		// Declare response
		let responseString = `${location}:\r\n`
		for (var time in responses) {
			if (responses.hasOwnProperty(time)) {

				if (responses[time] == undefined || responses[time].length == 0) {
					// Do nothing
				} else {
					responseString += `${time} -> \r\n`

					responses[time].forEach((el) => {
						responseString += `${el}\r\n`
					})

					responseString += `\r\n`
				}
			}
		}
		return responseString
	}
	broadcast(search('Fulbright Dining Hall'))
	broadcast(search('Brough Dining Hall'))
}

app.post('/', function(req, res) {
	var sender = req.body.name
	var message = (req.body.text).toLowerCase()
	console.log("Got message from " + sender + " that says: " + message)
	if (sender !== 'Chef++' && sender !== 'chefTest') {
		if (message.startsWith('.debug')) {
			console.log(menu)
			return
		}

		if (message.startsWith('.')) {
			// sanitize user input to accept common variations of location names
			// Ex. "fulbright" becomes "fulbright dining hall", which the bot can use
			message = sanitize(message)		

			if (message.startsWith('.search')) {
				// split the message into words to get item argument
				let messageArray = message.split(" ")
				let itemArgument = messageArray[1]
				// find the item and broadcast the result || two messages
				find(itemArgument)
				return
			}

			let foundLoc
			let foundPeriod
			for (var location in menu) {
				if (menu.hasOwnProperty(location)) {
					if (message.startsWith(`.${location.toLowerCase()}`)) {
						foundLoc = location
					}
				}
			}
			if (foundLoc) {
				for (var period in menu[foundLoc]) {
					if (menu[foundLoc].hasOwnProperty(period)) {
						if (message.startsWith(`.${foundLoc.toLowerCase()} ${period.toLowerCase()}`)) {
							foundPeriod = period
						}
					}
				}
				console.log(`Fetching ${foundPeriod} menu at ${foundLoc}`)
			} 
			if (foundPeriod == undefined || foundLoc == undefined) {
				broadcast('To fetch a menu, use ".[location][period]" (Ex. ".fulbright dinner")')
			}

			// Declare response that bot will send to chat
			// let response = readMenu(foundLoc, foundPeriod)

			// April fools!!
			let response = aprilFools(foundLoc, foundPeriod)
			broadcast(response)
		}
	}
})
app.listen(port, () => console.log(`The Chef is listening on port ${port}!`))

// setTimeout(() => {

// }, 10000)