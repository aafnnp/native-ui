import React from "react";

export type SvgProps = React.SVGProps<SVGSVGElement>;

/**
 * Web 环境下的 react-native-svg 兼容层
 */
const Svg = React.forwardRef<SVGSVGElement, SvgProps>(function Svg(props, ref) {
  return <svg ref={ref} {...props} />;
});

export const Path = React.forwardRef<SVGPathElement, React.SVGProps<SVGPathElement>>(
  function Path(props, ref) {
    return <path ref={ref} {...props} />;
  },
);

export const G = React.forwardRef<SVGGElement, React.SVGProps<SVGGElement>>(function G(
  props,
  ref,
) {
  return <g ref={ref} {...props} />;
});

export const Circle = React.forwardRef<
  SVGCircleElement,
  React.SVGProps<SVGCircleElement>
>(function Circle(props, ref) {
  return <circle ref={ref} {...props} />;
});

export const Line = React.forwardRef<SVGLineElement, React.SVGProps<SVGLineElement>>(
  function Line(props, ref) {
    return <line ref={ref} {...props} />;
  },
);

export const Polyline = React.forwardRef<
  SVGPolylineElement,
  React.SVGProps<SVGPolylineElement>
>(function Polyline(props, ref) {
  return <polyline ref={ref} {...props} />;
});

export const Rect = React.forwardRef<SVGRectElement, React.SVGProps<SVGRectElement>>(
  function Rect(props, ref) {
    return <rect ref={ref} {...props} />;
  },
);

export const Polygon = React.forwardRef<
  SVGPolygonElement,
  React.SVGProps<SVGPolygonElement>
>(function Polygon(props, ref) {
  return <polygon ref={ref} {...props} />;
});

export default Svg;
