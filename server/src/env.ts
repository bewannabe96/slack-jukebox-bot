import { FastifyRegisterOptions } from 'fastify';

export const fastifyEnvOptions: FastifyRegisterOptions<any> = {
	dotenv: true,
	schema: {
		type: 'object',
		required: ['ENV', 'STAGE', 'SLACK_BOT_TOKEN', 'CLIENT_DIR'],
		properties: {
			ENV: { type: 'string' },
			STAGE: { type: 'string' },
			SLACK_BOT_TOKEN: { type: 'string' },
			CLIENT_DIR: { type: 'string', default: '/home/node/app/client' },
		},
	},
};
