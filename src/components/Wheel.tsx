import { useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg"; //G groepeert meerdere SVG-elementen zodat ze samen kunnen worden getransformeerd of gestyled. Hier een wielsegment met een label.

type Point = {
    x: number;
    y: number;
};

type SegmentPathParams = {
    center: number;
    radius: number;
    startAngle: number;
    endAngle: number;
};

type WheelProps = {
    size?: number;
};

const numberOfSegments = 7;

const MIN_METHODS = 3;
const MAX_METHODS = 7;
const DEFAULT_WHEEL_SIZE = 280;
const SEGMENT_COLORS = [
    "#F6C667",
    "#86D7C4",
    "#E896A7",
    "#91B8E5",
    "#C8A8E9",
    "#F29E68",
    "#A8CF8D",
];

//math.cos en math.sin gebruiken radianen, niet graden. Daarom moet je de graden omzetten naar radialen voordat je ze gebruikt in deze functies. radialen = graden * (π / 180).
// De hoek van 90 graden wordt afgetrokken omdat de standaardpositie van de cosinus- en sinusfuncties begint bij 0 graden (rechts), terwijl we willen dat de startpositie van de cirkel bovenaan is (90 graden).
function getPointOnCircle(
    center: number,
    radius: number,
    angleInDegrees: number,
): Point {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

    return {
        x: center + radius * Math.cos(angleInRadians), //Bereken de x-coördinaat van het punt op de cirkel met behulp van de cosinusfunctie. De cosinus van een hoek geeft de verhouding van de aangrenzende zijde tot de hypotenusa in een rechthoekige driehoek. Door deze waarde te vermenigvuldigen met de straal van de cirkel, krijgen we de horizontale afstand vanaf het middelpunt van de cirkel naar het punt op de omtrek.
        y: center + radius * Math.sin(angleInRadians), //Bereken de y-coördinaat van het punt op de cirkel met behulp van de sinusfunctie. De sinus van een hoek geeft de verhouding van de overstaande zijde tot de hypotenusa in een rechthoekige driehoek. Door deze waarde te vermenigvuldigen met de straal van de cirkel, krijgen we de verticale afstand vanaf het middelpunt van de cirkel naar het punt op de omtrek.
    };
}

function createSegmentPath({ center, radius, startAngle, endAngle }: SegmentPathParams): string {
    const startPoint = getPointOnCircle(center, radius, startAngle);
    const endPoint = getPointOnCircle(center, radius, endAngle);

    const angleSize = endAngle - startAngle;
    const largeArcFlag = angleSize > 180 ? 1 : 0;

    // M = move to xy. Hier begint het pad
    // L = line to xy. Hier wordt een lijn getrokken van het midden (M) naar de bovenkant van de cirkel.
    //A rx ry rotation largeArcFlag sweepFlag endX endY . Als rx (straal horizontale boog) en ry (straal verticale boog) gelijk zijn krijg je een cirkelboog, anders krijg je een elliptische boog. rotation = rotatie van de ellips in graden. largeArcFlag = 0 voor de korte boog, 1 voor de lange boog. sweepFlag = 0(links) of 1(rechts) bepaalt in welke richting de boog loopt. endX, endY = coördinaten van het eindpunt. De boog begint automatisch waar de vorige pathopdracht eindigde.
    //close path. Hiermee wordt het pad gesloten door een lijn te trekken van het huidige punt naar het startpunt van het pad.


    return [
        `M ${center} ${center}`,
        `L ${startPoint.x} ${startPoint.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`,
        "Z",
    ].join(" ");
}

export function Wheel({ size = 280 }: WheelProps) {
    // refs en states voor animatie van het wiel.
    const rotationValue = useRef(new Animated.Value(0)).current;
    const isSpinningRef = useRef(false); // een ref verandert onmiddelijk na de klik waardoor er geen snelle dubbele kliks kunnen gebeuren voor de state de UI heeft aangepast. Als er een ref is die true is, kan de gebruiker niet meer klikken totdat de animatie klaar is.
    const currentRotationRef = useRef(0); // een ref die de huidige rotatie van het wiel bijhoudt. Dit is nodig om te weten waar het wiel is gebleven na een draaiing, zodat de volgende draaiing vanaf dat punt kan beginnen.
    const [isSpinning, setIsSpinning] = useState(false);

    // transform: [{ rotate: verwacht een waarde in graden of radialen, RotationValue is een getal tussen 0 en 1. Interpolate verbind/vertaalt deze waarden van 0-1 naar een rotatiehoek in graden.
    const rotation = rotationValue.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    // Waarden voor het wiel en de segmenten.
    const center = size / 2;
    const strokeWidth = 8;
    const radius = center - strokeWidth / 2; // De helft van de rand is buiten de straal van de cirkel, dus met deze marge blijft de cirkel met rand binnen de SVG ruimte.
    const segmentAngle = 360 / numberOfSegments;

    //waarden voor de pointer boven het wiel. Alle waarden zijn relatief aan de grootte van het wiel, zodat het wiel en de pointer altijd in verhouding blijven zonder elke waarde opnieuw te moeten berekenen..
    const pointerHalfWidth = size * 0.055;
    const pointerHeight = size * 0.12;
    const pointerTop = strokeWidth / 2;

    //Pointer tekenen.
    const pointerPath = [
        `M ${center - pointerHalfWidth} ${pointerTop}`,
        `L ${center + pointerHalfWidth} ${pointerTop}`,
        `L ${center} ${pointerTop + pointerHeight}`,
        "Z",
    ].join(" ");

    //Segmenten van het wiel tekenen.
    const segments = Array.from(
        { length: numberOfSegments },
        (_, index) => {
            const startAngle = index * segmentAngle;
            const middleAngle = startAngle + segmentAngle / 2;
            const endAngle = (index + 1) * segmentAngle;

            const labelPoint = getPointOnCircle(
                center,
                radius * 0.65,
                middleAngle,
            );

            return {
                index,
                middleAngle,
                label: `${index + 1}`,
                labelPoint,
                path: createSegmentPath({
                    center,
                    radius,
                    startAngle,
                    endAngle,
                }),
            };
        },
    );

    // Functie om het wiel te laten draaien.

    function spinWheel() {
        if (isSpinningRef.current) { // Als de ref true is, betekent dit dat de animatie al bezig is, dus de functie wordt hier gestopt om dubbele spins te voorkomen.
            return;
        }

        isSpinningRef.current = true; // Zet de ref op true om aan te geven dat de animatie bezig is.
        setIsSpinning(true); // Update de state om de UI te laten weten dat de animatie bezig is.
        // Willekeurig segment kiezen.
        const selectedIndex = Math.floor(Math.random() * segments.length,); // math.floor rond naar beneden af. Math.random geeft een getal tssn 0 en net onder 1. Door deze willekeurige waarde te vermenigvuldigen met het aantal segmenten en dan naar beneden af te ronden krijgen we een index van een segment.
        const selectedSegment = segments[selectedIndex];
        // locatie berekenen waar het wiel moet stoppen.
        const landingRotation = (360 - selectedSegment.middleAngle);
        const currentRotation = currentRotationRef.current;
        const distanceToLanding = (landingRotation - currentRotation + 360) % 360;// +360 om negatieve waarden te voorkomen. %360 om waarden boven 360 terug te brengen naar een waarde tussen 0 en 360.
        const fullRotations = 5;
        const targetRotation = currentRotation + fullRotations * 360 + distanceToLanding;

        Animated.timing(rotationValue, {
            toValue: targetRotation,
            duration: 3500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: Platform.OS !== "web", // useNativeDriver werkt niet op web, dus alleen gebruiken op native platforms.
        }).start(({ finished }) => {
            if (finished) {
                currentRotationRef.current = landingRotation; // aantal graden opslaan van de eindpositie zonder de volledige rotaties, zodat de volgende draaiing vanaf dat punt kan beginnen.
                rotationValue.setValue(landingRotation);

                console.log(`Gekozen segment: ${selectedIndex + 1}`);
            }

            isSpinningRef.current = false; // Zet de ref terug op false om aan te geven dat de animatie is voltooid.
            setIsSpinning(false); // Update de state om de UI te laten weten dat de animatie is voltooid.
        });
    }

    // svg van de pointer staat binnen de pressable maar buiten de animated view, zodat de pointer niet meedraait met het wiel. De SVG van de pointer staat onder de animated view zodat de laag boven het wiel staat. De pointer heeft pointerEvents="none" zodat de gebruiker nog steeds op het wiel onder de pointer kan klikken om te draaien.
    return (
        <Pressable
            onPress={spinWheel}
            disabled={isSpinning}
            accessibilityRole="button"
            accessibilityLabel="Draai het wiel"
            style={{
                width: size,
                height: size,
            }}
        >
            <Animated.View
                style={{
                    width: size,
                    height: size,
                    transform: [{ rotate: rotation }],
                }}
            >
                <Svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                >
                    {segments.map((segment) => (
                        <G key={segment.index}>
                            <Path
                                d={segment.path}
                                fill={SEGMENT_COLORS[segment.index]}
                                stroke="#603F2B"
                                strokeWidth={strokeWidth}
                                strokeLinejoin="round"
                            />
                            <SvgText
                                x={segment.labelPoint.x}
                                y={segment.labelPoint.y}
                                fill="#3D2A20"
                                fontSize={28}
                                fontWeight="bold"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {segment.label}
                            </SvgText>
                        </G>
                    ))}
                </Svg>
            </Animated.View>
            <Svg
                width={size}
                height={size}
                viewBox={`0 20 ${size} ${size}`}
                style={styles.pointerOverlay}
            >
                <Path
                    d={pointerPath}
                    fill="#F06565"
                    stroke="#603F2B"
                    strokeWidth={2}
                    strokeLinejoin="round"
                />
            </Svg>
        </Pressable>
    );

};

const styles = StyleSheet.create({
    pointerOverlay: {
        position: "absolute", // de pointer wordt bovenop het wiel geplaatst door absolute positionering. Hierdoor kan de pointer boven het wiel worden weergegeven, ongeacht de positie van het wiel zelf.
        zIndex: 1, // de pointer wordt bovenop het wiel geplaatst door een hogere z-index. Hierdoor wordt de pointer weergegeven boven andere elementen die een lagere z-index hebben.
        top: -20,
        left: 0, //zorgen dat het SVG-tekengebied van de pointer op dezelfde plaats begint als dat van het wiel waardoor center voor beiden ook hetzelfde is.
        pointerEvents: "none",
    },
});
