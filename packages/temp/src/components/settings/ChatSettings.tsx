import React, { useContext } from 'react'
import { FormControlLabel, FormGroup, Switch, Box, Typography } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { StorageContext } from '@contexts/StorageContext'

const MyFormControlLabel = withStyles({
    label: {
        fontSize: '1.6rem'
    }
})(FormControlLabel)

const useStyles = makeStyles({
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        grid: '30px'
    }
})

export const ChatSettings = () => {
    const styles = useStyles()
    const { storage: { chatFilter, separateLine }, storageDispatch } = useContext(StorageContext)
    return (
        <div className={styles.container}>
            <Box>
                <Typography
                    gutterBottom
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

            </Box>
            <Box>
                <Typography
                    gutterBottom
                    variant='h4'
                >
                    Style
                </Typography>
                <FormGroup>
                    <MyFormControlLabel
                        control={<Switch
                            checked={separateLine}
                            onChange={(_: any, checked: boolean) => storageDispatch({ type: 'changeSeparateLine', separateLine: checked })}
                        />}
                        label='Separate line for comment and username'
                    />
                </FormGroup>
            </Box>
        </div>
    )
}
