import swaggerJSDoc, { Options } from 'swagger-jsdoc';
const options: Options & { apis?: string[] } = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API',
            description: 'API documentation',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            schemas: {

                UserSignup: {
                    type: 'object',
                    properties: {
                        userName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                    },
                    required: ['userName', 'email', 'password'],
                },

                UserLogin: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                    },
                    required: ['email', 'password'],
                },

                CreateCategory: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        slug: { type: 'string' },
                    },
                    required: ['name'],
                },
            },
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            security: [
                {
                    BearerAuth: [],
                },
            ],
        },
    },
    apis: ['./routes/*.ts'], // Replace with the path to your route files
};

const createPath = (path: any, method: any, summary: any, tags: any, requestBody?: any, parameters?: any, responses?: any) => ({
    [path]: {
        [method]: {
            summary,
            tags,
            requestBody,
            parameters,
            responses,
            security: [{ BearerAuth: [] }], // Include security scheme in each path
        },
    },
});

const swaggerSpec: any = swaggerJSDoc(options);

// Extend swaggerSpec with details for /signup and /login
if (!swaggerSpec.paths) {
    swaggerSpec.paths = {};
}

swaggerSpec.paths['/user/signup'] = {
    post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/UserSignup',
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Successful registration',
                content: {
                    'application/json': {
                        example: {
                            status: 'OK',
                            message: 'User created successfully',
                            data: {
                                userId: 123,
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Validation error or user already exists',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

swaggerSpec.paths['/user/login'] = {
    post: {
        summary: 'User login',
        tags: ['Authentication'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/UserLogin',
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Successful login',
                // content: {
                //     'application/json': {

                //     },
                // },
            },
            '400': {
                description: 'Invalid credentials',
                content: {
                    'application/json': {
                        example: {
                            status: 'BAD_REQUEST',
                            message: 'Invalid email or password',
                        },
                    },
                },
            },
        },
    },
};

swaggerSpec.paths = {
    ...swaggerSpec.paths,
    ...createPath(
        '/group/create',
        'post',
        'Create a new group',
        ['Group'],
        {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            currencyId: { type: 'string', format: 'string' },
                            categoryId: { type: 'string', format: 'string' },
                            participants: { type: 'array', items: { type: 'string' } },
                        },
                        required: ['title', 'description', 'currencyId', 'categoryId', 'participants'],
                    },
                },
            },
        },
        undefined,
        {
            '201': {
                description: 'Group created successfully',
                content: { 'application/json': {} },
            },
            '400': {
                description: 'Bad Request or Validation error',
                content: { 'application/json': {} },
            },
        }
    ),
    ...createPath(
        '/group',
        'get',
        'Get information all  groups',
        ['Group'],
        undefined,
        [
            {
                in: 'path',
                name: 'groupId',
                schema: {
                    type: 'string',
                    format: 'string',
                },
                description: 'ID of the group',
                required: false,
            },
        ],
        {
            '200': {
                description: 'Success',
                content: { 'application/json': {} },
            },
            '404': {
                description: 'Group not found',
                content: { 'application/json': {} },
            },
        }
    ),
    ...createPath(
        '/group/join/{groupId}',
        'post',
        'Join a group',
        ['Group'],
        {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string', format: 'string' },
                            userName: { type: 'string' },
                        },
                        required: ['userId', 'userName'],
                    },
                },
            },
        },
        [
            {
                in: 'path',
                name: 'groupId',
                schema: {
                    type: 'string',
                    format: 'string',
                },
                description: 'ID of the group',
                required: true,
            },
        ],
        {
            '200': {
                description: 'Successfully joined the group',
                content: { 'application/json': {} },
            },
            '400': {
                description: 'Bad Request or Validation error',
                content: { 'application/json': {} },
            },
        }
    ),
    ...createPath(
        '/group/myGroup',
        'get',
        'Find user\'s groups',
        ['Group'],
        undefined,
        undefined,
        {
            '200': {
                description: 'Success',
                content: { 'application/json': {} },
            },
        }
    ),

    // add categories to here
    ...createPath(
        '/category/create',
        'post',
        'Create category',
        ['Category'],
        {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/CreateCategory',
                    },
                },
            },
        },
        undefined,
        {
            '201': {
                description: 'Group created successfully',
                content: { 'application/json': {} },
            },
            '400': {
                description: 'Bad Request or Validation error',
                content: { 'application/json': {} },
            },
        }
    ),

    ...createPath(
        '/category',
        'get',
        'Get all categories',
        ['Category'],
        undefined,
        undefined,
        {
            '200': {
                description: 'Success',
                content: { 'application/json': {} },
            },
        }
    ),

};


