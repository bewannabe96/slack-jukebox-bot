import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyFormbody from '@fastify/formbody';

import { fastifyEnvOptions } from './env';
import { Queue, QueueItem } from './Queue';
import { SlackClient } from './SlackClient';

const queue = new Queue();
const slackClient = new SlackClient();

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyEnv, fastifyEnvOptions);
fastify.register(fastifyFormbody);

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

fastify.route({
	method: 'POST',
	url: '/api/new-request',
	handler: async (request: FastifyRequest<any>, reply: FastifyReply) => {
		const body = request.body as any;

		const userId = body['user_id'];
		const url = body['text'];

		const { username, imageUrl } = await slackClient.getUserDetail(userId);

		queue.enqueueWithUrl(username, imageUrl, url);

		return {};
	},
});

fastify.route({
	method: 'GET',
	url: '/api/queue-update',
	handler: async (request: FastifyRequest<any>, reply: FastifyReply) => {
		let items: QueueItem[] = [];
		while (true) {
			const item = queue.dequeue();
			if (item === null) break;
			items.push(item);
		}

		return { update: items };
	},
});

fastify.route({
	method: 'GET',
	url: '/*',
	handler: async (request: FastifyRequest<any>, reply: FastifyReply) => {
		const params = request.params as any;
		const path = params['*'] || 'index.html';
		const filePath = process.env.CLIENT_DIR + '/' + path;

		const fs = require('node:fs');
		const stream = fs.createReadStream(filePath, 'utf8');

		reply.header('Content-Type', 'text');
		return reply.send(stream);
	},
});

fastify.listen({ host: '0.0.0.0', port: 8080 }, function (err) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
