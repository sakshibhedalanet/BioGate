import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { THEME_COLORS } from '../constants/theme';

interface LogoProps {
  size?: number;
  color?: string;
  type?: 'monochrome' | 'white' | 'black';
}

const Logo: React.FC<LogoProps> = ({ size = 100, color = THEME_COLORS[0], type = 'monochrome' }) => {
  const fillColor = type === 'white' ? '#FFFFFF' : type === 'black' ? '#000000' : color;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G>
          <Rect x="10" y="10" width="80" height="80" stroke={fillColor} strokeWidth="8" fill="none" />
          <Path
            d="M35 30V70H50C60 70 65 65 65 58C65 53 62 50 58 50C62 50 65 47 65 42C65 35 60 30 50 30H35ZM45 40H50C53 40 55 41 55 43C55 45 53 46 50 46H45V40ZM45 54H50C54 54 56 55 56 58C56 61 54 62 50 62H45V54Z"
            fill={fillColor}
          />
        </G>
      </Svg>
    </View>
  );
};

export default Logo;
