import React from 'react';
import { Svg, Path, Line,Polygon } from 'react-native-svg';


export const EditIcon = (props:any) => (
  <Svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  {...props}
>
  <Path
    fill="none"
    stroke={props.stroke || "currentColor"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
  />
  <Line
    fill="none"
    stroke={props.stroke || "currentColor"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    x1="18" y1="9"
    x2="12" y2="15"
  />
  <Line
    fill="none"
    stroke={props.stroke || "currentColor"}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    x1="12" y1="9"
    x2="18" y2="15"
  />
</Svg>
);
export const DeleteIcon = (props:any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 6h18" />
    <Path d="M8 6v-2a2 2 0 012-2h4a2 2 0 012 2v2" />
    <Path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <Path d="M10 11v6" />
    <Path d="M14 11v6" />
  </Svg>
);

export const Delete2Icon = (props:any)=>(
  <Svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  {...props}
>
  <Path d="M3 6h18" />
  <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
  <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
</Svg>
);


export const StarIcon = (props:any)=>(

  <Svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  {...props}
>
  <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
</Svg>
);


