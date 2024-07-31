import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class SlackClient {
	async getUserDetail(userId: string) {
		const config: AxiosRequestConfig = {
			method: 'get',
			url: 'https://slack.com/api/users.profile.get',
			headers: {
				Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			params: { user: userId },
		};

		let response: AxiosResponse;
		try {
			response = await axios.request(config);
		} catch {
			throw new Error('Failed fetching user detail');
		}

		if (response.status !== 200) {
			throw new Error('Failed fetching user detail');
		}

		return {
			username: response.data['profile']['display_name'],
			imageUrl: response.data['profile']['image_32'],
		};
	}
}
