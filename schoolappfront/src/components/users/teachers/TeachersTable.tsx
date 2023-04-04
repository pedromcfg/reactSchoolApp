import * as React from 'react';
import { DataGrid, GridApi, GridCellValue, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Button, CircularProgress, Switch, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { FC, Fragment, useCallback, useReducer, useState } from 'react';
import { DisplayUser } from '../../../store/interfaces/interfaces';
import axios from 'axios';
import { selectedUser } from '../../../store/slices/authSlice';
import { useAppSelector } from '../../hooks/reduxHooks';

const TeachersTable = (props: any) => {

    const toggleEnable = React.useCallback(async (userID: string, enabled: boolean): Promise<any> => {
      //const response = await axios.put(`${process.env.REACT_APP_BASE_API}/users/${userID}`, { headers: {"Authorization" : `Bearer ${jwt}`}}).then(response => console.log(response)); 
      
      //AXIOS DIDN'T WORK FOR PATCH

      await fetch(`${process.env.REACT_APP_BASE_API}/users/${userID}`, {
      method: 'PATCH',
      headers: {'Authorization': `Bearer ${props.jwt?.access_token}`}});
  }, [])

  return (
    <div style={{ height: 400, width: '100%' }}>
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
      <DataGrid
                            rows={props.teachers}
                            columns={[
                                { field: 'firstName', headerName: 'First name', flex: 1, align: 'center', headerAlign: 'center'},
                                { field: 'lastName', headerName: 'Last name', flex: 1, align: 'center', headerAlign: 'center' },
                                { field: 'email', headerName: 'Email', flex: 2, align: 'center', headerAlign: 'center'},
                                { field: 'enabled', headerName: 'Enabled', sortable: false, flex: 1, align: 'center', headerAlign: 'center', headerClassName: 'lastcolumnSeparator',
                                  renderCell: (params) => {
                                    const getInfoForToggleEnable = async (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                        event.stopPropagation(); // don't select this row after clicking
                                        const api: GridApi = params.api;
                                        const thisRow: Record<string, GridCellValue> = {};
                                
                                        api.getAllColumns().filter((c) => c.field !== '__check__' && !!c).forEach(
                                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
                                          );

                                        const userID: string = String(params.id);
                                        await toggleEnable(userID, params.row.enabled);
                                      };
                                    return <Switch onChange={getInfoForToggleEnable} defaultChecked={params.row.enabled} color="success" />;
                                  },
                                  }
                              ]}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection={false}
                            sx={{color: "whitesmoke"}}
                            disableSelectionOnClick
                        />
      </div>
    </div>
    </div>
  );
}

export default TeachersTable;