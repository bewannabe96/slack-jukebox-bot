import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';

import { fastifyEnvOptions } from 'env';

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyEnv, fastifyEnvOptions);

fastify.ready(async () => {
	// init app
});

fastify.route({
	method: 'GET',
	url: '/healthcheck',
	handler: () => {
		return { status: 'OK' };
	},
});

fastify.listen({ host: '0.0.0.0', port: 3000 }, function (err) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
