import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

const AlertMessage = forwardRef(({type, message}, ref) => {
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    };

    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showAlert(){
      setOpen(true);

    },
    closeAlert(event, reason){
      if (reason === 'clickaway') {
        return;
      };
      setOpen(false);
    }
  }));

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} sx={{ width: '100%' }} severity={type}>
        {type === "success" &&<AlertTitle>Succès</AlertTitle> }
        {type === "info" &&<AlertTitle>Information</AlertTitle> }
        {type === "warning" &&<AlertTitle>Attention</AlertTitle> }
        {type === "error" &&<AlertTitle>Erreur</AlertTitle> }
        {message}
      </Alert>
      </Snackbar>
    </Stack>
  );
});

export default AlertMessage;