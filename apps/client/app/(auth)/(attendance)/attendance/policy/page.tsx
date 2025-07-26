import { AppHeader } from '@/components/app-header';
import { ATTENDANCE_POLICY } from './const/policy';

export default function AttendancePolicyPage() {
	return (
		<>
			<AppHeader title="출석 규정" className="mb-[25px]" />
			<section className="mx-4">
				{ATTENDANCE_POLICY.map((section, idx) => (
					<article key={Number(idx)} className="px-4 mb-5 text-label-subtle">
						<h3 className="text-body1 font-semibold mb-2">{section.title}</h3>
						<div className="flex flex-col gap-y-4 bg-background-subtle py-3 px-5 rounded-lg font-semibold text-body2">
							{section.blocks.map((block, blockIdx) => (
								<div key={Number(blockIdx)}>
									<p className="mb-1.5">{block.title}</p>
									<ul className="font-medium space-y-1.5 list-disc list-inside">
										{block.items.map((item, itemIdx) => (
											<li key={Number(itemIdx)}>{item}</li>
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
