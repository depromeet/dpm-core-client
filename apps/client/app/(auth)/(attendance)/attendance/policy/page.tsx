import { AppHeader } from '@/components/app-header';

import { ATTENDANCE_POLICY } from './const/policy';

export default function AttendancePolicyPage() {
	return (
		<>
			<AppHeader title="출석 규정" className="mb-[25px]" />
			<section className="mx-4 pb-5">
				{ATTENDANCE_POLICY.map((section, idx) => (
					<article key={Number(idx)} className="mb-5 text-label-subtle last:mb-0">
						<h3 className="mb-2 font-semibold text-body1">{section.title}</h3>
						<div className="flex flex-col gap-y-4 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
							{section.blocks.map((block, blockIdx) => (
								<div key={Number(blockIdx)}>
									<p className="mb-1.5">{block.title}</p>
									<ul className="list-disc space-y-1.5 font-medium">
										{block.items.map((item, itemIdx) => (
											<li key={Number(itemIdx)} className="ml-5">
												{item}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</article>
				))}
			</section>
		</>
	);
}
