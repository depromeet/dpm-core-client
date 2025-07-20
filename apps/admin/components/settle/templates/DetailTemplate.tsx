import DetailBottom from '../detail/DetailBottom';
import DetailBottomSheet from '../detail/DetailBottomSheet';
import DetailTop from '../detail/DetailTop';
import Devider from '../layout/Devider';
import FixedBottomBtn from '../layout/FixedBottomBtn';

interface DetailTemplateProps {
	settleId: string;
}

export default async function DetailTemplate({ settleId }: DetailTemplateProps) {
	return (
		<>
			<DetailTop />
			<Devider />
			<DetailBottom />
			<FixedBottomBtn title="멤버 확정하기" />
			{/* <DetailBottomSheet /> */}
		</>
	);
}
