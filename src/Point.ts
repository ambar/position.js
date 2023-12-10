export class Point {
  static Zero = new Point(0, 0)

  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y)
  }

  subtract(point: Point) {
    return new Point(this.x - point.x, this.y - point.y)
  }

  negative() {
    return new Point(-this.x, -this.y)
  }
}
