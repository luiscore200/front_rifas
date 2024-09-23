import React from 'react';
import { Svg, Path, Line,Polygon, Circle, Polyline, Text } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

export const EditIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.stroke || "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" />
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

interface yyy{
  number:number,
  border:string,
  style:any

}

export const StarIcon2 = (obj:yyy)=>(

<Svg
    viewBox="0 0 24 24"
    width="24"
    
    height="24"
    fill="currentColor" // Color de relleno de la estrella
  // Ancho del contorno
    {...obj.style}
  >
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
      stroke={obj.border||"none"} // Color del contorno
      strokeWidth="1" />
    <Text
      x="12"
      y="15"
      fontSize="10"
      fontWeight='500'
      fill="black"
      textAnchor="middle"
      alignmentBaseline="middle"
      
    >
    {obj.number}
    </Text>
  </Svg>
);




export const ShareIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.stroke || "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Path d="M8.59 13.51L15.42 17.49" />
    <Path d="M15.41 6.51L8.59 10.49" />
  </Svg>
);

export const WinnerIcon = (props: any) => (
  <Svg {...props} xmlns="http://www.w3.org/2000/svg" 
  width="24" 
  height="24"
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
  {...props}>

  <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
  <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
  <Path d="M4 22h16" />
  <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
  <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
  <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
</Svg>

);

export const CheckIcon = (props:any) => (
  <Svg {...props} xmlns="http://www.w3.org/2000/svg" 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
  {...props}>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Polyline points="16 11 18 13 22 9" />
    </Svg>
);

export const MenuIcon1 = (props:any)=>(
  <Svg {...props} xmlns="http://www.w3.org/2000/svg" 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
  {...props}>
  <Circle cx="12" cy="2" r="1" />
  <Circle cx="12" cy="10" r="1" />
  <Circle cx="12" cy="18" r="1" />
</Svg>
);

export const MenuIcon2 = (props: any) => (
  <Svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1="3" y1="12" x2="21" y2="12" />
    <Line x1="3" y1="6" x2="21" y2="6" />
    <Line x1="3" y1="18" x2="21" y2="18" />
  </Svg>  
);


export const PlusIcon = (props:any)=>(
  <Svg {...props} xmlns="http://www.w3.org/2000/svg" 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
  {...props}>
  <Line x1="12" y1="4" x2="12" y2="21" />
  <Line x1="4" y1="12" x2="21" y2="12" />
</Svg>
);

export const CheckMarkIcon = (props:any)=> (
  <Svg
  {...props}
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
  <Path d="M6 12l4 4L18 6" />
</Svg>
);

export const CrossMarkIcon = (props:any)=> (
  <Svg
  {...props}
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
<Path d="M7 17L17 7M7 7L17 17" />
</Svg>
);


export const EyeIcon = (props: any) => (
  <Svg
    {...props}
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
    <Path d="M1 12C2.5 7.5 6.5 4.5 12 4.5s9.5 3 11 7.5c-1.5 4.5-5.5 7.5-11 7.5S2.5 16.5 1 12z" 
    fill='currentColor'/>
    <Circle cx="12" cy="12" r="7.5"  fill={props.bgc?props.bgc:'#fff'}/>
    <Circle cx="12" cy="12" r="3.5"  fill='currentColor'/>
    <Circle cx="14" cy="9" r="1.5" stroke={props.bgc?props.bgc:'#fff'}  fill={props.bgc?props.bgc:'#fff'}/>
  </Svg>
);

export const QuestionMarkIcon = (props: any) => (
  <Svg
  {...props}
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <Path d="M12 18h0" /> {/* Punto inferior del signo de interrogación */}
  <Path d="M12 15v-2" /> {/* Palito recto vertical */}
  <Path d="M12 12c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3" />
</Svg>
);

export const InfoIcon = (props: any) => (
  <Svg {...props}  width={24} height={24}>
  <Path
    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</Svg>
);

export const UpIcon = (props: any) => (
  <Svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <Path 
      d="M5.5 12l7-7 7 7"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const NextIcon = (props: any) => (
  <Svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <Path 
      d="M9 18l6-6-6-6" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const PrevIcon = (props: any) => (
  <Svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <Path 
      d="M15 18l-6-6 6-6" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);
export const BackIcon = (props: any) => (
  <Svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <Path 
      d="M19 12H5M12 19l-7-7 7-7" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);



// Componente del icono de la campana
const BellIcon = (props:any) => (
  <Svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></Path>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0"></Path>
  </Svg>
);

// Componente del contador de notificaciones
const NotificationCounter = ({ number }:any) => (
  <Svg
 
   
    width="20"
    height="20"
    viewBox="0 0 26 26"
    fill="none"
  >
    <Circle
      cx="12"
      cy="12"
      r="12"
      fill="red"
    />
    <Text
      x="12"
      y="12"
      fontSize="14"
      fontWeight="700"
      fill="white"
      textAnchor="middle"
      alignmentBaseline="middle"
    >
      {number}
    </Text>
  </Svg>
);

// Componente que superpone los SVGs
export const NotificationBellIcon = ({ style, number }:any) => (
  <View style={[styles.container, style]}>
    <BellIcon style={style} />
    {number !== undefined && number > 0 && (
      <View style={styles.counterContainer}>
        <NotificationCounter number={number} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  counterContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
});


