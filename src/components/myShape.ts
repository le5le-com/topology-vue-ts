// 源码版写法
// import { Node, registerNode } from '@topology/core'

// 组件版写法和bundle一致
// window.Le5leTopology.registerNode

/////////////////////
// 以下代码不完整，代码来自网上改写，仅作参考
/////////////////////
// 画骨架
function drawOuterLine(ctx: CanvasRenderingContext2D, node: any) {
  const R = Math.floor((node.rect.width - 6) / 2);
  const r = Math.round((R * 1) / 2);

  ctx.beginPath();
  // 上半个圆形
  ctx.arc(node.rect.x + R, node.rect.y + r, r, 0, Math.PI, true);
  // 下半个圆形
  const theta = Math.acos((r * 1.0) / R);
  ctx.arc(
    node.rect.x + R,
    node.rect.y + node.rect.height - R,
    R,
    theta + Math.PI,
    -theta,
    true
  ); // 逆时针
  ctx.closePath();
  ctx.stroke();
}

// 画底色
function drawBasic(ctx: CanvasRenderingContext2D, node: any) {
  const lingrad = ctx.createLinearGradient(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    node.rect.height
  );
  lingrad.addColorStop(0, 'mediumvioletred');
  lingrad.addColorStop(0.2, 'darkorange');
  lingrad.addColorStop(0.4, 'gold');
  lingrad.addColorStop(0.6, 'limegreen');
  lingrad.addColorStop(0.8, 'navy');
  lingrad.addColorStop(1, 'purple');
  ctx.fillStyle = lingrad;
  ctx.fill('evenodd');
}

function getYByValue(node: any, i: number) {
  const R = Math.floor((node.rect.width - 6) / 2);
  const r = Math.round((R * 1) / 2);

  const min = 0;
  const max = 40;

  // 刻度线总高度
  const scale_height = node.rect.height - 2 * R - 2 * r;
  // 0刻度线所在位置
  const zero_scale_y = node.rect.height - 2 * R;
  const dy_dtem = scale_height / (max - min);
  return zero_scale_y - dy_dtem * node.value;
}

// 画刻度线
function drawScale(ctx: CanvasRenderingContext2D, node: any) {
  const min = 0;
  const max = 40;
  const R = Math.floor((node.rect.width - 6) / 2);
  const r = Math.round((R * 1) / 2);

  for (let i = min; i <= max; i++) {
    // 画刻度线
    const y = getYByValue(node, i);
    ctx.beginPath();
    ctx.moveTo(R + r, y);
    if (i % 10 == 0) {
      ctx.lineWidth = 2;
      ctx.lineTo(R + r - (r * 2) / 3, y);
      // ctx.font = "15px bold";
      ctx.fillText(i + '', R + r, y + 6);
      ctx.stroke();
    } else {
      ctx.lineWidth = 1;
      if (i % 5 == 0) {
        ctx.lineTo(R + r - r / 2, y);
      } else {
        ctx.lineTo(R + r - r / 3, y);
      }
      ctx.stroke();
    }
  }
}

/////////////////////
// end 以下代码不完整，代码来自网上改写，仅作参考
/////////////////////

// 自定义图形库绘画函数
export function myShape(ctx: CanvasRenderingContext2D, node: any) {
  ctx.beginPath();

  drawOuterLine(ctx, node);
  drawBasic(ctx, node);
  ctx.clearRect(
    node.rect.x,
    node.rect.y,
    node.rect.width,
    getYByValue(node, node.value)
  );
  drawOuterLine(ctx, node);
  drawScale(ctx, node);
}

// 注册自定义图形库
export function register() {
  (window as any).Le5leTopology.registerNode('thermometer', myShape);
}

// src\views\data.ts 里面加载到工具栏，第一个就是此自定义图形库
