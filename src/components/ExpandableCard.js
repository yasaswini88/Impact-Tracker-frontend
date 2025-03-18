import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Collapse,
  Box,
  Typography
} from '@mui/material';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const ExpandableCard = ({ 
  title, 
  subtitle,
  icon,
  headerBackgroundColor = "transparent",
  headerTextColor = "inherit",
  children, 
  defaultExpanded = true,
  sx = {}
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card 
      sx={{
        position: 'relative',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 77, 109, 0.2)',
        '&:hover': {
          borderColor: 'rgba(255, 77, 109, 0.3)',
          transition: 'border-color 0.3s ease'
        },
        ...sx
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          bgcolor: headerBackgroundColor,
          color: headerTextColor,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          position: 'relative'
        }}
      >
        {/* Center aligned title and subtitle */}
        <Box sx={{ textAlign: 'center', mb: icon ? 1 : 0 }}>
          {icon && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>{icon}</Box>}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {/* Positioned in top-right corner */}
        <IconButton 
          onClick={toggleExpand} 
          size="small"
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          {expanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          {children}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ExpandableCard;