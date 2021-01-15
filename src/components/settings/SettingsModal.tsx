import React, { useContext, useMemo, useEffect, useState } from 'react'
import { Done, Replay } from '@material-ui/icons'
import { Tabs, Dialog, DialogActions, Tab, DialogContent } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { MyButton } from '@components/MyButton'
import { StorageContext } from '@contexts/StorageContext'
import { useFullscreenState } from '@hooks/useFullscreenState'
import { SettingsTabContent } from '@components/settings/SettingsTabConent'
import { AppearanceSettings } from '@components/settings/AppearanceSettings'
import { useScrollBarStyle } from '@/styles/Scrollbar.style'

interface SettingsModelProps {
    show: boolean
    onClose: () => void
}

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        background: 'rgba(20, 20, 20, 0.8)',
        borderRadius: 20,
        width: '700px',
        fontSize: '16px !important',
        overflow: 'hidden'
    },
    tab: {
        fontSize: '1.5rem'
    },
    dialogContent: {
        padding: '30px',
    },
    actions: {
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingBottom: '30px',
        gridColumnStart: 1,
        gridColumnEnd: 3
    },
    btn: {
        marginTop: theme.spacing(2),
    },
}))

export const SettingsModal: React.FC<SettingsModelProps> = ({ show, onClose }) => {

    const [tabValue, setTabValue] = useState(0)
    const { isFullscreen } = useFullscreenState()
    const { storage: { show: showOverlay_Storage }, storageDispatch, } = useContext(StorageContext);
    const showApp = useMemo(() => showOverlay_Storage && isFullscreen, [isFullscreen, showOverlay_Storage]);
    const classes = useStyles()
    const scrollBarStyles = useScrollBarStyle()

    const setDefault = () => storageDispatch({ type: 'setSettingsPanelDefault' })

    useEffect(() => {
        if (!showApp) onClose()
    }, [showApp, onClose])


    const handleTabChange = (_: any, value: number) => setTabValue(value)

    return (
        <Dialog
            classes={{
                paper: classes.paper
            }}
            hideBackdrop={true}
            maxWidth='lg'
            onClose={onClose}
            className={scrollBarStyles.scrollbar}
            open={showApp && show}>
            <DialogContent className={classes.dialogContent}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab
                        disableRipple
                        classes={{
                            root: classes.tab
                        }}
                        label='Appearance'
                    />
                    <Tab
                        disableRipple
                        classes={{
                            root: classes.tab
                        }}
                        label='Content'
                    />
                </Tabs>
                <SettingsTabContent
                    index={0}
                    value={tabValue}>
                    <AppearanceSettings />
                </SettingsTabContent>
                <SettingsTabContent
                    index={1}
                    value={tabValue}>
                </SettingsTabContent>
            </DialogContent>
            <DialogActions
                className={classes.actions}
            >
                <MyButton
                    className={classes.btn}
                    startIcon={<Replay />}
                    color='primary'
                    variant='outlined'
                    size='large'
                    onClick={setDefault}
                >
                    Set Default
                    </MyButton>
                <MyButton
                    className={classes.btn}
                    startIcon={<Done />}
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onClose}
                >
                    Done
                    </MyButton>
            </DialogActions>
        </Dialog>
    )
}

