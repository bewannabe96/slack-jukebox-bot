import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import YouTube from 'react-youtube';
import { DateTime } from 'luxon';

type VideoQueueItem = {
	username: string;
	userProfileImageUrl: string;
	videoId: string;
	requestedAt: string;
};

const App: React.FC = () => {
	const [queue, setQueue] = useState<VideoQueueItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	const current = useMemo(() => {
		return queue[currentIndex] ?? null;
	}, [queue, currentIndex]);

	const onDelete = useCallback(
		(index: number) => {
			queue.splice(index, 1);
			setQueue([...queue]);
		},
		[queue],
	);

	const handleVideoEnd = useCallback(() => {
		const nextVideoIndex = currentIndex + 1;

		if (nextVideoIndex === queue.length) {
			setCurrentIndex(0);
		} else {
			setCurrentIndex(nextVideoIndex);
		}
	}, [queue, currentIndex]);

	const load = useCallback(async () => {
		const response = await axios.get('/api/queue-update');

		if (response.status !== 200) return;

		const updated = response.data['update'].map((v: any) => ({
			...v,
			requestedAt: DateTime.fromISO(v['requestedAt']).toFormat(
				'yyyy-MM-dd t',
			),
		}));

		setQueue((value) => [...value, ...updated]);
	}, []);

	const loopLoad = useCallback(async () => {
		while (true) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			await load();
		}
	}, [load]);

	useEffect(() => {
		loopLoad();
	}, []);

	return (
		<div className="container-fluid h-100">
			<div className="row h-100">
				<div className="col-9 bg-black d-flex flex-column justify-content-center">
					{current !== null && (
						<YouTube
							videoId={current.videoId}
							opts={{
								width: '100%',
								height: '390',
								playerVars: { autoplay: 1 },
							}}
							onEnd={handleVideoEnd}
						/>
					)}
				</div>
				<div className="col-3 h-100 overflow-scroll">
					<div className="d-flex flex-column align-items-stretch pt-3">
						{queue.map((item, index) => (
							<div
								key={index}
								className="position-relative mb-3"
								onClick={() => setCurrentIndex(index)}
								style={{ cursor: 'pointer' }}
							>
								{index === currentIndex && (
									<div className="position-absolute h-100 border-start border-5 border-primary" />
								)}
								<div className="ps-3">
									<div className="d-flex flex-row align-items-start mb-1">
										<img
											className="bg-black me-2 rounded-circle"
											style={{
												width: '2rem',
												height: '2rem',
												objectFit: 'cover',
											}}
											src={item.userProfileImageUrl}
											alt="Thumbnail"
										/>
										<div>
											<h6 className="mb-0">
												{item.username}
											</h6>
											<p className="mb-0 text-muted">
												<small>
													{item.requestedAt}
												</small>
											</p>
										</div>
										<div className="flex-fill"></div>
										<button
											className="btn btn-sm p-0 text-danger"
											onClick={() => onDelete(index)}
										>
											Delete
										</button>
									</div>
									<img
										className="bg-black"
										style={{
											width: '100%',
											aspectRatio: 1.333,
											objectFit: 'contain',
										}}
										src={`https://img.youtube.com/vi/${item.videoId}/0.jpg`}
										alt="Thumbnail"
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
