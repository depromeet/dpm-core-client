import CreateFormWrapper from '../create/CreateFormWrapper';
import StepWrapper from '../create/StepWrapper';
import Devider from '../layout/Devider';
import FixedBottomBtn from '../layout/FixedBottomBtn';

export default async function CreateTemplate() {
	return (
		<>
			<CreateFormWrapper />
			<Devider />
			<StepWrapper />
			<FixedBottomBtn title="정산서 생성하기" />
			{/* <CreateBottomSheet /> */}
		</>
	);
}
