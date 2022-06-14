exports.up = (knex) => knex.raw(`
    CREATE if not exists extension pg_trgm;
    CREATE if not exists INDEX trgm_idx_gin ON public.products USING gin ("searchKeys" gin_trgm_ops);
    SET pg_trgm.strict_word_similarity_threshold = 0.3;
    `);


exports.down = function(knex) {};
