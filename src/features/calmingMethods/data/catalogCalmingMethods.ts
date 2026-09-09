import type { CalmingMethod } from "../calmingMethod.types";

//readonly zorgt dat acties zoals push, pop, shift, unshift, splice niet kunnen worden uitgevoerd op de array. De array kan niet worden gewijzigd na de initiële toewijzing.
export const CATALOG_CALMING_METHODS: readonly CalmingMethod[] = [
    {
        id: "catalog-calm-breathing",
        name: "Rustig ademen",
        imageType: "bundled",
        imageReference: "calm-breathing",
        source: "catalog",
    },
    {
        id: "catalog-count-to-ten",
        name: "Tot tien tellen",
        imageType: "bundled",
        imageReference: "count-to-ten",
        source: "catalog",
    },
    {
        id: "catalog-drink-water",
        name: "Water drinken",
        imageType: "bundled",
        imageReference: "drink-water",
        source: "catalog",
    },
    {
        id: "catalog-stretch",
        name: "Even stretchen",
        imageType: "bundled",
        imageReference: "stretch",
        source: "catalog",
    },
    {
        id: "catalog-hug",
        name: "Een knuffel vragen",
        imageType: "bundled",
        imageReference: "hug",
        source: "catalog",
    },
    {
        id: "catalog-quiet-place",
        name: "Een rustig plekje zoeken",
        imageType: "bundled",
        imageReference: "quiet-place",
        source: "catalog",
    },
    {
        id: "catalog-scream-into-pillow",
        name: "In een kussen schreeuwen",
        imageType: "bundled",
        imageReference: "scream-into-pillow",
        source: "catalog",
    },
    {
        id: "catalog-push-anger-away",
        name: "De boosheid wegduwen",
        imageType: "bundled",
        imageReference: "push-anger-away",
        source: "catalog",
    },
    {
        id: "catalog-five-four-three-two-one",
        name: "De 5-4-3-2-1-methode",
        imageType: "bundled",
        imageReference: "five-four-three-two-one",
        source: "catalog",
    },
    {
        id: "catalog-hit-pillow",
        name: "Op een dik kussen slaan",
        imageType: "bundled",
        imageReference: "hit-pillow",
        source: "catalog",
    },
    {
        id: "catalog-dance-anger-away",
        name: "De boosheid wegdansen",
        imageType: "bundled",
        imageReference: "dance-anger-away",
        source: "catalog",
    },
];