interface StaffDinnerInfo {
  id: number;
  title: string;
  description: string;
  staffDinnerDate: string;
  dueDate: string;
  inviteVariation: string[];
  isClosed?: boolean;
}

interface StaffDinnerInfoProps {
  staffDinnerInfo: StaffDinnerInfo;
}

export const StaffDinnerInfo = ({ staffDinnerInfo }: StaffDinnerInfoProps) => {
  if (!staffDinnerInfo) return null;

  return (
    <section className="flex flex-col gap-5 px-4 pt-4 pb-6">
      <h2 className="font-bold text-headline2">{staffDinnerInfo.title}</h2>
      <p className="font-medium text-body2 text-gray-400">
        {staffDinnerInfo.description}
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="font-semibold text-body2 text-gray-400">
            회식 날짜
          </div>
          <div className="font-medium text-body2 text-gray-600">
            {staffDinnerInfo.staffDinnerDate}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="font-semibold text-body2 text-gray-400">
            조사 기한
          </div>
          <div className="font-medium text-body2 text-gray-600">
            {staffDinnerInfo.dueDate}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="font-semibold text-body2 text-gray-400">
            초대 범위
          </div>
          <div className="flex gap-1">
            {staffDinnerInfo.inviteVariation.map((tagItem) => (
              <div
                // TODO: key 값 수정
                key={Math.random()}
                className="rounded-sm bg-gray-100 px-[5px] py-[3px] font-semibold text-caption1 text-gray-500"
              >
                @<span className="ml-0.5">{tagItem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
