'use strict';

const Controller = require('egg').Controller;


class RoofController extends Controller {

  // 计算排板子坐标集合
  async index() {
    let req = {
      background: {
        width: 0,
        height: 0,
        minWidth: 0,
        type: 0
      },
      hSpec: {
        width: 0,
        height: 0,
        deg: 0,
        gap: 0
      },
      rate: 1,
      obstacle: {
        position: 'none',
        type: 'T',
        width: 0,
        height: 0
      }
    }
    let resp = {
      rects: [],
      num: 0
    }
    const ctx = await this.ctx
    req = ctx.request.body
    await this.init(req, resp)
    ctx.body = resp
  }

  async init(req, resp) {
    resp.rects = []
    let bg = {'style': '#be6d0d', canDraw: true}
    let totalHeight = req.background.height
    let totalWidth
    let startX
    let startY = 0
    // 初始化参数
    resp.num = 0
    // 当前组件规格
    let spec = req.hSpec
    // 计算板子投影高度
    spec.height = spec.height * Math.cos(spec.deg * Math.PI / 180)
    // 先将背景高宽转换成坐标
    if (req.background.type === 'rectangular' || req.background.type === 'plane' || req.background.type === 'open') {
      totalWidth = req.background.width
      bg.points = await this.getRectPoints(0, 0, req.background.width, req.background.height, req)
      // 开始坐标从剩余空间开始，目的就是让板子排放在中间
      startX = (totalWidth - parseInt(totalWidth / spec.width) * spec.width) / 2 * req.rate
    } else if (req.background.type === 'trapezoidal') {
      console.log('this is trapezoidal ===>>', req.background)
      totalWidth = req.background.minWidth
      bg.points = await this.getTrapezoidalPoints(0, req.background.height * req.rate, req.background.minWidth, req.background.width, req.background.height, req)
      startX = ((req.background.width - totalWidth) / 2 + (totalWidth - parseInt(totalWidth / spec.width) * spec.width) / 2) * req.rate
    }
    console.log('this is rate ===>>', req.rate)
    console.log('this is bacground params ===>>', bg.points)
    // 画出背景图片和其他图片
    let rects = req.rects
    rects.push(bg)
    // 循环计算可以排放的板子
    console.log('this is 循环计算可以排放的板子 ===>>', totalHeight, spec.height)
    while (totalHeight >= spec.height) {
      console.log('this is 循环计算可以排放的板子111 ===>>', totalHeight, spec.height)
      let sx = startX
      let tmpTotalWidth = totalWidth
      while (tmpTotalWidth >= spec.width) {
        let points = await this.getRectPoints(sx, startY, spec.width, spec.height, req)
        rects.push({'style': '#2511ff', canDraw: true, 'type': 'bz', points: points})
        tmpTotalWidth -= spec.width
        sx += spec.width * req.rate
        // 组件计数
        resp.num += 1
      }
      if (req.background.type === 'trapezoidal') {
        totalWidth = totalWidth + ((spec.height + spec.gap) * (req.background.width - totalWidth) / req.background.height)
        startX = ((totalWidth - parseInt(totalWidth / spec.width) * spec.width) / 2 + (req.background.width - totalWidth) / 2) * req.rate
      } else if (req.background.type === 'rectangular' || req.background.type === 'plane' || req.background.type === 'open') {
        totalWidth = req.background.width
      }
      totalHeight -= (spec.height + spec.gap)
      sx = startX
      startY += (spec.height + spec.gap) * req.rate
    }
    // 计算出障碍物的坐标
    if (req.obstacle.postion !== 'none' && req.obstacle.type === 'T') {
      let triangle = {
        'style': '#adadad',
        canDraw: true
      }
      let lTriangle = {
        'style': '#adadad',
        canDraw: true
      }
      let rTriangle = {
        'style': '#adadad',
        canDraw: true
      }
      if (req.obstacle.postion === 'bottomLeft') {
        triangle.points = await this.getTrianglePoints(0, req.background.height * req.rate, req.obstacle.width, req.obstacle.height, req)
        rects.push(triangle)
      } else if (req.obstacle.postion === 'bottom') {
        triangle.points = await this.getTrianglePoints((req.background.width - req.obstacle.width) / 2 * req.rate, req.background.height * req.rate, req.obstacle.width, req.obstacle.height, req)
        rects.push(triangle)
      } else if (req.obstacle.postion === 'bottomRight') {
        triangle.points = await this.getTrianglePoints((req.background.width - req.obstacle.width) * req.rate, req.background.height * req.rate, req.obstacle.width, req.obstacle.height, req)
        rects.push(triangle)
      } else if (req.obstacle.postion === 'bottomLeftRight') {
        lTriangle.points = await this.getTrianglePoints(0, req.background.height * req.rate, req.obstacle.width, req.obstacle.height, req)
        rTriangle.points = await this.getTrianglePoints((req.background.width - req.obstacle.width) * req.rate, req.background.height * req.rate, req.obstacle.width, req.obstacle.height, req)
        rects.push(lTriangle)
        rects.push(rTriangle)
      }
      // 判断板子坐标是否与障碍物重叠，如果重叠，设置板子数组为不可渲染状态
      rects.forEach((rect, index) => {
        if (rect.type && rect.type === 'bz') {
          let rectPoints = rect.points
          // 矩形的4个点
          let p1 = rectPoints[0]
          let p2 = rectPoints[1]
          let p4 = rectPoints[2]
          let p3 = rectPoints[3]
          if (req.obstacle.postion === 'bottomLeftRight') {
            let ltrianglePoints = lTriangle.points
            // 三角形的4个点
            let tl1 = ltrianglePoints[0]
            let tl2 = ltrianglePoints[1]
            let tl3 = ltrianglePoints[2]
            // 矩形的4个边与三角形的3个边任意一个相交，则不渲染
            if (this.segmentsIntr(p1, p2, tl1, tl2) || this.segmentsIntr(p1, p2, tl2, tl3) || this.segmentsIntr(p1, p2, tl1, tl3) ||
              this.segmentsIntr(p2, p4, tl1, tl2) || this.segmentsIntr(p2, p4, tl2, tl3) || this.segmentsIntr(p2, p4, tl1, tl3) ||
              this.segmentsIntr(p3, p4, tl1, tl2) || this.segmentsIntr(p3, p4, tl2, tl3) || this.segmentsIntr(p3, p4, tl1, tl3) ||
              this.segmentsIntr(p1, p3, tl1, tl2) || this.segmentsIntr(p1, p3, tl2, tl3) || this.segmentsIntr(p1, p3, tl1, tl3)
            ) {
              // 是否渲染
              rect.canDraw = false
              resp.num -= 1
            }

            let rtrianglePoints = rTriangle.points
            // 三角形的4个点
            let tr1 = rtrianglePoints[0]
            let tr2 = rtrianglePoints[1]
            let tr3 = rtrianglePoints[2]
            // 矩形的4个边与三角形的3个边任意一个相交，则不渲染
            if (this.segmentsIntr(p1, p2, tr1, tr2) || this.segmentsIntr(p1, p2, tr2, tr3) || this.segmentsIntr(p1, p2, tr1, tr3) ||
              this.segmentsIntr(p2, p4, tr1, tr2) || this.segmentsIntr(p2, p4, tr2, tr3) || this.segmentsIntr(p2, p4, tr1, tr3) ||
              this.segmentsIntr(p3, p4, tr1, tr2) || this.segmentsIntr(p3, p4, tr2, tr3) || this.segmentsIntr(p3, p4, tr1, tr3) ||
              this.segmentsIntr(p1, p3, tr1, tr2) || this.segmentsIntr(p1, p3, tr2, tr3) || this.segmentsIntr(p1, p3, tr1, tr3)
            ) {
              // 是否渲染
              rect.canDraw = false
              resp.num -= 1
            }
          } else {
            let trianglePoints = triangle.points
            // 三角形的4个点
            let t1 = trianglePoints[0]
            let t2 = trianglePoints[1]
            let t3 = trianglePoints[2]
            // 矩形的4个边与三角形的3个边任意一个相交，则不渲染
            if (this.segmentsIntr(p1, p2, t1, t2) || this.segmentsIntr(p1, p2, t2, t3) || this.segmentsIntr(p1, p2, t1, t3) ||
              this.segmentsIntr(p2, p4, t1, t2) || this.segmentsIntr(p2, p4, t2, t3) || this.segmentsIntr(p2, p4, t1, t3) ||
              this.segmentsIntr(p3, p4, t1, t2) || this.segmentsIntr(p3, p4, t2, t3) || this.segmentsIntr(p3, p4, t1, t3) ||
              this.segmentsIntr(p1, p3, t1, t2) || this.segmentsIntr(p1, p3, t2, t3) || this.segmentsIntr(p1, p3, t1, t3)
            ) {
              // 是否渲染
              rect.canDraw = false
              resp.num -= 1
            }
          }
        }
      })
    } else if (req.obstacle.postion !== 'none' && req.obstacle.type === 'R') {
      let rectObs = {
        'style': '#adadad',
        canDraw: true
      }
      if (req.obstacle.postion === 'topLeft') {
        rectObs.points = await this.getRectPoints(0, 0, req.obstacle.width, req.obstacle.height, req)
      } else if (req.obstacle.postion === 'topRight') {
        rectObs.points = await this.getRectPoints((req.background.width - req.obstacle.width) * req.rate, 0, req.obstacle.width, req.obstacle.height, req)
      } else if (req.obstacle.postion === 'top') {
        rectObs.points = await this.getRectPoints((req.background.width - req.obstacle.width) / 2 * req.rate, 0, req.obstacle.width, req.obstacle.height, req)
      } else if (req.obstacle.postion === 'middle') {
        rectObs.points = await this.getRectPoints((req.background.width - req.obstacle.width) / 2 * req.rate, (req.background.height - req.obstacle.height) / 2 * req.rate, req.obstacle.width, req.obstacle.height, req)
      }
      rects.push(rectObs)
      // 判断板子坐标是否与障碍物重叠，如果重叠，设置板子数组为不可渲染状态
      rects.forEach((rect, index) => {
        if (rect.type && rect.type === 'bz') {
          let rectPoints = rect.points
          // 矩形的4个点
          let p1 = rectPoints[0]
          let p2 = rectPoints[1]
          let p4 = rectPoints[2]
          let p3 = rectPoints[3]
          let rectObsPoints = rectObs.points
          // 矩形的4个点
          let r1 = rectObsPoints[0]
          let r2 = rectObsPoints[1]
          let r4 = rectObsPoints[2]
          let r3 = rectObsPoints[3]
          // 矩形的4个边与矩形的4个边任意一个相交，则不渲染
          // 1. 相交肯定不渲染
          if (this.segmentsIntr(p1, p2, r1, r2) || this.segmentsIntr(p1, p2, r2, r4) || this.segmentsIntr(p1, p2, r3, r4) || this.segmentsIntr(p1, p2, r1, r3) ||
            this.segmentsIntr(p2, p4, r1, r2) || this.segmentsIntr(p2, p4, r2, r4) || this.segmentsIntr(p2, p4, r3, r4) || this.segmentsIntr(p2, p4, r1, r3) ||
            this.segmentsIntr(p3, p4, r1, r2) || this.segmentsIntr(p3, p4, r2, r4) || this.segmentsIntr(p3, p4, r3, r4) || this.segmentsIntr(p3, p4, r1, r3) ||
            this.segmentsIntr(p1, p3, r1, r2) || this.segmentsIntr(p1, p3, r2, r4) || this.segmentsIntr(p1, p3, r3, r4) || this.segmentsIntr(p1, p3, r1, r3)
          ) {
            // 是否渲染
            rect.canDraw = false
            resp.num -= 1
          } else {
            // 2. 如果板子在障碍物内
            if (rect.canDraw) {
              for (let rectI = 0; rectI < rectPoints.length; rectI++) {
                if (rectPoints[rectI].x > r1.x && rectPoints[rectI].x < r4.x && rectPoints[rectI].y > r1.y && rectPoints[rectI].y < r4.y) {
                  rect.canDraw = false
                  resp.num -= 1
                  break
                }
              }
            }
            // 3. 如果障碍物在板子内
            if (rect.canDraw) {
              for (let oI = 0; oI < rectObsPoints.length; oI++) {
                if (rectObsPoints[oI].x > p1.x && rectObsPoints[oI].x < p4.x && rectObsPoints[oI].y > p1.y && rectObsPoints[oI].y < p4.y) {
                  rect.canDraw = false
                  resp.num -= 1
                  break
                }
              }
            }
            // 4. 相切
            if (rect.canDraw) {
              let tangentNum = 0
              rectPoints.forEach((rectP) => {
                if (this.checkPointInLine(rectP, r1, r2) || this.checkPointInLine(rectP, r2, r4) || this.checkPointInLine(rectP, r3, r4) || this.checkPointInLine(rectP, r1, r3)) {
                  tangentNum++
                }
              })
              if (tangentNum === 4) {
                rect.canDraw = false
                resp.num -= 1
              }
            }
          }
        }
      })
    }
  }

