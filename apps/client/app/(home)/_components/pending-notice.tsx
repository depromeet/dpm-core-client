export const PendingNotice = () => {
	return (
		<section className="px-4 pt-2">
			<div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3">
				<svg
					width="20"
					height="20"
					viewBox="0 0 57 57"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="shrink-0"
				>
					<title>검토중</title>
					<path
						d="M28.5 12.75V44.25M39.6369 17.3631L17.3631 39.6369M39.6369 39.6371L17.3631 17.3632M44.25 28.5001L12.75 28.5001"
						stroke="#5E83FE"
						strokeWidth="5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<p className="font-medium text-body2 text-label-normal">
					현재 운영진이 회원 정보를 검토하고 있어요
				</p>
			</div>
		</section>
	);
};
