type CSSModule = { readonly [className: string]: string }

declare module '*.module.css' {
    const classes: CSSModule
    export default classes
}
