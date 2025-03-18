import React from 'react';
import ExpandableCard from './ExpandableCard';
import CallHistory from './CallHistory';
import CallReceivedIcon from '@mui/icons-material/CallReceived';

const ExpandableCallHistory = ({ businessId, title, subtitle, defaultExpanded = true }) => {
  return (
    <ExpandableCard
      title={title || "Call History"}
      subtitle={subtitle || "Recent customer calls"}
      icon={<CallReceivedIcon sx={{ fontSize: 32, color: "#ff4d6d" }} />}
      defaultExpanded={defaultExpanded}
    >
      <CallHistory businessId={businessId} />
    </ExpandableCard>
  );
};

export default ExpandableCallHistory;