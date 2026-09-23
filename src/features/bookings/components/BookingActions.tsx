import React from 'react';
import { Eye } from 'lucide-react';
import type { Booking } from '../bookings.types';
import { ActionMenu, type ActionMenuItem } from '../../../components/ActionMenu';

interface BookingActionsProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

export const BookingActions: React.FC<BookingActionsProps> = ({
  booking,
  onViewDetails,
}) => {
  const menuItems: ActionMenuItem[] = [
    {
      key: 'view-details',
      label: 'View Details',
      icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
      onClick: () => onViewDetails(booking),
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ActionMenu items={menuItems} align="right" menuWidthClassName="w-44" />
    </div>
  );
};
