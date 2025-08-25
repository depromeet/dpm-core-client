import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	useAppShell,
} from '@dpm-core/shared';
import { createPortal } from 'react-dom';

export const BillCreateButton = ({
	disabled,
	isLoading,
	...props
}: React.ComponentProps<'button'> & { isLoading: boolean }) => {
	const { ref } = useAppShell();

	return createPortal(
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					type="button"
					disabled={disabled}
					size="full"
					variant="secondary"
					className="fixed bottom-0 w-full mx-auto"
					style={{
						maxWidth: ref.current.clientWidth,
					}}
				>
					정산서 생성하기
				</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg">
				<DrawerHeader className="px-5 mb-3">
					<DrawerTitle>생성 전 확인</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription className="px-5 mb-3">
					정산서를 생성하시겠어요? MVP 단계에서는 생성 후 수정이 <br /> 어려우니, 한 번 더 확인해
					주세요.
				</DrawerDescription>
				<DrawerFooter>
					<div className="flex gap-2">
						<DrawerClose asChild>
							<Button type="button" variant="assistive" size="lg" className="flex-1">
								수정하기
							</Button>
						</DrawerClose>
						<Button
							type="submit"
							variant="secondary"
							size="lg"
							className="flex-1"
							disabled={disabled}
							{...props}
						>
							{/* TODO 로딩 처리하기 */}
							{isLoading ? 'loading' : '생성하기'}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>,
		ref.current,
	);
};
