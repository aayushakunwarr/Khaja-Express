const slugify = require("slugify");

const toSlug = (text) => slugify(text, { lower: true, strict: true });

module.exports = { toSlug };
