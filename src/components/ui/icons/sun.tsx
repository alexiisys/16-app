import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Sun = ({
  width = 28,

  height = 28,

  color = '#CDAB46',

  ...props
}: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 28 28" fill="none" {...props}>
    <Path
      d="M13.9999 18.6667C16.5772 18.6667 18.6666 16.5773 18.6666 14C18.6666 11.4227 16.5772 9.33333 13.9999 9.33333C11.4226 9.33333 9.33325 11.4227 9.33325 14C9.33325 16.5773 11.4226 18.6667 13.9999 18.6667Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M14 4.66667H14.0117"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M23.3333 14H23.3449"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M14 23.3333H14.0117"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M4.66675 14H4.67841"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M20.5999 7.40016H20.6115"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M20.5999 20.5998H20.6115"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M7.40015 20.5998H7.41181"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M7.40015 7.40016H7.41181"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
