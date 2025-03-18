import React from 'react';
import ExpandableCard from './ExpandableCard';
import ReactBigCalendar from './ReactBigCalendar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ExpandableCalendar = ({ 
  title, 
  subtitle, 
  defaultExpanded = true,
  handleOpenNewAppt 
}) => {
  return (
    <ExpandableCard
      title={title || "Appointments Calendar"}
      subtitle={subtitle || "View and manage your upcoming appointments"}
      icon={<CalendarMonthIcon sx={{ fontSize: 32, color: "#ff4d6d" }} />}
      defaultExpanded={defaultExpanded}
    >
      <ReactBigCalendar handleOpenNewAppt={handleOpenNewAppt} />
    </ExpandableCard>
  );
};

export default ExpandableCalendar;