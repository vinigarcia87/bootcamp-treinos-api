export const swaggerRoutes = async (app) => {
    app.withTypeProvider().route({
        method: "GET",
        url: "/swagger.json",
        // Define your schema
        schema: {
            hide: true,
        },
        handler: async () => {
            return app.swagger();
        },
    });
};
