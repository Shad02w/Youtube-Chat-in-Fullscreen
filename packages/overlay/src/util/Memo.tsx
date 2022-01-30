import { ComponentProps, ComponentType, memo, NamedExoticComponent } from 'react'

type CompareFn<T extends ComponentType> = (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean

export const Memo = function <T extends ComponentType<any>>(
    component: T,
    displayName: string,
    compareFn?: CompareFn<T>
): NamedExoticComponent<ComponentProps<T>> {
    return memo(Object.assign(component, { displayName }), compareFn) as NamedExoticComponent<ComponentProps<T>>
}
