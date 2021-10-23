const knex = require('../knex');

// npm run alsafloor
const parser = process.argv.slice(2);

require(`./${parser}`).start({knex});