export function ShapeSquare(size: number): Path2D {
  const path = new Path2D();
  path.rect(-size/2, -size/2, size, size);
  return path;
}