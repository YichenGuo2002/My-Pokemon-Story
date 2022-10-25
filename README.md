# My Pokémon Story App 

## Overview

Pokémon is such a thing: you collect Pokémon cards as a kid, you watch Pokémon anime in elementary school, and you catch wild Pokémon with your friends in high school. You may not be able to say your first favorite Pokémon anymore, but the success of this brand has made Pokémon an unforgettable part of we Gen Z's childhood.

The My Pokémon Story app will let you keep those memories. This app can really do anything. Once logged in, you can list every Pokémon you've collected and your memories of them. You can also create your personalized Pokémon by giving it a name, weight, type, ability, and more. They are then uploaded to the Pokémon database and displayed to Pokémon lovers all over the world.

![Pokémon World](https://www.opticflux.com/wp-content/uploads/2021/11/Pokemon_UNITE___Team_Up._Take_Down.___Screenshot_1.0.jpeg)


## Data Model

The application will store Users, Lists and Pokémons.

* users can have multiple lists (via references)
* each list can have multiple Pokémons (by embedding)
* each Pokémon is an object with facts and pictures associated with it

An Example User:

```javascript
{
  username: "PokémonStan123",
  password: // a password hash,
  lists: [ list1, list2, list3 ]
}
```

An Example List with Embedded Pokémons:

```javascript
{
  user: // a reference to a User object
  name: "My Pokémon Go Journey ",
  pokemons: [
    {
     pokemon: //reference to a Pokémon object,
     description: "I found him in high school's parking lot. James also have one.",
     like: true,
     createdAt: // timestamp
    }
    {
     pokemon: //reference to a Pokémon object,
     description: "I taught mom how to use Pokémon Go and she caught her in our kitchen. It was so much fun!",
     like: false,
     createdAt: // timestamp
    }
  ],
  createdAt: // timestamp
}
```

An Example Pokémon:

```JSON
{
   "id": 1,
  "name": "cheri",
  "growth_time": 3,
  "max_harvest": 5,
  "natural_gift_power": 60,
  "size": 20,
  "smoothness": 25,
  "soil_dryness": 15,
  "firmness": {
   "name": "soft",
   "url": "https://pokeapi.co/api/v2/berry-firmness/2/"
    }
    "created_by": "system",
    "picture": "https://archives.bulbagarden.net/media/upload/thumb/a/a7/420Cherubi.png/375px-420Cherubi.png”
}
```

## [Link to Commented First Draft Schema](db.mjs) 

(__TODO__: create a first draft of your Schemas in db.mjs and link to it)

## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/all - page for showing all saved Pokémons 

![all](documentation/all.png)

/new - page for creating a personalized Pokémon

![new](documentation/new.png)

/list - page for showing all lists

![list](documentation/list.png)

/journey - page for creating Pokémon stories and exporting them

![journey](documentation/journey.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can browse and see the Pokémon database
2. as non-registered user, I can register a new account with the site
3. as a user, I can log in to the site
4. as a user, I can create a new Pokémon list
5. as a user, I can view all of the Pokémon lists I've created in a single list
6. as a user, I can add items to an existing Pokémon list and add a short descripton to it
7. as a user, I can delete items from an existing Pokémon list
8. as a user, I can export a Pokémon list with my descriptons in the JPG/PNG/PDF and other formats
9. as a user, I can create my own Pokémon to the Pokémon database

## Research Topics

* (3 points) Integrate user authentication
    * I'm going to be using email passport for user authentication
    * And account has been made for testing; I'll email you the password
    * I'm going to use external APIs to email you new passwords if you forgot your password
* (4 points) Perform client side form validation using a JavaScript library
    * if you put in a description that's longer than 300 characters, an error message will appear in the dom
    * if you create Pokémons with no attributes, an error message will appear when submitting
    * if you log in with wrong email-password pairs, an error message will appear when logging in
* (4 points) Find good API for Pokémon information and user authentication
    * I need to find an API that can send back all Pokémons' information
    * I need to find an API that can help send emails to users' emails for authentication
* (2 points) React
    * Research about React front-end framework

 13 points total out of 8 required points 

## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

