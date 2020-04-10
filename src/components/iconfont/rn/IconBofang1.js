/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

export const IconBofang1 = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 512m-499.2 0a499.2 499.2 0 1 0 998.4 0 499.2 499.2 0 1 0-998.4 0Z"
        fill-opacity=".202"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M665.6 512L409.6 704V320z"
        fill={getIconColor(color, 1, '#FFFFFF')}
      />
    </Svg>
  );
};

IconBofang1.defaultProps = {
  size: 18,
};

export default IconBofang1;
