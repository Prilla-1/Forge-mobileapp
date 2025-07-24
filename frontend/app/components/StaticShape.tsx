import React from 'react';
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ShapeType } from '../../constants/type';

const StaticShape = ({ shape }: { shape: ShapeType }) => {
  const { position, style, type, text, uri } = shape;

  const baseStyle = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
  };

  const viewStyle: ViewStyle = {
    ...baseStyle,
    width: style?.width,
    height: style?.height,
    backgroundColor: style?.backgroundColor,
    borderRadius: style?.borderRadius,
    borderWidth: style?.borderWidth,
    borderColor: style?.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  };

  const textStyle: TextStyle = {
    fontSize: style?.fontSize ?? 16,
    color: style?.color ?? '#000',
    fontWeight: style?.fontWeight ?? 'normal',
    fontStyle: style?.fontStyle ?? 'normal',
    textDecorationLine: style?.textDecorationLine ?? 'none',
    textAlign: 'center',
  };

  const imageStyle: ImageStyle = {
    ...baseStyle,
    width: style?.width ?? 100,
    height: style?.height ?? 100,
  };

  switch (type) {
    case 'rectangle':
    case 'oval':
      return (
        <View style={viewStyle}>
          {text && <Text style={textStyle}>{text}</Text>}
        </View>
      );

    case 'text':
      return (
        <Text style={[baseStyle, textStyle]}>
          {text}
        </Text>
      );

    case 'image':
      return (
        <Image
          source={{ uri }}
          style={imageStyle}
        />
      );

    default:
      return null;
  }
};

export default StaticShape;
