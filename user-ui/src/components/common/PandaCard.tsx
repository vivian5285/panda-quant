import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
  CardProps,
  Box,
  SxProps,
  Theme,
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PandaCardProps extends Omit<CardProps, 'content' | 'title'> {
  title?: React.ReactNode;
  subheader?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  expanded?: boolean;
  onExpand?: () => void;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  gradient?: boolean;
  animation?: boolean;
  sx?: SxProps<Theme>;
  image?: string;
  imagePosition?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  boxShadow?: string;
  backdropFilter?: string;
}

const PandaCard: React.FC<PandaCardProps> = ({
  title,
  subheader,
  content,
  actions,
  expanded: controlledExpanded,
  onExpand,
  variant = 'elevation',
  elevation = 0,
  gradient = false,
  animation = true,
  sx,
  image,
  imagePosition,
  backgroundColor,
  borderRadius,
  padding,
  boxShadow,
  backdropFilter,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expanded = controlledExpanded ?? isExpanded;

  const handleExpand = () => {
    setIsExpanded(!expanded);
    onExpand?.();
  };

  const cardStyle = {
    background: gradient ? 'linear-gradient(135deg, rgba(0, 255, 184, 0.1), rgba(0, 184, 255, 0.1))' : 'transparent',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    ...sx,
  };

  const getAnimation = () => {
    if (!animation) return {};
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 },
    };
  };

  return (
    <motion.div {...getAnimation()}>
      <Card
        variant={variant}
        elevation={elevation}
        sx={cardStyle}
        {...props}
      >
        {title && (
          <CardHeader
            title={title}
            subheader={subheader}
            action={
              onExpand && (
                <IconButton
                  onClick={handleExpand}
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              )
            }
          />
        )}
        {content && <CardContent>{content}</CardContent>}
        {actions && <CardActions>{actions}</CardActions>}
        {props.children}
        {onExpand && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              {props.children}
            </Box>
          </Collapse>
        )}
      </Card>
    </motion.div>
  );
};

export default PandaCard; 