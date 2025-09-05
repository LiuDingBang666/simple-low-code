/**
 * @name: 名称
 * @description: TODO 生成代码功能，这里只包含最简单的抽象层
 * @author: liudingbang
 * @date: 2025/9/5 14:27
 */
import type { DrawScheme } from '@/types/draw/scheme.ts'
import { createZip } from '@/utils/zip.ts'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'
import useSchemeStore from '@/store/useSchemeStore.ts'
import { defaultVue3ParseScheme } from '@/pages/draw/gen-code/parse/vue3-parse.ts'

let { getScheme } = useSchemeStore()

/**
 * 生成代码
 * @param scheme 低代码AST语法树
 * @param parseScheme 真正执行解析功能的方法
 * @param zipName 压缩包名称
 */
// @ts-ignore
export async function genCode(
  scheme: DrawScheme = getScheme().value,
  parseScheme: (scheme: DrawScheme) => Record<string, string> = defaultVue3ParseScheme,
  zipName: string = uuidv4() + '.zip',
) {
  await createZip(parseScheme(scheme), zipName)
  ElMessage.success('生成成功')
}
