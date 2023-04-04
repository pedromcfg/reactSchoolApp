import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FormLayout from '../layouts/FormLayout';
import TeachersTable from './teachers/TeachersTable';
import StudentsTable from './students/StudentsTable';
import axios from 'axios';
import { DisplayUser } from '../../store/interfaces/interfaces';
import { selectedUser } from '../../store/slices/authSlice';
import { useAppSelector } from '../hooks/reduxHooks';

import _ from 'lodash';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
            {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const { jwt } = useAppSelector(selectedUser);
  const [users, setUsers] = React.useState<any>(null);
  const [areUsersLoading, setAreUsersLoading] = React.useState<boolean>(true)

  const getUsers = React.useCallback(async (): Promise<any> => {
    const response: DisplayUser = await axios.get(`${process.env.REACT_APP_BASE_API}/users`, { headers: {"Authorization" : `Bearer ${jwt?.access_token}`}}).then(response => response.data);

    setUsers(response);
    setAreUsersLoading(false);
  }, [])

  React.useEffect(() => {
    getUsers()
      .catch(console.error);
  }, [getUsers])


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <FormLayout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor='secondary'>
          <Tab label="Teachers" {...a11yProps(0)} color='secondary'/>
          <Tab label="Students" {...a11yProps(1)} color='secondary'/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TeachersTable teachers={_.filter(users, { 'role': 'teacher'})} jwt={jwt}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StudentsTable students={_.filter(users, { 'role': 'students'})} jwt={jwt}/>
      </TabPanel>
    </Box>
    </FormLayout>
  );
}
