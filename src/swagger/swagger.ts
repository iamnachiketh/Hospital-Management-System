import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: "1.0.0"
        },
        components: {
            securitySchemes: {
                XTokenAuth: { 
                    type: "apiKey",
                    in: "header",
                    name: "x-token",
                    description: "Enter your JWT token here"
                }
            }
        },
        security: [
            {
                XTokenAuth: []
            }
        ]
    },
    apis: [
       path.join(__dirname,"../router/*.ts"),
       path.join(__dirname,"../models/*.ts")
    ]
};

export const swaggerSpec = swaggerJsdoc(options);
