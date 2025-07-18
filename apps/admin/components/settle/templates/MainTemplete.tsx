'use client';

import { useSettleFilterStore } from '@/store/useSettleFilterStore';
import { useEffect } from 'react';
import SettleList from '../main/SettleList';

const MainTemplete = () => {
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
};

export default MainTemplete;
