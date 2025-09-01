/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from "https://esm.sh/vue@3.3.4"
    const component: DefineComponent<{}, {}, any>
    export default component
}