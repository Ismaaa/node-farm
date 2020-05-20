module.exports = (template, product) => {
  // with the /{%NAME%}/g we make the replace global and it will replace all occurrences
  let output = template
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NAME%}/g, product.name)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%DESCRIPTION%}/g, product.description);

  // Add non-organic class when prop organic is false
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};