swaggerSpec.paths['/serachCountry'] = {
    get: {
        summary: 'Search for countries',
        tags: ['Country'],
        parameters: [
            {
                in: 'query',
                name: 'code',
                schema: {
                    type: 'string',
                },
                description: 'Country code',
            },
            {
                in: 'query',
                name: 'name',
                schema: {
                    type: 'string',
                },
                description: 'Country name',
            },
            {
                in: 'query',
                name: '_id',
                schema: {
                    type: 'string',
                },
                description: 'Country ID',
            },
            {
                in: 'query',
                name: 'currency',
                schema: {
                    type: 'string',
                },
                description: 'Country currency',
            },
        ],
        security: [
            {
                BearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

swaggerSpec.paths['/invite'] = {
    post: {
        summary: 'Invite users to a group',
        tags: ['Common'],
        security: [
            {
                BearerAuth: [],
            },
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            emails: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'email',
                                },
                            },
                            groupId: {
                                type: 'string',
                                format: 'string', // Assuming groupId is a string
                            },
                        },
                        required: ['emails', 'groupId'],
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Invitations sent successfully',
                content: {
                    'application/json': {

                    },
                },
            },
            '400': {
                description: 'Bad Request or Validation error',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};


swaggerSpec.paths['/expence/add'] = {
    post: {
        summary: 'Add an expence',
        tags: ['expence'],
        security: [
            {
                BearerAuth: [],
            },
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            amount: { type: 'number' },
                            paidBy: { type: 'string', format: 'string' }, // Assuming paidBy is a string
                            groupId: { type: 'string', format: 'string' }, // Assuming groupId is a string
                            paidAt: { type: 'string', format: 'date-time' },
                            users: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        id: { type: 'string', format: 'string' }, // Assuming user id is a string
                                        isGroupJoin: { type: 'boolean' },
                                    },
                                    // required: ['name', 'id', 'isGroupJoin'],
                                },
                            },
                        },
                        required: ['title', 'amount', 'paidBy', 'groupId', 'paidAt', 'users'],
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'expence added successfully',
                content: {
                    'application/json': {

                    },
                },
            },
            '400': {
                description: 'Bad Request or Validation error',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};


swaggerSpec.paths['/expence/updateExpence/{id}'] = {
    put: {
        summary: 'Update an expence',
        tags: ['expence'],
        parameters: [
            {
                in: 'path',
                name: 'expenceId',
                schema: {
                    type: 'string',
                    format: 'string', // Assuming expenceId is a string
                },
                description: 'ID of the expence',
                required: true,
            },
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            amount: { type: 'number' },
                        },
                        required: ['amount'],
                    },
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'expence updated successfully',
                content: {
                    'application/json': {

                    },
                },
            },
            '400': {
                description: 'Bad Request or Validation error',
                content: {
                    'application/json': {

                    },
                },
            },
            '404': {
                description: 'expence not found',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

swaggerSpec.paths['/expence/delete/{id}'] = {
    delete: {
        summary: 'Delete an expence',
        tags: ['expence'],
        parameters: [
            {
                in: 'path',
                name: 'expenceId',
                schema: {
                    type: 'string',
                    format: 'string', // Assuming expenceId is a string
                },
                description: 'ID of the expence',
                required: true,
            },
        ],
        security: [
            {
                BearerAuth: [],
            },
        ],
        responses: {
            '204': {
                description: 'expence deleted successfully',
            },
            '404': {
                description: 'expence not found',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

swaggerSpec.paths['/expence/{id}'] = {
    get: {
        summary: 'Get an expence by ID',
        tags: ['expence'],
        parameters: [
            {
                in: 'path',
                name: 'expenceId',
                schema: {
                    type: 'string',
                    format: 'string', // Assuming expenceId is a string
                },
                description: 'ID of the expence',
                required: true,
            },
        ],
        security: [
            {
                BearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {

                    },
                },
            },
            '404': {
                description: 'expence not found',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

swaggerSpec.paths['/expence/getExpenceByGroupId/{groupId}'] = {
    get: {
        summary: 'Get expences by group ID',
        tags: ['expence'],
        parameters: [
            {
                in: 'path',
                name: 'groupId',
                schema: {
                    type: 'string',
                    format: 'string', // Assuming groupId is a string
                },
                description: 'ID of the group',
                required: true,
            },
        ],
        security: [
            {
                BearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {

                    },
                },
            },
            '404': {
                description: 'Group not found or no expences found for the group',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

swaggerSpec.paths['/expence/finalExpence/{id}'] = {
    get: {
        summary: 'Get expences by group ID',
        tags: ['expence'],
        parameters: [
            {
                in: 'path',
                name: 'groupId',
                schema: {
                    type: 'string',
                    format: 'string', // Assuming groupId is a string
                },
                description: 'ID of the group',
                required: true,
            },
        ],
        security: [
            {
                BearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'Success',
                content: {
                    'application/json': {

                    },
                },
            },
            '404': {
                description: 'Group not found or no expences found for the group',
                content: {
                    'application/json': {

                    },
                },
            },
        },
    },
};

export default swaggerSpec;
