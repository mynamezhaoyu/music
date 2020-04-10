/* eslint-disable */


import IconBofang1 from './IconBofang1';
import IconBofang from './IconBofang';

export const RNIcon = ({ name, ...rest }) => {
  switch (name) {
    case 'bofang1':
      return <IconBofang1 {...rest} />;
    case 'bofang':
      return <IconBofang {...rest} />;
  }

  return null;
};

export default RNIcon;
