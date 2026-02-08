import OSS from 'ali-oss';

let ossClient: OSS | null = null;

/**
 * 获取 OSS 客户端（单例）
 */
function getOSSClient(): OSS {
  if (!ossClient) {
    const region = process.env.OSS_REGION;
    const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
    const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
    const bucket = process.env.OSS_BUCKET;

    if (!region || !accessKeyId || !accessKeySecret || !bucket) {
      throw new Error('OSS 配置缺失，请检查环境变量');
    }

    ossClient = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
    });
  }

  return ossClient;
}

/**
 * 上传 Buffer 到 OSS
 * @param buffer 文件内容
 * @param path OSS 路径（如 cards/xxx.png）
 * @returns 可访问的 URL
 */
export async function uploadToOSS(buffer: Buffer, path: string): Promise<string> {
  try {
    const client = getOSSClient();
    const result = await client.put(path, buffer);
    return result.url;
  } catch (error: any) {
    console.error('OSS 上传失败:', error);
    throw new Error(`OSS 上传失败: ${error.message}`);
  }
}

/**
 * 从 URL 下载图片并上传到 OSS
 */
export async function downloadAndUploadToOSS(
  imageUrl: string,
  fileName: string
): Promise<string> {
  try {
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`下载图片失败: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到 OSS
    const ossPath = `cards/${fileName}`;
    return await uploadToOSS(buffer, ossPath);
  } catch (error: any) {
    console.error('下载并上传失败:', error);
    throw new Error(`下载并上传失败: ${error.message}`);
  }
}
