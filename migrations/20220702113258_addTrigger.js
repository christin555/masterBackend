/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
    CREATE FUNCTION trigger_sale_fn () RETURNS trigger AS '
    BEGIN
     IF NEW."salePrice" > 0  THEN
               NEW."salePercent" = 100 -(NEW."salePrice" / NEW."price"::NUMERIC*100)::INT;
     else NEW."salePercent" = null;
    END IF;
    return NEW;
    END;
    ' LANGUAGE  plpgsql;
    CREATE TRIGGER trigger_sale_price
    BEFORE INSERT OR UPDATE ON prices FOR EACH ROW
    EXECUTE PROCEDURE trigger_sale_fn ();
`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`
     DROP TRIGGER trigger_sale_price ON prices ;
     DROP FUNCTION  trigger_sale_fn;
`);
};
