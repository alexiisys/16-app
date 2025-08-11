import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Moon = ({
  width = 18,

  height = 18,

  color = '#050506',

  ...props
}: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" {...props}>
    <Path
      d="M9 2.25C8.1049 3.14511 7.60203 4.35913 7.60203 5.625C7.60203 6.89087 8.1049 8.10489 9 9C9.89511 9.89511 11.1091 10.398 12.375 10.398C13.6409 10.398 14.8549 9.89511 15.75 9C15.75 10.335 15.3541 11.6401 14.6124 12.7501C13.8707 13.8601 12.8165 14.7253 11.5831 15.2362C10.3497 15.7471 8.99252 15.8808 7.68314 15.6203C6.37377 15.3599 5.17104 14.717 4.22703 13.773C3.28303 12.829 2.64015 11.6262 2.3797 10.3169C2.11925 9.00749 2.25292 7.65029 2.76382 6.41689C3.27471 5.18349 4.13987 4.12928 5.2499 3.38758C6.35994 2.64588 7.66498 2.25 9 2.25Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M15 2.25V5.25"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M16.5 3.75H13.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
