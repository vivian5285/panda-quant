import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import { useSwipeable } from 'react-swipeable';

interface TableData {
  [key: string]: string | number | boolean;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string | number | boolean) => string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: TableData[];
  onRowClick?: (row: TableData) => void;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ columns, data, onRowClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (row: TableData) => {
    setSelectedRow(row);
    if (onRowClick) {
      onRowClick(row);
    }
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setDrawerOpen(false),
    onSwipedRight: () => setDrawerOpen(true),
    touchEventOptions: { passive: false },
    trackMouse: true
  });

  if (isMobile) {
    return (
      <Box {...swipeHandlers}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton onClick={() => setDrawerOpen(true)}>
                    <MenuIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{t('table.details')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick(row)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <IconButton>
                      <MenuIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {columns[0].format ? columns[0].format(row[columns[0].id]) : row[columns[0].id]}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <SwipeableDrawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          {...swipeHandlers}
        >
          <Box sx={{ width: 250, p: 2 }}>
            {selectedRow && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t('table.details')}
                </Typography>
                <List>
                  {columns.map((column) => (
                    <React.Fragment key={column.id}>
                      <ListItem>
                        <ListItemText
                          primary={column.label}
                          secondary={
                            column.format
                              ? column.format(selectedRow[column.id])
                              : selectedRow[column.id]
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </Box>
        </SwipeableDrawer>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={index}
              onClick={() => handleRowClick(row)}
              sx={{ cursor: 'pointer' }}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align}>
                    {column.format ? column.format(value) : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable; 