import React from 'react'
import { FormControlLabel, FormGroup, Switch, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const MyFormControlLabel = withStyles({
    label: {
        fontSize: '1.6rem'
    }
})(FormControlLabel)

export const ContentSettings = () => {
    return (
        <div>
            <Typography
                variant='h4'
            >
                Filter
            </Typography>
            <FormGroup>
                <MyFormControlLabel
                    control={<Switch />}
                    label='MemberShip'
                />
                <MyFormControlLabel
                    control={<Switch />}
                    label='Moderator'
                />
                <MyFormControlLabel
                    control={<Switch />}
                    label='SuperChat'
                />
            </FormGroup>
        </div>
    )
}
