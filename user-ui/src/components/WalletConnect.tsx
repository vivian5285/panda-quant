import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

const WalletConnect: React.FC = () => {
  const { account, connect, disconnect, error } = useWeb3();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async (walletType: string) => {
    handleMenuClose();
    setIsConnecting(true);
    try {
      await connect(walletType);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    handleMenuClose();
    disconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {account ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<WalletIcon />}
          endIcon={<ArrowDropDownIcon />}
          onClick={handleMenuOpen}
        >
          {formatAddress(account)}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<WalletIcon />}
          endIcon={<ArrowDropDownIcon />}
          onClick={handleMenuOpen}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Connect Wallet'
          )}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {!account ? (
          <>
            <MenuItem onClick={() => handleConnect('metamask')}>
              MetaMask
            </MenuItem>
            <MenuItem onClick={() => handleConnect('walletconnect')}>
              WalletConnect
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default WalletConnect; 