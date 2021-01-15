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
                    />}
                    label='Owner'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.moderator}
                    />}
                    label='Moderator'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.superchat}
                    />}
                    label='SuperChat Card'
                />
                <MyFormControlLabel
                    control={<Switch
                        checked={chatFilter.membership}
                    />}
                    label='MemberShip Card'
                />
            </FormGroup>
        </div>
    )
}
