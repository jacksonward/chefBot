# Chef++
### A lightning-fast groupme bot for fetching UARK campus eatery information

## Usage
### Get Menu
To fetch the menu of a dining hall, use '.[dining hall] [meal period]'
For example:

`.fulbright dinner`

will return a list of unique meal items to be served during lunch at Fulbright Dining Hall on that day.
The bot will respond with a message like this:

>Lunch at Fulbright Dining Hall will have the following: Herb Garlic Chicken, Steamed Broccoli, Roasted Yellow Squash, Sweet Corn on the Cob, garlic mashed potatoes, Char Grilled Teriyaki Chicken, Steamed Rice, Vegetable Stir Fry, Sesame Green Beans, Pork Egg Rolls.

### Search for item
To search dining halls for a certain menu item, use '.search [menu item]'
For example:

`.search chicken`

will return a formatted list of meal items matching or contained the requested menu item,
with information about where it is being served as well as during what period it will be served.
The bot will return up to two messages (one for each dining hall) like this:

>Brough Dining Hall:  
>Lunch ->  
>Orange Chicken | Wok of Fame  
>Chicken, Caramelized Onions | Platinum Grill  
>Herb Chicken Breast | The Green Table  
>Dinner ->  
>BBQ Chicken | Ark N Style Grub  
>Honey Ginger Glazed Chicken | Wok of Fame  
>Spicy Crispy Chicken Sandwich | Platinum Grill  

>Fulbright Dining Hall:  
>Lunch ->  
>Chicken with Lemon Herb Sauce | Culinary Table  
>Fried Chicken Sandwich | Grill  
>Grilled Chicken | Grill  
>Roasted Chicken | Skillet Ice Well  
>Curry Chicken Salad | Deli  
>Dinner ->  
>Chicken Marsala, Roasted Garlic | Entree  
>Fried Chicken | Culinary Table  
>Roasted Chicken | Skillet Ice Well  
>Curry Chicken Salad | Deli  
