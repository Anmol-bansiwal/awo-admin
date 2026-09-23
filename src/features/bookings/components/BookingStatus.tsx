import React from 'react';
import type { BookingStatus as BookingStatusType } from '../bookings.types';
import { StatusBadge, type StatusBadgeVariant } from '../../../components/StatusBadge';

interface BookingStatusProps {
  status: BookingStatusType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const BookingStatus: React.FC<BookingStatusProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const normalizedStatus = (status || '').toUpperCase();

  let variant: StatusBadgeVariant = 'neutral';
  let pulseDot = false;
  let displayLabel = status || 'Unknown';

  switch (normalizedStatus) {
    case 'COMPLETED':
      variant = 'success';
      displayLabel = 'Completed';
      break;

    case 'IN_PROGRESS':
    case 'INPROGRESS':
      variant = 'info';
      pulseDot = true;
      displayLabel = 'In Progress';
      break;

    case 'EN_ROUTE':
    case 'ENROUTE':
      variant = 'indigo';
      pulseDot = true;
      displayLabel = 'En Route';
      break;

    case 'ACTIVE':
      variant = 'success';
      pulseDot = true;
      displayLabel = 'Active';
      break;

    case 'PENDING':
      variant = 'warning';
      displayLabel = 'Pending';
      break;

    case 'ACCEPTED':
      variant = 'teal';
      displayLabel = 'Accepted';
      break;

    case 'ASSIGNED':
      variant = 'sky';
      displayLabel = 'Assigned';
      break;

    case 'CANCELLED':
    case 'CANCELED':
      variant = 'danger';
      displayLabel = 'Cancelled';
      break;

    case 'REJECTED':
      variant = 'danger';
      displayLabel = 'Rejected';
      break;

    default:
      variant = 'neutral';
      displayLabel = status || 'Unknown';
      break;
  }

  return (
    <StatusBadge
      label={displayLabel}
      variant={variant}
      dot={true}
      pulseDot={pulseDot}
      shape="pill"
      size={size}
      uppercase={false}
      className={className}
    />
  );
};

