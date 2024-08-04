const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

async function batchInsert(knex, table, data, batchSize = 100) {
  for (let i = 0; i < data.length; i += batchSize) {
    await knex(table).insert(data.slice(i, i + batchSize));
  }
}

exports.seed = async function(knex) {
  // Purge ALL existing entries
  await knex('users').del();
  await knex('cities').del();
  await knex('journal_entries').del();
  await knex('positive_reinforcement_messages').del();

  // Then add new users
  await knex('users').insert([
    { id: 1, name: 'Billy', username: 'billy', 
      password: await bcrypt.hash('test', 10), max_streak: 0, 
      current_streak: 3, location: 'Berkeley'},
    { id: 2, name: 'Bob', username: 'bob', 
      password: await bcrypt.hash('test', 10), max_streak: 0, 
      current_streak: 0, location: 'Berkeley' },
    { id: 3, name: 'Joe', username: 'joe', password: await bcrypt.hash('test', 10), 
      max_streak: 0, current_streak: 0, location: 'Berkeley' },
  ]);

  await knex('journal_entries').insert([
    { user_id: 1, entry_date: new Date('2024-07-26').toISOString().split('T')[0], entry: 'Had a great day working on my project. Made some good progress!' },
    { user_id: 1, entry_date: new Date('2024-07-28').toISOString().split('T')[0], entry: 'Feeling a bit tired today. Need to get more sleep.' },
    { user_id: 2, entry_date: new Date('2024-07-29').toISOString().split('T')[0], entry: 'Busy day at work. Managed to finish all my tasks.' },
    { user_id: 2, entry_date: new Date('2024-07-27').toISOString().split('T')[0], entry: 'Took a long walk in the park. It was refreshing.' },
    { user_id: 3, entry_date: new Date('2024-07-28').toISOString().split('T')[0], entry: 'Did some reading and had a quiet day.' },
    { user_id: 3, entry_date: new Date('2024-07-26').toISOString().split('T')[0], entry: 'Worked on a new hobby project. Feeling excited about it!' }
  ]);

  // Fetch cities data and process to remove duplicates
  const response = await fetch('https://countriesnow.space/api/v0.1/countries');
  const data = await response.json();
  const cities = data.data.reduce((acc, country) => acc.concat(country.cities), []);

  // Remove duplicates
  const uniqueCities = Array.from(new Set(cities));

  // Prepare data for insertion
  const citiesData = uniqueCities.map((city, index) => ({ id: index + 1, name: city }));

  // Insert unique cities data into the database in batches
  await batchInsert(knex, 'cities', citiesData);

  // JSON data for positive reinforcement messages
  const positiveReinforcementMessages = {
    "1": [
      "You’ve started your journey with a bang! 💥 The universe just noticed!",
      "One step forward, keep it up! 👣 Your footprints are making history!",
      "You’re off to a fantastic start! 🎉 Confetti is in the air!"
    ],
    "2": [
      "Double the effort, double the reward! 🎖️ You deserve a medal for each day!",
      "Two days in a row, you’re on the go! 🏃 Faster than a speeding bullet!",
      "Keep up the great work! 💪 You’re flexing those motivation muscles!"
    ],
    "3": [
    "You’re on fire! 🔥 Did someone call the fire department?",
    "Hat-trick of excellence! 🎩 You’ve got magic in your streak!",
    "Three cheers for three days! 🍻 Even your drinks are celebrating!"
  ],
  "4": [
    "You’re fantastic! 🌼 Blooming like a flower in spring!",
    "Keep rolling! 🎳 Striking down obstacles like pins!",
    "You’re clovering it! 🍀 Lucky charm vibes all around!"
  ],
  "5": [
    "High five! ✋ Your hand deserves a standing ovation!",
    "You’re shining bright! ✨ Glitter follows you everywhere!",
    "Five days of awesomeness! 🦄 You’ve got unicorn magic in you!"
  ],
  "6": [
    "You’re unstoppable! 🛡️ Even a knight’s armor can’t compare!",
    "Keep soaring! 🦅 Your streak is reaching eagle heights!",
    "Super six streak! 🎯 Bullseye every single day!"
  ],
  "7": [
    "Lucky seven, you’re in heaven! 😇 Angels are cheering for you!",
    "You’re a star! ⭐ Hollywood called, they want your autograph!",
    "A week of wonders! 🌈 Rainbows are just for you!"
  ],
  "8": [
    "You’re great! 🎈 Balloon-worthy achievements!",
    "Infinity symbol for your streak! ♾️ Endless possibilities ahead!",
    "Eight days of awesomeness! 🦋 Butterflies are fluttering in celebration!"
  ],
  "9": [
    "You’re fine! 👌 Cooler than a cucumber!",
    "Cloud nine, you’re flying high! ☁️ Even the clouds envy your streak!",
    "Nine days of shine! ✨ You’re sparkling brighter than a disco ball!"
  ],
  "10": [
    "Perfect ten, you’re amazing! 💯 Score 100 in the game of life!",
    "You’re a champion! 🏆 Olympic-level streaking!",
    "You’re legendary! 🦸 Superheroes look up to you!"
  ],
  "11": [
    "You’re excelling! 🚀 NASA called, they want their rocket back!",
    "Pure magic! ✨ Houdini would be jealous!",
    "Eleven days of success! 🏅 You’re a walking gold medal!"
  ],
  "12": [
    "You’re dazzling! 💫 Stars wish they could shine like you!",
    "You’re unstoppable! 🐉 Dragons have nothing on you!",
    "A dozen days of dedication! 📅 Calendar’s new favorite day!"
  ],
  "13": [
    "You’re rocking it! 🎸 Your streak has its own theme song!",
    "You’re stellar! 🌠 Shooting stars follow your lead!",
    "Thirteen days of triumph! 🏅 Your trophy shelf is overflowing!"
  ],
  "14": [
    "You’re on fire! 🔥 Firefighters are on standby!",
    "Keep flying! 🦅 Soaring above the clouds like an eagle!",
    "Two weeks of winning! 🏅 You’re a fortnight phenomenon!"
  ],
  "15": [
    "You’re fantastic! 🌼 The flower of persistence!",
    "Fabulous feats! 🎉 You’re a celebration sensation!",
    "Halfway to thirty, you’re unstoppable! 🚀 Astronauts envy your journey!"
  ],
  "16": [
    "You’re a superhero! 🦸‍♂️ Capes and all!",
    "Sixteen days of sweetness! 🍭 Candy land welcomes you!",
    "You’re soaring! ✈️ Airlines want you as their mascot!"
  ],
  "17": [
    "You’re shining bright! ✨ Your glow lights up the night!",
    "You’re a star! ⭐ Constellations rearrange for you!",
    "Seventeen days of stellar success! 🌠 The cosmos applaud you!"
  ],
  "18": [
    "You’re unstoppable! 🛡️ Shields up, nothing can stop you!",
    "Eighteen days of excellence! 🏆 Victory laps around the sun!",
    "You’re a legend! 🦸‍♀️ Stories will be told of your streak!"
  ],
  "19": [
    "You’re phenomenal! 🌟 Even supernovas can’t outshine you!",
    "Nineteen days of magic! ✨ Wands wave in your honor!",
    "You’re a rockstar! 🎸 World tours await!"
  ],
  "20": [
    "You’re extraordinary! 🌟 Beyond the ordinary, into the extraordinary!",
    "Twenty days, you’re amazing! 😍 Hearts flutter for your streak!",
    "You’re unstoppable! 🚀 Rocketing through the days!"
  ],
  "21": [
    "Your streak is now old enough to party! 🎉🍹",
    "Blackjack! You're winning at life! 🃏",
    "21 days and you’re a legal streaker! 👑"
  ],
  "22": [
    "Double twos, you’re breaking news! 📺",
    "Quack! You’re as cool as two little ducks! 🦆🦆",
    "22 days, and you're doubling the fun! 🥳"
  ],
  "23": [
    "MJ status! You've hit the big leagues! 🏀",
    "You’re a 23-karat diamond! 💎",
    "23 days, and you’re the GOAT! 🐐"
  ],
  "24": [
    "24 days, you’re the key to success! 🔑",
    "Your streak is as fresh as 24-hour news! 📰",
    "24 days, and you’re a round-the-clock star! 🕰️"
  ],
  "25": [
    "Quarter-century streak! You’re timeless! ⏰",
    "You’ve hit a quarter of a hundred! 💯",
    "25 days, and you’re silver! 🥈"
  ],
  "26": [
    "26 letters in the alphabet, you’ve spelled success! 🔠",
    "26 days, you’re acing this! 🅰️",
    "Your streak is as strong as titanium! 🏋️"
  ],
  "27": [
    "27 days, you're rocking the universe! 🌌",
    "Double lucky sevens with a twist! 🍀🎲",
    "You’re a 27-piece orchestra of awesomeness! 🎻"
  ],
  "28": [
    "Four weeks of fantastic! 📅",
    "You’re a lunar cycle of success! 🌙",
    "28 days, you’re in orbit! 🛰️"
  ],
  "29": [
    "29 days, you’re almost unstoppable! 🚧",
    "Leap day streak! 🐸",
    "29 days, and you’re out of this world! 👽"
  ],
  "30": [
    "30 days, you’re on the throne! 👑",
    "Three decades of dedication! 📜",
    "30 days, you’re a legend in the making! 📖"
  ],
  "31": [
    "31 flavors of fantastic! 🍦",
    "31 days, you’re a masterpiece! 🎨",
    "Your streak is as magical as Halloween! 🎃"
  ],
  "32": [
    "32 teeth in a smile, you’re grinning wide! 😁",
    "32 days, you’re double dynamite! 💥💥",
    "You’ve got a 32-bit streak! 🖥️"
  ],
  "33": [
    "33 degrees of cool! 🆒",
    "33 days, and you’re a master! 🎓",
    "You’re a triple threat of awesomeness! 🎬"
  ],
  "34": [
    "34 days, you’re golden! 🥇",
    "You’ve got a streak as grand as Route 34! 🛣️",
    "34 days, you’re a comet blazing through! ☄️"
  ],
  "35": [
    "High five for 35! 🙌",
    "You’re thriving at 35! 🌱",
    "35 days, you’re a hero! 🦸‍♂️"
  ],
  "36": [
    "36 days, you’re triple the charm! 🍀🍀🍀",
    "Your streak is as perfect as a six-sided die! 🎲",
    "36 days, you’re magical! 🧙‍♂️"
  ],
  "37": [
    "37 days, you’re a marvel! 🦸‍♀️",
    "Your streak is as amazing as the 37th wonder! 🏛️",
    "37 days, you’re on a roll! 🥐"
  ],
  "38": [
    "38 days, you’re outshining the sun! 🌞",
    "Your streak is as groovy as the 70s! 🕺",
    "38 days, you’re in the spotlight! 🎤"
  ],
  "39": [
    "39 days, you’re a champion! 🏅",
    "You’re soaring high at 39! 🦅",
    "39 days, you’re dazzling! 💎"
  ],
  "40": [
    "40 days, you’re a pro! 🏌️",
    "You’re as fabulous as 40 winks! 😴",
    "40 days, you’re unstoppable! 💨"
  ],
  "41": [
    "41 days, you’re a legend! 🧝‍♂️",
    "Your streak is as epic as 41 tales! 📚",
    "41 days, you’re unbeatable! 🥋"
  ],
  "42": [
    "42 days, you’ve found the answer to everything! 🌌",
    "Your streak is as infinite as the universe! 🪐",
    "42 days, you’re extraordinary! 🌟"
  ],
  "43": [
    "43 days, you’re a wizard! 🧙‍♀️",
    "Your streak is as smooth as 43 melodies! 🎶",
    "43 days, you’re a shooting star! 🌠"
  ],
  "44": [
    "44 days, you’re double the trouble! 👯‍♂️",
    "You’re as radiant as 44 sunrises! 🌅",
    "44 days, you’re a shining beacon! 🚨"
  ],
  "45": [
    "45 days, you’re a master! 🧩",
    "Your streak is as delightful as 45 cupcakes! 🧁",
    "45 days, you’re a star performer! 🎭"
  ],
  "46": [
    "46 days, you’re a trailblazer! 🛤️",
    "Your streak is as impressive as 46 fireworks! 🎆",
    "46 days, you’re a sensation! 🌍"
  ],
  "47": [
    "47 days, you’re unstoppable! 🏇",
    "Your streak is as dazzling as 47 gemstones! 💎",
    "47 days, you’re an icon! 🖼️"
  ],
  "48": [
    "48 days, you’re fantastic! 🦩",
    "Your streak is as epic as 48 legends! 🗡️",
    "48 days, you’re a marvel! 🏆"
  ],
  "49": [
    "49 days, you’re phenomenal! 🌟",
    "Your streak is as splendid as 49 sunsets! 🌇",
    "49 days, you’re a wizard! 🧙‍♂️"
  ],
  "50": [
    "50 days, you’re a superstar! 🌟",
    "Half a century of streaking! 🎉",
    "50 days, you’re extraordinary! 🏅"
  ],
  "ABOVE50": [
    "You’re on a streak hotter than a jalapeño! 🌶️",
    "Your streak is more epic than a blockbuster! 🍿",
    "You’re a streak wizard, casting spells of success! 🧙‍♂️",
    "Your dedication is as powerful as a thunderstorm! ⛈️",
    "You’re a streak maestro, orchestrating greatness! 🎼",
    "Your streak is cooler than a polar bear in sunglasses! 🐻‍❄️🕶️",
    "You’re a streak champion, flexing those success muscles! 💪",
    "Your achievements shine brighter than a disco ball! 🕺💃",
    "You’re a legend with a streak that’s pure magic! ✨",
    "Your streak is as sweet as a slice of pie! 🥧",
    "You’re a success storm, making waves everywhere! 🌊",
    "Your dedication is more solid than a rock! 🪨",
    "You’re a streak superstar, shining like a supernova! 🌟",
    "Your streak is like a treasure chest of awesomeness! 🗝️",
    "You’re a streak explorer, discovering new heights! 🧭",
    "Your achievements are as grand as a royal feast! 🍗",
    "You’re a streak sensation, rocking the house! 🎸",
    "Your streak is smoother than a velvet ribbon! 🎀",
    "You’re a success juggernaut, rolling through challenges! 🚂",
    "Your dedication is like a cozy blanket on a cold day! 🛏️",
    "You’re a streak pioneer, blazing new trails! 🚀",
    "Your streak is as dazzling as a fireworks display! 🎆",
    "You’re a master of streaks, painting success on every canvas! 🎨",
    "Your achievements are as delightful as a candy store! 🍭",
    "You’re a streak sensation, as fresh as morning dew! 🌅",
    "Your streak is like a golden ticket to success! 🎫",
    "You’re a success superstar, shining brighter than a comet! ☄️",
    "Your streak is like a parade of achievements! 🎊",
    "You’re a streak ace, hitting every target! 🎯",
    "Your dedication is as vibrant as a rainbow! 🌈",
    "You’re a success maestro, conducting a symphony of wins! 🎻",
    "Your streak is as mighty as a lion’s roar! 🦁",
    "You’re a streak champion, taking gold in every event! 🥇",
    "Your achievements are as magical as a unicorn’s horn! 🦄",
    "You’re a streak virtuoso, performing with excellence! 🎹",
    "Your dedication is like a beacon guiding ships to shore! 🚢",
    "You’re a success ninja, stealthily conquering challenges! 🥷",
    "Your streak is a festival of achievements! 🎠",
    "You’re a streak guru, imparting wisdom and success! 🧘‍♂️",
    "Your achievements are as thrilling as a roller coaster ride! 🎢",
    "You’re a streak hero, saving the day with every win! 🦸‍♂️",
    "Your dedication is like a lighthouse guiding the way! 🌊",
    "You’re a success juggernaut, unstoppable and powerful! 🚀",
    "Your streak is like a dazzling parade of victories! 🎉",
    "You’re a streak champion, carving out success with precision! 🗡️",
    "Your achievements are as sweet as a chocolate fountain! 🍫",
    "You’re a streak superstar, with a galaxy of success! 🌌",
    "Your dedication is as enduring as a timeless classic! 🎬",
    "You’re a success dynamo, powering through with energy! ⚡",
    "Your streak is a mosaic of triumphs! 🧩",
    "You’re a streak legend, with tales of success to tell! 📖",
    "You’re a streak prodigy, playing the symphony of success! 🎻",
    "Your dedication is hotter than a summer day! ☀️",
    "You’re a streak dynamo, zooming past the competition! 🚀",
    "Your streak is a roller coaster of triumphs! 🎢",
    "You’re a streak superstar, shining like a diamond! 💎",
    "Your achievements are as legendary as a hero’s quest! 🏆",
    "You’re a success guru, mastering every challenge! 🧘‍♂️",
    "Your streak is as refreshing as a mint julep! 🍹",
    "You’re a streak sensation, breaking records like a pro! 📊",
    "Your dedication is like a roaring bonfire! 🔥",
    "You’re a streak genius, solving success puzzles! 🧩",
    "Your achievements are a masterpiece of success! 🎨",
    "You’re a streak rockstar, jamming through every hurdle! 🎸",
    "Your streak is a carnival of wins and fun! 🎡",
    "You’re a success titan, towering above challenges! 🏛️",
    "Your dedication is like a sunrise of brilliance! 🌅",
    "You’re a streak maestro, orchestrating daily victories! 🎼",
    "Your achievements are a treasure chest of greatness! 🗝️",
    "You’re a streak ace, flying high on success! ✈️",
    "Your streak is a wave of awesomeness! 🌊",
    "You’re a success architect, building your empire! 🏗️",
    "Your dedication is like a rocket launch to the stars! 🚀",
    "You’re a streak guru, enlightening the path to success! 🕉️",
    "Your achievements are a fireworks show of excellence! 🎆",
    "You’re a streak magician, conjuring up greatness! 🎩",
    "Your streak is as dazzling as a diamond necklace! 💍",
    "You’re a success voyager, navigating the seas of achievement! ⛵",
    "Your dedication is like a golden sunrise! 🌄",
    "You’re a streak explorer, charting new territories! 🧭",
    "Your achievements are as epic as a blockbuster movie! 🎬",
    "You’re a success maestro, conducting an orchestra of wins! 🎻",
    "Your streak is a symphony of daily triumphs! 🎶",
    "You’re a streak innovator, creating success from scratch! 💡",
    "Your dedication is like a lighthouse guiding you to success! 🗺️",
    "You’re a streak champion, winning gold every day! 🥇",
    "Your achievements are a garden of victory blooms! 🌻",
    "You’re a streak ace, navigating through challenges like a pro! 🎯",
    "Your streak is a parade of achievements and joy! 🎊",
    "You’re a success visionary, seeing the future of triumph! 🔮",
    "Your dedication is like a diamond’s sparkle! 💍",
    "You’re a streak hero, saving the day with every success! 🦸‍♀️",
    "Your achievements are a cascade of brilliance! 🌟",
    "You’re a streak champion, leading the way with pride! 🚀",
    "Your dedication is like a rhythmic beat of success! 🥁",
    "You’re a streak maestro, orchestrating a daily symphony! 🎼",
    "Your streak is a grand tour of victories! 🎢",
    "You’re a success pioneer, exploring new horizons! 🌄",
    "Your dedication is a shining example for all to see! 🌟",
    "You’re a streak virtuoso, performing with excellence! 🎹",
    "Your achievements are a constellation of greatness! 🌌",
    "You’re a success hero, conquering every challenge with flair! 🦸‍♂️",
    "Your streak is a dazzling comet of success! ☄️"
    ]
  };

  // Convert JSON data to array for insertion
  const messagesData = [];
  Object.keys(positiveReinforcementMessages).forEach(streakNumber => {
    positiveReinforcementMessages[streakNumber].forEach(message => {
      messagesData.push({
        streak_number: streakNumber === "ABOVE50" ? -1 : parseInt(streakNumber),
        message: message
      });
    });
  });

  // Insert positive reinforcement messages into the database
  await batchInsert(knex, 'positive_reinforcement_messages', messagesData);
};