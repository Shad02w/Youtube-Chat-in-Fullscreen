
import React, { useContext } from 'react'
import { Box, Divider, Typography, FormGroup, Switch, FormControlLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { StorageContext } from '@contexts/StorageContext'
import { AppContext } from '@contexts/AppContext'

export const MyFormControlLabel = withStyles({
    label: {
        fontSize: '1.4rem'
    }
})(FormControlLabel)

export const FilterSettings = () => {
    const { storage: { chatFilter }, storageDispatch } = useContext(StorageContext)
    const { enableChatFilter, toggleEnableChatFilter } = useContext(AppContext)
    return (
        <Box>
            <Box
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Typography
                    variant='h5'
                    classes={{
                        h5: '1.4rem'
                    }}
                    color='textSecondary'
                >
                    Enable on this page
                </Typography>
                <Switch
                    checked={enableChatFilter}
                    onChange={toggleEnableChatFilter}
                />
            </Box>
            <Divider />
            <FormGroup>
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.guest}
                        onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeChatFilter', filter: { ...chatFilter, guest: checked } })}
                    />}
                    label='Guest'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.member}
                        onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeChatFilter', filter: { ...chatFilter, member: checked } })}
                    />}
                    label='Member'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.owner}
                        onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeChatFilter', filter: { ...chatFilter, owner: checked } })}
                    />}
                    label='Owner'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.moderator}
                        onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeChatFilter', filter: { ...chatFilter, moderator: checked } })}
                    />}
                    label='Moderator'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.superchat}
                        onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeChatFilter', filter: { ...chatFilter, superchat: checked } })}
                    />}
                    label='SuperChat Card'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.membership}
                        onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeChatFilter', filter: { ...chatFilter, membership: checked } })}
                    />}
                    label='MemberShip Card'
                />
            </FormGroup>
        </Box>
    )
}

