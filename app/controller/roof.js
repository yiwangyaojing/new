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
    let rects = resp.rects
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
      for (let rI = 0, length = rects.length; rI < length; rI++) {
        // rects.forEach((rect, index) => {
        let rect = rects[rI]
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
            // if (this.segmentsIntr(p1, p2, tl1, tl2) || this.segmentsIntr(p1, p2, tl2, tl3) || this.segmentsIntr(p1, p2, tl1, tl3) ||
            //   this.segmentsIntr(p2, p4, tl1, tl2) || this.segmentsIntr(p2, p4, tl2, tl3) || this.segmentsIntr(p2, p4, tl1, tl3) ||
            //   this.segmentsIntr(p3, p4, tl1, tl2) || this.segmentsIntr(p3, p4, tl2, tl3) || this.segmentsIntr(p3, p4, tl1, tl3) ||
            //   this.segmentsIntr(p1, p3, tl1, tl2) || this.segmentsIntr(p1, p3, tl2, tl3) || this.segmentsIntr(p1, p3, tl1, tl3)
            // ) {
            //   // 是否渲染
            //   rect.canDraw = false
            //   resp.num -= 1
            // }
            let j1 = await this.jugeOverlay(ltrianglePoints, rectPoints)
            if (j1) {
              // 是否渲染
              rect.canDraw = false
              resp.num -= 1
            }

            let rtrianglePoints = rTriangle.points
            // 三角形的3个点
            let tr1 = rtrianglePoints[0]
            let tr2 = rtrianglePoints[1]
            let tr3 = rtrianglePoints[2]
            // 矩形的4个边与三角形的3个边任意一个相交，则不渲染
            // if (this.segmentsIntr(p1, p2, tr1, tr2) || this.segmentsIntr(p1, p2, tr2, tr3) || this.segmentsIntr(p1, p2, tr1, tr3) ||
            //   this.segmentsIntr(p2, p4, tr1, tr2) || this.segmentsIntr(p2, p4, tr2, tr3) || this.segmentsIntr(p2, p4, tr1, tr3) ||
            //   this.segmentsIntr(p3, p4, tr1, tr2) || this.segmentsIntr(p3, p4, tr2, tr3) || this.segmentsIntr(p3, p4, tr1, tr3) ||
            //   this.segmentsIntr(p1, p3, tr1, tr2) || this.segmentsIntr(p1, p3, tr2, tr3) || this.segmentsIntr(p1, p3, tr1, tr3)
            // ) {
            //   // 是否渲染
            //   rect.canDraw = false
            //   resp.num -= 1
            // }
            let j2 = await this.jugeOverlay(rtrianglePoints, rectPoints)
            if (j2) {
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
            // if (this.segmentsIntr(p1, p2, t1, t2) || this.segmentsIntr(p1, p2, t2, t3) || this.segmentsIntr(p1, p2, t1, t3) ||
            //   this.segmentsIntr(p2, p4, t1, t2) || this.segmentsIntr(p2, p4, t2, t3) || this.segmentsIntr(p2, p4, t1, t3) ||
            //   this.segmentsIntr(p3, p4, t1, t2) || this.segmentsIntr(p3, p4, t2, t3) || this.segmentsIntr(p3, p4, t1, t3) ||
            //   this.segmentsIntr(p1, p3, t1, t2) || this.segmentsIntr(p1, p3, t2, t3) || this.segmentsIntr(p1, p3, t1, t3)
            // ) {
            //   // 是否渲染
            //   rect.canDraw = false
            //   resp.num -= 1
            // }
            let j3 = await this.jugeOverlay(trianglePoints, rectPoints)
            if (j3) {
              // 是否渲染
              rect.canDraw = false
              resp.num -= 1
            }
          }
        }
      }
      // )
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
      for (let i = 0, length = rects.length; i < length; i++) {
        let rect = rects[i]
        // rects.forEach((rect, index) => {
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
          let b = await this.checkRectAndRect(rectPoints, rectObsPoints)
          if (b) {
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
              for (let i = 0, length = rectPoints.length; i < length; i++ ) {
              // .forEach((rectP) => {
                let rectP = rectPoints[i]
                let c1 = await this.checkPointInLine(rectP, r1, r2)
                let c2 = await this.checkPointInLine(rectP, r2, r4)
                let c3 = await this.checkPointInLine(rectP, r3, r4)
                let c4 = await this.checkPointInLine(rectP, r1, r3)
                if (c1 || c2 || c3 || c4) {
                  tangentNum++
                }
              }
              if (tangentNum === 4) {
                rect.canDraw = false
                resp.num -= 1
              }
            }
          }
        }
        // )
      }
    }
  }

  async checkRectAndRect( rect1, rect2 ) {
    // 矩形的4个点
    let p1 = rect1[0]
    let p2 = rect1[1]
    let p4 = rect1[2]
    let p3 = rect1[3]
    // 矩形的4个点
    let r1 = rect2[0]
    let r2 = rect2[1]
    let r4 = rect2[2]
    let r3 = rect2[3]
    let b1 = await this.intersect(p1, p2, r1, r2)
    let b2 = await this.intersect(p1, p2, r2, r4)
    let b3 = await this.intersect(p1, p2, r3, r4)
    let b4 = await this.intersect(p1, p2, r1, r3)
    let b5 = await this.intersect(p2, p4, r1, r2)
    let b6 = await this.intersect(p2, p4, r2, r4)
    let b7 = await this.intersect(p2, p4, r3, r4)
    let b8 = await this.intersect(p2, p4, r1, r3)
    let b9 = await this.intersect(p3, p4, r1, r2)
    let b10 = await this.intersect(p3, p4, r2, r4)
    let b11 = await this.intersect(p3, p4, r3, r4)
    let b12 = await this.intersect(p3, p4, r1, r3)
    let b13 = await this.intersect(p1, p3, r1, r2)
    let b14 = await this.intersect(p1, p3, r2, r4)
    let b15 = await this.intersect(p1, p3, r3, r4)
    let b16 = await this.intersect(p1, p3, r1, r3)
    if ( b1 || b2 || b3 || b4 || b5 || b6 || b7 || b8 || b9 || b10 || b11 || b12 || b13 || b14 || b15 || b16 ) {
      return true
    }
    return false
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
  async getTrianglePoints (startX, startY, width, height, req) {
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
  async segmentsIntr (a, b, c, d) {
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

  // 判断两条线段是否相交
  async intersect(aa, bb, cc, dd) {
    if ( Math.max(aa.x, bb.x)< Math.min(cc.x, dd.x) ) {
      return false;
    }
    if ( Math.max(aa.y, bb.y)< Math.min(cc.y, dd.y) ) {
      return false;
    }
    if ( Math.max(cc.x, dd.x)< Math.min(aa.x, bb.x) ) {
      return false;
    }
    if ( Math.max(cc.y, dd.y)< Math.min(aa.y, bb.y) ) {
      return false;
    }
    let c1 = (await this.mult(cc, bb, aa))* (await this.mult(bb, dd, aa)) < 0
    if (c1) {
      return false;
    }
    let c2 = (await this.mult(aa, dd, cc))*(await this.mult(dd, bb, cc)) < 0
    if (c2) {
      return false;
    }
    return true;
  }
  async mult(a, b, c) {
    return (a.x-c.x)*(b.y-c.y)-(b.x-c.x)*(a.y-c.y);
  }

  // 判断 三角形和四边形是否重叠
  async jugeOverlay( triangle, rect) {
    // 左下角
    let t1 = triangle[0]
    // 右下角
    let t2 = triangle[1]
    // 顶部
    let t3 = triangle[2]

    // 四边形
    // 左上
    let p1 = rect[0]
    // 右上
    let p2 = rect[1]
    // 右下
    let p4 = rect[2]
    // 左下
    let p3 = rect[3]

    // 判断相交
    let s1 = await this.intersect(p1, p2, t1, t2)
    let s2 = await this.intersect(p1, p2, t2, t3)
    let s3 = await this.intersect(p1, p2, t1, t3)
    let s4 = await this.intersect(p2, p4, t1, t2)
    let s5 = await this.intersect(p2, p4, t2, t3)
    let s6 = await this.intersect(p2, p4, t1, t3)
    let s7 = await this.intersect(p3, p4, t1, t2)
    let s8 = await this.intersect(p3, p4, t2, t3)
    let s9 = await this.intersect(p3, p4, t1, t3)
    let s10 = await this.intersect(p1, p3, t1, t2)
    let s11 = await this.intersect(p1, p3, t2, t3)
    let s12 = await this.intersect(p1, p3, t1, t3)
    if (s1 || s2 || s3 || s4 || s5 || s6 || s7 || s8 || s9 || s10 || s11 || s12) {
      return true
    }
    // 四边形包含三角形 顶点与其中另一个点，在四边形之内
    let rt = await this.checkTriangleInRect(triangle, rect)
    if (rt) {
      return true
    }

    // 三角形包含四边形
    let tr = await this.checkLineInTriangle(p1, p2, triangle)
    if (tr) {
      return true
    }

    return false

  }

  // 判断三角形斜边是否在四边形之内
  async checkTriangleInRect(triangle, rect) {
    // 顶点
    let t3 = triangle[2]
    let t1 = triangle[0]
    let t2 = triangle[1]

    return (await this.checkLineInRect(t3, t1, rect) || await this.checkLineInRect(t3, t2, rect))
  }

  // 判断直线段是否在四边形之内
  async checkLineInRect(a, b, rect) {
    return await this.checkPointInRect(a, rect) && await this.checkPointInRect(b, rect)
  }

  // 判断点在四边形之内(包含边上)
  async checkPointInRect(pos, rect) {
    let p1 = rect[0]
    let p3 = rect[2]
    return (pos.x >= p1.x && pos.x <= p3.x) && (pos.y >= p1.y && pos.y <= p3.y)
  }

  // 判断直线段在三角形之内
  async checkLineInTriangle(a, b, triangle) {
    return (await this.checkPointInTriangle(a, triangle) && await this.checkPointInTriangle(b, triangle))
  }

  // 判断点在三角形之内
  async checkPointInTriangle(pos, triangle) {
    let x = pos.x;
    let y = pos.y;
    let v0 = triangle[0]
    let v1 = triangle[1]
    let v2 = triangle[2]

    let v0x = v0.x;
    let v0y = v0.y;

    let v1x = v1.x;
    let v1y = v1.y;

    let v2x = v2.x;
    let v2y = v2.y;

    let t = await this.triangleArea(v0x, v0y, v1x, v1y, v2x, v2y);
    let a = await this.triangleArea(v0x, v0y, v1x, v1y, x, y) + await this.triangleArea(v0x, v0y, x, y, v2x, v2y) + await this.triangleArea(x, y, v1x, v1y, v2x, v2y);

    if (Math.abs(t - a) <= 0.01) {
      return true;
    } else {
      return false;
    }
  }

  async triangleArea (t1x, t1y, t2x, t2y, t3x, t3y) {
    return Math.abs((t1x * t2y + t2x * t3y + t3x * t1y - t2x * t1y - t3x * t2y - t1x * t3y) / 2);
  }

  async evals() {
      const ctx = await this.ctx
      let req = ctx.request.body
      console.log('当前计算的文字',req)
      if (!req || !req.str){
        return ''
      }
      let str = req.str
      if (str.length > 0){
        let data = eval(str)
          console.log(data)
          ctx.body = data
      }
  }

}

module.exports = RoofController