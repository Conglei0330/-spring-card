/**
 * Canvas 合成工具：将背景图 + 贺词合成为 9:16 长图
 */

export interface CardOptions {
  backgroundUrl: string;
  greetingText: string;
  shortTitle: string;
  signature?: string;
}

/**
 * 生成贺卡长图
 */
export async function generateCardImage(options: CardOptions): Promise<Blob> {
  const { backgroundUrl, greetingText, shortTitle, signature } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建 Canvas 上下文');

  // 设置画布尺寸 9:16
  canvas.width = 1080;
  canvas.height = 1920;

  // 1. 绘制背景图
  const bg = await loadImage(backgroundUrl);
  ctx.drawImage(bg, 0, 0, 1080, 1920);

  // 2. 绘制半透明白底（文本承载区）
  const padding = 60;
  const textBoxY = 400;
  const textBoxHeight = 1100;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 20;
  roundRect(ctx, padding, textBoxY, 1080 - padding * 2, textBoxHeight, 24);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 3. 绘制标题（短句）
  ctx.fillStyle = '#d4383e'; // 中国红
  ctx.font = 'bold 56px "STKaiti", "KaiTi", serif'; // 楷体
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(shortTitle, 540, textBoxY + 100);

  // 4. 绘制贺词主体（自动换行）
  ctx.fillStyle = '#333';
  ctx.font = '40px "STSong", "SimSun", serif'; // 宋体
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const maxWidth = 1080 - padding * 2 - 80; // 两侧各留 40px 边距
  const lines = wrapText(ctx, greetingText, maxWidth);
  lines.forEach((line, i) => {
    ctx.fillText(line, padding + 40, textBoxY + 200 + i * 64);
  });

  // 5. 绘制署名（右下角）
  if (signature) {
    ctx.fillStyle = '#666';
    ctx.font = '36px "STKaiti", "KaiTi", serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`—— ${signature}`, 1080 - padding - 40, textBoxY + textBoxHeight - 60);
  }

  // 6. 导出为 Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas 导出失败'));
      }
    }, 'image/png', 1.0);
  });
}

/**
 * 加载图片（处理跨域）
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`图片加载失败: ${url}`));
    img.src = url;
  });
}

/**
 * 绘制圆角矩形
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * 自动换行（中文友好）
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let line = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const testLine = line + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line.length > 0) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

/**
 * 下载图片到本地
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
