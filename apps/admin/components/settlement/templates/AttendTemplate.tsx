import AttendList from '../attend/AttendList';
import SettleDesc from '../attend/SettleDesc';
import Devider from '../layout/Devider';
import FixedBottomBtn from '../layout/FixedBottomBtn';

interface AttendTemplateProps {
	settleId: string;
}

export default async function AttendTemplate({ settleId }: AttendTemplateProps) {
	return (
		<>
			<SettleDesc />
			<Devider />
			<AttendList />
			{/* <AttendBottomSheet /> */}
			<FixedBottomBtn title="참석 여부 제출하기" />
		</>
	);
}
