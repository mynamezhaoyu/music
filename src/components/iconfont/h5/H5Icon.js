/* eslint-disable */



const DEFAULT_STYLE = {
  display: 'block',
};

export const H5Icon = ({ color, name, size, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  switch (name) {
    case 'xiayishou5':
      return (
        <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
          <path
            d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m99.84 534.528L336.384 727.04c-8.192 6.144-19.456 6.656-28.672 2.048-9.216-4.608-14.848-14.336-14.848-24.576V319.488c0-10.24 5.632-19.456 14.848-24.576 9.216-4.608 19.968-4.096 28.672 2.048l274.944 192.512c7.168 5.12 11.776 13.312 11.776 22.528s-4.096 17.408-11.264 22.528z m118.784 165.376c0 17.408-14.336 32.256-32.256 32.256s-32.256-14.336-32.256-32.256V324.096c0-17.408 14.336-32.256 32.256-32.256s32.256 14.336 32.256 32.256v375.808z"
            fill={getIconColor(color, 0, '#e6e6e6')}
          />
        </svg>
      );
    case 'shangyishou5':
      return (
        <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
          <path
            d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0zM357.376 699.904c0 17.408-14.336 32.256-32.256 32.256s-32.256-14.336-32.256-32.256V324.096c0-17.408 14.336-32.256 32.256-32.256s32.256 14.336 32.256 32.256v375.808z m373.248 4.608c0 10.24-5.632 19.456-14.848 24.576-9.216 4.608-19.968 4.096-28.672-2.048l-275.456-192.512c-7.168-5.12-11.776-13.824-11.776-22.528s4.608-17.408 11.776-22.528L687.616 296.96c8.192-6.144 19.456-6.656 28.672-2.048 9.216 4.608 14.848 14.336 14.848 24.576v385.024z"
            fill={getIconColor(color, 0, '#e6e6e6')}
          />
        </svg>
      );
    case 'zanting':
      return (
        <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
          <path
            d="M874.058005 149.941995a510.06838 510.06838 0 1 0 109.740156 162.738976 511.396369 511.396369 0 0 0-109.740156-162.738976z"
            fill={getIconColor(color, 0, '#dbdbdb')}
          />
          <path
            d="M417.954256 281.533601a41.046923 41.046923 0 0 0-41.77128 40.201839v385.116718a41.892007 41.892007 0 0 0 83.663287 0v-385.116718a41.167649 41.167649 0 0 0-41.892007-40.201839zM606.045744 281.533601a41.046923 41.046923 0 0 0-41.77128 40.201839v385.116718a41.892007 41.892007 0 0 0 83.663287 0v-385.116718a41.167649 41.167649 0 0 0-41.892007-40.201839z"
            fill={getIconColor(color, 1, '#FFFFFF')}
          />
        </svg>
      );
    case 'bofang1':
      return (
        <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
          <path
            d="M512 512m-499.2 0a499.2 499.2 0 1 0 998.4 0 499.2 499.2 0 1 0-998.4 0Z"
            fill-opacity=".202"
            fill={getIconColor(color, 0, '#707070')}
          />
          <path
            d="M665.6 512L409.6 704V320z"
            fill={getIconColor(color, 1, '#ffffff')}
          />
        </svg>
      );

  }

  return null;
};

H5Icon.defaultProps = {
  size: 18,
};

/**
 * @param {string | string[] | undefined} color
 * @param {number} index
 * @param {string} defaultColor
 * @return {string}
 */
const getIconColor = (color, index, defaultColor) => {
  return color
    ? (
      typeof color === 'string'
        ? color
        : color[index] || defaultColor
    )
    : defaultColor;
};

export default H5Icon;
