import Svg, { Circle } from "react-native-svg";

type WheelProps = {
   size?: number;
};

export function Wheel({size = 280}: WheelProps) {
    const center = size / 2;
    const strokeWidth = 8;
    const radius = center - strokeWidth; // De helft van de rand is buiten de straal van de cirkel, dus met deze marge blijft de cirkel met rand binnen de SVG ruimte.

    return (
        <Svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        >
            <Circle
                cx={center} //Horizontale positie van het middelpunt van de cirkel
                cy={center} // Verticale positie van het middelpunt van de cirkel
                r={radius} // Straal van de cirkel
                fill="#F6C667"
                stroke="#603F2B" // Kleur van de rand van de cirkel
                strokeWidth={strokeWidth}    // Dikte van de rand van de cirkel
            />
        </Svg>
    );
}