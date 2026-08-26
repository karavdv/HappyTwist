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

//math.cos en math.sin gebruiken radianen, niet graden. Daarom moet je de graden omzetten naar radialen voordat je ze gebruikt in deze functies. radialen = graden * (π / 180).
// De hoek van 90 graden wordt afgetrokken omdat de standaardpositie van de cosinus- en sinusfuncties begint bij 0 graden (rechts), terwijl we willen dat de startpositie van de cirkel bovenaan is (90 graden).
export function getPointOnCircle(
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

export function createSegmentPath({ center, radius, startAngle, endAngle }: SegmentPathParams): string {
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