import { FastifyRegisterOptions } from 'fastify';

export const fastifyEnvOptions: FastifyRegisterOptions<any> = {
	dotenv: true,
	schema: {
		type: 'object',
		required: ['ENV', 'STAGE'],
		properties: {
			ENV: { type: 'string' },
			STAGE: { type: 'string' },
		},
	},
};
