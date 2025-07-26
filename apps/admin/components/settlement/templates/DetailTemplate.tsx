import DetailBottom from '../detail/DetailBottom';
import DetailTop from '../detail/DetailTop';
import Devider from '../layout/Devider';

interface DetailTemplateProps {
	settleId: string;
}

export default async function DetailTemplate({ settleId }: DetailTemplateProps) {
	return (
		<>
			<DetailTop />
			<Devider />
			<DetailBottom />
		</>
	);
}
