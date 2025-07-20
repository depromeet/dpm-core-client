'use client';

import { useEffect } from 'react';
import { useSettleFilterStore } from '@/store/useSettleFilterStore';
import SettleList from '../main/SettleList';

export default function MainTemplete() {
	const filter = useSettleFilterStore((state) => state.filter);

	useEffect(() => {
		console.log('현재 필터:', filter);
	}, [filter]);

	return (
		<>
			<SettleList />
			{/* <NoSettle/> */}
		</>
	);
}
