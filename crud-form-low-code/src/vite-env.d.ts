/// <reference types="vite/client" />

// 声明 .vue 文件模块
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 import.meta.env 类型
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_MODE?: 'development' | 'production' | 'test'
  // 可以根据需要扩展
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
