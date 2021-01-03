interface RGBA {
    r: number,
    g: number,
    b: number,
    a: string
}

export const ThemeColor = {
    100: 'EE4540',
    200: 'C72C41',
    300: '801336',
    400: '510A32',
    500: '2D142C'
}

export const AndroidColorToRgba = (color: number): RGBA => {
    const transparent = (color >> 24) & 0xff;
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const a = (transparent / 255).toPrecision(2)

    return { r, g, b, a }
}


export const rgbaToRgbaString = (color: RGBA) => `rgba(${color.r},${color.g},${color.b},${color.a})`