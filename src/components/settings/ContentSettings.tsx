import React, { useContext } from 'react'
import { FormControlLabel, FormGroup, Switch, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { StorageContext } from '@contexts/StorageContext'

const MyFormControlLabel = withStyles({
    label: {
        fontSize: '1.6rem'
    }
})(FormControlLabel)

export const ContentSettings = () => {
    const { storage: { chatFilter }, storageDispatch } = useContext(StorageContext)
    return (
        <div>
            <Typography
                variant='h4'
            >
                Filter
            </Typography>
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
        </div>
    )
}
