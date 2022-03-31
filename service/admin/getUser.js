module.exports = {
    getUser: ({params, knex}) => {
        const {id} = params;
        return knex("users")
            .first([
                'users.id',
                'name',
                'email'
            ])
            .where('users.id', id);
    }
};
