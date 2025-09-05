/**
 * 获取项目所有代码 路径 -》 文件内容
 */
export function getProjectAllCode(): Record<string, string> {
  const modules: any = import.meta.glob('@/**/*.{vue,ts,js,css,json,scss}', {
    query: 'raw',
    eager: true,
  })
  let obj: Record<string, string> = {}
  Object.keys(modules).forEach((key) => {
    obj[key] = modules[key].default
  })
  return obj
}
