import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'
import FormLayout from '../layouts/FormLayout'
import BlockIcon from '@mui/icons-material/Block';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <FormLayout>
      <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" style={{backgroundColor: "#212529", color: "whitesmoke", alignItems: "center"}} >
        <CardContent>
        <Typography variant="h5" component="div">
          You're are not allowed to access this page
        </Typography>
        <Typography component="div" textAlign="center">
          <BlockIcon sx={{ color: 'red', margin: 'auto' }} fontSize="large"/>
        </Typography>
        
        
      </CardContent>
      <CardActions>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          p: 1,
          m: 1,
          borderRadius: 1,
        }}
      >
<Button component={Link} to="/" size="small" color='secondary'>Go back</Button>
      </Box>
        
      </CardActions>
      </Card>
    </Box>
    </FormLayout>
  )
}

export default Unauthorized