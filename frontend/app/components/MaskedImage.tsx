
import React from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  ClipPath,
  Rect,
  Circle,
  Ellipse,
  Polygon,
  Image as SvgImage,
} from 'react-native-svg';

type ShapeType = 'rectangle' | 'circle' | 'oval' | 'diamond' | 'square';

interface MaskedImageProps {
  shape: ShapeType;
  imageUri: string;
  width: number;
  height: number;
}

const MaskedImage: React.FC<MaskedImageProps> = ({ shape, imageUri, width, height }) => {
  const renderClipPath = () => {
    switch (shape) {
      case 'circle':
        const radius = Math.min(width, height) / 2;
        return <Circle cx={width / 2} cy={height / 2} r={radius} />;
      case 'oval':
        return <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} />;
      case 'diamond':
        return (
          <Polygon
            points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
          />
        );
      case 'square':
        const side = Math.min(width, height);
        return <Rect x={(width - side) / 2} y={(height - side) / 2} width={side} height={side} />;
      case 'rectangle':
      default:
        return <Rect x="0" y="0" width={width} height={height} />;
    }
  };

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <ClipPath id="clip">{renderClipPath()}</ClipPath>
        </Defs>
        <SvgImage
          href={{ uri: imageUri }}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#clip)"
        />
      </Svg>
    </View>
  );
};

export default MaskedImage;
