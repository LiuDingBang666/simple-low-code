// utils/zip.ts
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * 创建 ZIP 文件
 * @param files - { filename: content } 对象
 * @param zipName - zip 文件名
 */
export async function createZip(files: Record<string, string>, zipName = 'archive.zip') {
  console.log(files)
  const zip = new JSZip()

  // 添加文件
  Object.keys(files).forEach((filename) => {
    zip.file(filename, files[filename])
  })

  // 生成 zip blob
  const content = await zip.generateAsync({ type: 'blob' })

  // 下载
  saveAs(content, zipName)
}
