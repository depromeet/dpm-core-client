'use client';

import { useSettleFilterStore } from '@/store/useSettleFilterStore';
import { useEffect } from 'react';
import SettleList from '../main/SettleList';

export default async function MainTemplete() {
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
