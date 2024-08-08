const fetch = require('node-fetch');

async function batchInsert(knex, table, data, batchSize = 100) {
    for (let i = 0; i < data.length; i += batchSize) {
      await knex(table).insert(data.slice(i, i + batchSize));
    }
}

exports.seed = async function(knex) {
    // Fetch cities data and process to remove duplicates
    const response = await fetch('https://countriesnow.space/api/v0.1/countries');
    const data = await response.json();
    const cities = data.data.reduce((acc, country) => acc.concat(country.cities), []);

    // Remove duplicates
    const uniqueCities = Array.from(new Set(cities));

    // Fetch existing cities from the database
    const existingCities = await knex('cities').pluck('name');

    // Filter out cities that already exist
    const newCities = uniqueCities
        .filter(city => !existingCities.includes(city))
        .map((city, index) => ({ id: existingCities.length + index + 1, name: city }));

    // Insert new cities data into the database in batches
    if (newCities.length > 0) {
        await batchInsert(knex, 'cities', newCities);
    }
};
