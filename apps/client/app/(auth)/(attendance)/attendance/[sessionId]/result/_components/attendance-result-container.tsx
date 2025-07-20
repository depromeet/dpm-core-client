'use client';

export const AttendanceResultContainer = () => {
	return (
		<section className="mt-30">
			<div className="flex flex-col items-center justify-center gap-8">
				<div className="inline-flex p-2.5 bg-[#5E83FE33] rounded-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="33"
						height="32"
						viewBox="0 0 33 32"
						fill="none"
					>
						<title>circle-check</title>
						<path
							d="M16.5029 5.33398C22.3938 5.33416 27.1689 10.11 27.1689 16.001C27.1688 21.8918 22.3937 26.6668 16.5029 26.667C10.612 26.667 5.83611 21.8919 5.83594 16.001C5.83594 10.1099 10.6119 5.33398 16.5029 5.33398ZM20.5459 13.293C20.1554 12.9025 19.5224 12.9026 19.1318 13.293L15.1719 17.2529L13.8789 15.96C13.4884 15.5694 12.8554 15.5694 12.4648 15.96C12.0745 16.3505 12.0744 16.9836 12.4648 17.374L14.4648 19.374C14.8553 19.7643 15.4884 19.7643 15.8789 19.374L20.5459 14.707C20.9362 14.3165 20.9362 13.6835 20.5459 13.293Z"
							fill="#5E83FE"
						/>
					</svg>
				</div>
				<h2 className="text-title1 font-semibold">오늘도 출석 완료!</h2>
			</div>

			<div className="flex flex-col items-center justify-center gap-8">
				<div className="inline-flex p-2.5 bg-[#FEC15E4D] rounded-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
					>
						<title>circle-minus</title>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M15.9987 5.33398C10.1077 5.33398 5.33203 10.1096 5.33203 16.0007C5.33203 21.8917 10.1077 26.6673 15.9987 26.6673C21.8897 26.6673 26.6654 21.8917 26.6654 16.0007C26.6654 10.1096 21.8897 5.33398 15.9987 5.33398ZM11.6654 16.0007C11.6654 15.4484 12.1131 15.0007 12.6654 15.0007H19.332C19.8843 15.0007 20.332 15.4484 20.332 16.0007C20.332 16.5529 19.8843 17.0007 19.332 17.0007H12.6654C12.1131 17.0007 11.6654 16.5529 11.6654 16.0007Z"
							fill="#FFC06E"
						/>
					</svg>
				</div>
				<h2 className="text-title1 font-semibold">앗 오늘은 지각이네요</h2>
			</div>
		</section>
	);
};
