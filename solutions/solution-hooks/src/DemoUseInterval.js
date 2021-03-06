import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Text } from '@workshop/ui-components';

// 1.
// - this is not hook, it does not even use useEffect
// - adds new interval every rerender
//
// const useInterval = (callback, interval) => {
// 	if (typeof interval === "number") {
// 		setInterval(callback, interval);
// 	}
// };

// 2. wrap by useEffect, add deps
// const useInterval = (callback, interval) => {
// 	useEffect(() => {
// 	if (typeof interval === "number") {
// 			setInterval(callback, interval);
// 		}
// 	}, [callback, interval]);
// };
//
// still the same

// 3.
// remove [callback]
// - adds new interval when interval changes
// 	}, [interval]);
//
// calls only first callback

// 4.
// add clearInterval
//
// const useInterval = (callback, interval) => {
// 	useEffect(() => {
//   	if (typeof interval === "number") {
// 			const id = setInterval(callback, interval);

// 			return () => clearInterval(id);
// 		}
// 	}, [interval, callback]);
// };
//
// - state (counter) and prop (random) is not in-sync
// - BUT - if we run rerender of CounterApp much quicker, interval is never
// run!

// 5.
// Working example
// - there is no dep on callback, the effect is not restared
// - we just keep ref to latest greatest callback

// const useInterval = (callback, interval) => {
// 	const cbRef = useRef(callback);

// 	useEffect(() => {
// 		cbRef.current = callback;
// 	});

// 	useEffect(() => {
//   	if (typeof interval === "number") {
// 			const tick = () => {
// 				cbRef.current();
// 			};
// 			const id = setInterval(tick, interval);

// 			return () => clearInterval(id);
// 		}
// 	}, [interval]);
// };

// 6. useCommitedRef refactor
const useCommitedRef = fn => {
	const fnRef = useRef(fn);
	useEffect(() => {
		fnRef.current = fn;
	});
	return fnRef;
};

const useInterval = (callback, interval) => {
	const cbRef = useCommitedRef(callback);

	useEffect(() => {
		if (typeof interval === 'number') {
			const tick = () => {
				cbRef.current();
			};
			const id = setInterval(tick, interval);

			return () => clearInterval(id);
		}
	}, [interval, cbRef]);
};

const CounterApp = ({ random }) => {
	const [counter, setCounter] = useState(0);
	const [interval, setInterval] = useState(null);

	useInterval(() => {
		console.log('counter', counter, random);

		setCounter(x => x + 1);
	}, interval);

	const handleClick = () => setInterval(interval ? null : 2000);

	return (
		<Box>
			<Text>{counter}</Text>
			<Text>
				<Button onClick={handleClick}>Toggle interval</Button>
			</Text>
		</Box>
	);
};

const Demo = () => {
	const [random, setRandom] = useState(0);

	useEffect(() => {
		const id = setTimeout(() => {
			setRandom(Math.random());
		}, 1000);

		return () => clearTimeout(id);
	});

	return <CounterApp random={random} />;
};

export default Demo;
