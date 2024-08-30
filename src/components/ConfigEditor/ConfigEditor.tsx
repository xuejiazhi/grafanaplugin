import React, {ReactElement,useState} from 'react'
import {Button, FieldSet, LegacyForms, Switch, Tab, TabContent, TabsBar} from '@grafana/ui'
import type {EditorProps} from './types'
import {useChangeSecureOptions} from './useChangeSecureOptions'
import {useResetSecureOptions} from './useResetSecureOptions'
import {deleteAlerts} from '../../utils'

import './ConfigEditor.css'

const {SecretFormField, FormField} = LegacyForms;

enum authType {Basic = 'basic', Token = 'token'}

export function ConfigEditor(props: EditorProps): ReactElement {
    const {secureJsonData} = props.options;
    const {secureJsonFields} = props.options;
    const onChangeUrl = useChangeSecureOptions(props, 'url')
    const onResetUrl = useResetSecureOptions(props, 'url')
    const onChangeUser = useChangeSecureOptions(props, 'user')
    const onResetUser = useResetSecureOptions(props, 'user')
    const onChangePassword = useChangeSecureOptions(props, 'password')
    const onResetPassword = useResetSecureOptions(props, 'password')
    const onChangeToken = useChangeSecureOptions(props, 'token')
    const onResetToken = useResetSecureOptions(props, 'token')
    
    // console.log("ConfigEditor:" + secureJsonData?.token)
    // console.log("secureJsonFields.token:" + secureJsonFields.token)
    const [active, setActive] = React.useState((secureJsonFields && secureJsonFields.token) ? authType.Token : authType.Basic )
    let alertState = true
    if (props.options.jsonData.isLoadAlerts === undefined) {
        props.options.jsonData.isLoadAlerts = true;
        alertState = props.options.jsonData.isLoadAlerts
    }

    const handleButtonClick = () => {
        const confirmed = window.confirm('Are you sure you want to clear alerts?');
        if (confirmed) {
            console.log(props.options.name);
            // deleteAlerts(props.options.name).then(()=>{
            //     console.log("alert deleted!");
            // });
        }
      };

    const [alert, setAlert] = useState(alertState);
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setAlert(checked);
        const {onOptionsChange, options} = props;
        props.options.jsonData.isLoadAlerts = checked
        onOptionsChange({
            ...options,
            jsonData: {
                ...options.jsonData,
            },
        })
      };

    return (
        <div className='gf-form-group'>
            <FieldSet label="TDengine Host">
                <div className='gf-form max-width-30'>
                    <FormField label='Host'
                               labelWidth={8}
                               inputWidth={22}
                               tooltip="datasource's host"
                               onChange={onChangeUrl}
                               onBlur={onChangeUrl}
                               onReset={onResetUrl}
                               value={props.options.url || ''}
                               placeholder='http://localhost:6041'
                               required={true}
                               disabled={props.options.readOnly}
                    />
                </div>
            </FieldSet>
            <FieldSet label="TDengine Authentication">
                <TabsBar>
                    <Tab label={'by user and password'}
                         active={active === authType.Basic}
                         onChangeTab={() => setActive(authType.Basic)}
                    />
                    <Tab label={'by token'}
                         active={active === authType.Token}
                         onChangeTab={() => setActive(authType.Token)}
                    />
                </TabsBar>
                <TabContent>
                    {
                        active === authType.Basic &&
                        <div>
                            <div className='gf-form max-width-20'>
                                <FormField label='User'
                                           labelWidth={8}
                                           inputWidth={10}
                                           tooltip="datasource's username"
                                           onChange={onChangeUser}
                                           onBlur={onChangeUser}
                                           onReset={onResetUser}
                                           value={props.options.user || ''}
                                           disabled={props.options.readOnly}
                                           placeholder={secureJsonFields.basicAuth ? 'basic_auth configured' : 'username'}
                                />
                            </div>
                            <div className='gf-form max-width-20'>
                                <SecretFormField
                                    isConfigured={(secureJsonFields && secureJsonFields.password) as boolean}
                                    value={secureJsonData?.password || ''}
                                    label='Password'
                                    tooltip="datasource's password"
                                    labelWidth={8}
                                    inputWidth={10}
                                    onReset={onResetPassword}
                                    onChange={onChangePassword}
                                    onBlur={onChangePassword}
                                    disabled={props.options.readOnly || (secureJsonFields && secureJsonFields.password) as boolean}
                                    placeholder={secureJsonFields.basicAuth ? 'basic_auth configured' : 'password'}
                                />
                            </div>
                        </div>
                    }
                    {
                        active === authType.Token &&
                        <div className='gf-form max-width-30'>
                            <SecretFormField
                                isConfigured={(secureJsonFields && secureJsonFields.token) as boolean}
                                value={secureJsonData?.token || ''}
                                label='Token'
                                tooltip="datasource's cloud token"
                                placeholder='token of TDengine cloud'
                                labelWidth={8}
                                inputWidth={22}
                                onReset={onResetToken}
                                onChange={onChangeToken}
                                onBlur={onChangeToken}
                                disabled={props.options.readOnly || (secureJsonFields && secureJsonFields.token) as boolean}
                            />
                        </div>
                    }
                </TabContent>
            </FieldSet>
            <FieldSet label="TDengine Alert">  
                <FormField label="Load TDengine Alert" 
                    labelWidth={10}
                    className='align-center'
                    inputEl= {           
                        <Switch 
                            onChange={handleSwitchChange}
                            value={alert}
                        />         
                    } 
                />

                <FormField label="Clear TDengine Alert"
                    labelWidth={10} 
                    className='align-center'
                    inputEl= {  
                        <Button 
                            variant="primary"
                            className="custom-button"
                            onClick={handleButtonClick}
                            
                        />
                    }        
                />
            </FieldSet>
        </div>
    )
}

