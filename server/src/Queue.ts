export type QueueItem = {
	username: string;
	userProfileImageUrl: string;
	videoId: string;
	requestedAt: string;
};

export class Queue {
	private storage: QueueItem[] = [];

	constructor(initialData: QueueItem[] = []) {
		this.storage = [...initialData];
	}

	enqueueWithUrl(
		username: string,
		userProfileImageUrl: string,
		videoUrl: string,
	): void {
		const urlParams = new URLSearchParams(new URL(videoUrl).search);
		const videoId = urlParams.get('v');

		if (videoId === null) return;

		this.storage.push({
			username: username,
			userProfileImageUrl: userProfileImageUrl,
			videoId: videoId,
			requestedAt: new Date().toISOString(),
		});
	}

	dequeue() {
		return this.storage.shift() ?? null;
	}
}