  /**
   *  根据长宽获取一个画布中应该显示的大小坐标
   *  @param startX 起始位置x坐标
   *  @param startY 起始位置y坐标
   *  @param width 宽度
   *  @param height 长度
   */
  async getRectPoints (startX, startY, width, height, req) {
    // 左上角坐标
    let p1 = {x: startX, y: startY}
    // 右上角坐标
    let p2 = {x: startX + width * req.rate, y: startY}
    // 左下角坐标
    let p3 = {x: p1.x, y: startY + height * req.rate}
    // 右下角坐标
    let p4 = {x: p2.x, y: p3.y}
    // 数组排放位置顺序为逆时针（左上，右上，右下，左下）
    return [p1, p2, p4, p3]
  }

  /**
   * 判断点是否在直线上
   *  @param p 点p
   *  @param lp1 直线一个端点
   *  @param lp2 直线另一个端点
   */
  async checkPointInLine (p, lp1, lp2) {
    if (((p.x - lp1.x) * (p.y - lp2.y) === (p.x - lp2.x) * (p.y - lp1.y)) && (p.x - lp1.x) * (p.x - lp2.x) <= 0) {
      return true
    }
    return false
  }
  /**
   * 获取梯形的顶点
   * @param startX 起点x坐标
   * @param startY 起点y坐标
   * @param miniWidth 上底
   * @param maxWidth 下底
   * @param height 高
   */
  async getTrapezoidalPoints (startX, startY, miniWidth, maxWidth, height, req) {
    // 左下角坐标
    let p1 = {x: startX, y: startY}
    // 右下角坐标
    let p2 = {x: startX + maxWidth * req.rate, y: startY}
    // 右上角坐标
    let p3 = {x: startX + (maxWidth + miniWidth) / 2 * req.rate, y: startY - height * req.rate}
    // 左上角坐标
    let p4 = {x: startX + (maxWidth - miniWidth) / 2 * req.rate, y: startY - height * req.rate}
    return [p1, p2, p3, p4]
  }
  /**
   * 获取三角形的坐标
   *  @param startX 起始位置x坐标
   *  @param startY 起始位置y坐标 一般为最底部
   *  @param width 宽度
   *  @param height 高度
   */
  getTrianglePoints (startX, startY, width, height, req) {
    // 左下角坐标
    let p1 = {x: startX, y: startY}
    // 右下角坐标
    let p2 = {x: startX + width * req.rate, y: startY}
    // 顶部坐标
    let p3 = {x: (p1.x + p2.x) / 2, y: startY - parseInt(height * req.rate)}
    return [p1, p2, p3]
  }
  /**
   *  计算两条线是否相交
   *  线段一坐标 （a点和b点）
   *  线段二坐标（c点和d点）
   */
  segmentsIntr (a, b, c, d) {
    /* 1 解线性方程组, 求线段交点.
     * 如果分母为0 则平行或共线, 不相交
     */
    let denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y)
    if (denominator === 0) {
      return false
    }

    // 线段所在直线的交点坐标 (x , y)
    let x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
      (b.y - a.y) * (d.x - c.x) * a.x -
      (d.y - c.y) * (b.x - a.x) * c.x) / denominator
    let y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
      (b.x - a.x) * (d.y - c.y) * a.y -
      (d.x - c.x) * (b.y - a.y) * c.y) / denominator

    /** 2 判断交点是否在两条线段上
     *  交点在线段1上 且交点也在线段2上
     * **/
    if ((x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0 &&
      (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0) {
      // 返回交点p
      /* return {
        x: x,
        y: y
      } */
      return true
    }
    // 否则不相交
    return false
  }

}

module.export = RoofController