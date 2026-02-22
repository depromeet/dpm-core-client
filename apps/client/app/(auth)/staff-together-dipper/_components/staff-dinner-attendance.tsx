'use client';

import type { AttendanceStatus } from '../_types/staff-dinner';
import { AttendanceSelector } from './attendance-selector';

interface StaffDinnerAttendanceProps {
  attendance: AttendanceStatus;
  onAttendanceChange: (status: AttendanceStatus) => void;
}

export const StaffDinnerAttendance = ({
  attendance,
  onAttendanceChange,
}: StaffDinnerAttendanceProps) => {
  return (
    <section className="px-4 pt-4">
      <div className="font-semibold text-body2 text-label-subtle">
        회식 참여 여부
      </div>
      <div className="mt-2">
        <AttendanceSelector
          value={attendance}
          onChange={onAttendanceChange}
          name="attendance"
          columns={4}
        />
      </div>
    </section>
  );
};
