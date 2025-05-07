export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory & Store Management API",
      version: "1.0.0",
      description: "API documentation for Inventory & Store Management System",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};
