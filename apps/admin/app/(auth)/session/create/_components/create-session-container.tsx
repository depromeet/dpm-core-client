'use client';

import { Input, Label } from '@dpm-core/shared';

export const CreateSessionContainer = () => {
	return (
		<section className="mx-auto w-full max-w-[800px] px-10 pb-8">
			<CreateSessionForm />
		</section>
	);
};

const CreateSessionForm = () => {
	return (
		<form action="" className="">
			<div className="mb-10 flex flex-col gap-2">
				<Label className="text-label-subtle">세션명</Label>
				<Input
					placeholder="ex. 디프만 00기 OT"
					className="border border-line-normal bg-background-normal"
				/>
			</div>

			<div className="mb-10 flex flex-col gap-2">
				<Label>세션 주차</Label>
				<Input placeholder="ex. 1주차" />
			</div>

			<Input className="mb-10" />

			<div className="mb-10 flex flex-col gap-2">
				<Label>세션 장소</Label>
				<Input placeholder="ex. 1주차" />
			</div>

			<div className="mb-10 flex items-center gap-3">
				<div className="flex flex-1 flex-col gap-2">
					<Label>출석 시작 시간</Label>
					<Input placeholder="ex. 1주차" />
				</div>
				<span className="h-0.5 w-2 bg-gray-400" />
				<div className="flex flex-1 flex-col gap-2">
					<Label>출석 종료 시간</Label>
					<Input placeholder="ex. 1주차" />
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex flex-1 flex-col gap-2">
					<Label>출석 시작 시간</Label>
					<Input placeholder="ex. 1주차" />
				</div>
				<span className="h-0.5 w-2 bg-gray-400" />
				<div className="flex flex-1 flex-col gap-2">
					<Label>출석 종료 시간</Label>
					<Input placeholder="ex. 1주차" />
				</div>
			</div>
		</form>
	);
};
