import React, { useContext, useMemo, useState, useCallback } from 'react'
import { Typography, Box, FormControl } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Slider } from '@components/ui-components/Slider'
import { InputLabel } from '@components/ui-components/InputLabel'
import { Select } from '@components/ui-components/Select'
import { MenuItem } from '@components/ui-components/MenuItem'
import { StorageContext } from '@contexts/StorageContext'
import { RgbColorPicker } from 'react-colorful'
import { Color } from '@models/Storage'
import '@css/colorful.css'

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr auto',
            gridGap: '30px'
        }
    })
)

export const AppearanceSettings: React.FC = () => {
    const {
        storage: { fontSize, opacity, blur, opacitySC, backgroundColor, color: fontColor },
        storageDispatch
    } = useContext(StorageContext)
    const [menuValue, setMenuValue] = useState<number>(0)

    const colorMode: 'Background' | 'Font' = useMemo(() => (menuValue === 0 ? 'Background' : 'Font'), [menuValue])
    const color = useMemo(() => (colorMode === 'Background' ? backgroundColor : fontColor), [colorMode, backgroundColor, fontColor])
    const setColor = useCallback(
        (c: Color) =>
            colorMode === 'Background'
                ? storageDispatch({ type: 'changeBackgroundColor', backgroundColor: c })
                : storageDispatch({ type: 'changeFontColor', color: c }),
        [colorMode, storageDispatch]
    )

    const classes = useStyles()

    const maxFontSize = 28,
        minFontSize = 8

    const FontValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({
            type: 'changeFontSize',
            fontSize: newValue as number
        })
    }

    const OpacityValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacity', opacity: newValue as number })
    }

    const OpacitySCValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacitySC', opacitySC: newValue as number })
    }

    const BlurValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({
            type: 'changeBackgroundBlur',
            blur: newValue as number
        })
    }

    return (
        <div className={classes.container} id="y-settings-modal-appearance-tab">
            <Box>
                <Typography gutterBottom color="textPrimary"
variant="h4">
                    Font Size
                </Typography>
                <Slider min={minFontSize} max={maxFontSize}
step={1} value={fontSize}
valueLabelDisplay="auto" onChange={FontValueOnChange} />
                <Typography gutterBottom color="textPrimary"
variant="h4">
                    Opacity
                </Typography>
                <Slider min={0} max={1}
step={0.01} value={opacity}
valueLabelDisplay="auto" onChange={OpacityValueOnChange} />
                <Typography gutterBottom color="textPrimary"
variant="h4">
                    Opacity for Super Chat
                </Typography>
                <Slider min={0} max={1}
step={0.01} value={opacitySC}
valueLabelDisplay="auto" onChange={OpacitySCValueOnChange} />
                <Typography gutterBottom color="textPrimary"
variant="h4">
                    Blur
                </Typography>
                <Slider min={0} max={30}
step={1} value={blur}
valueLabelDisplay="auto" onChange={BlurValueOnChange} />
                <br />
                <Typography gutterBottom variant="h6">
                    Use <code>Ctrl+Shift+y</code> to toggle overlay
                </Typography>
                <Typography gutterBottom variant="h6">
                    Press <code>Ctrl+Alt</code> then drag to move overlay
                </Typography>
            </Box>
            <Box minHeight={300}>
                <Box mb={1.5} minWidth={100}>
                    <FormControl fullWidth>
                        <InputLabel color="primary" id="change-color-label">
                            Change color of
                        </InputLabel>
                        <Select labelId="change-color-label" value={menuValue}>
                            <MenuItem value={0} onClick={() => setMenuValue(0)}>
                                Background
                            </MenuItem>
                            <MenuItem value={1} onClick={() => setMenuValue(1)}>
                                Font
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={1}>
                    <Typography gutterBottom color="textSecondary"
variant="h5">
                        Current Color: {`rgb(${color.r}, ${color.g}, ${color.b})`}
                    </Typography>
                </Box>
                <RgbColorPicker color={color} onChange={setColor} />
            </Box>
        </div>
    )
}
