exports.up = (knex) => knex.raw(`
    CREATE extension if not exists  pg_trgm;
    CREATE INDEX if not exists trgm_idx_gin ON public.products USING gin ("searchKeys" gin_trgm_ops);
    SET pg_trgm.strict_word_similarity_threshold = 0.3;
    `);


exports.down = function(knex) {};
