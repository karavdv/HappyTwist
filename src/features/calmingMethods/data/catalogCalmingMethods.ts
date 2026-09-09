import type { CatalogCalmingMethod, } from "../calmingMethod.types";

//readonly zorgt dat acties zoals push, pop, shift, unshift, splice niet kunnen worden uitgevoerd op de array. De array kan niet worden gewijzigd na de initiële toewijzing.
export const CATALOG_CALMING_METHODS: readonly CatalogCalmingMethod[] = [
    {
        id: "catalog-calm-breathing",
        name: "Rustig ademen",
        source: "catalog",
        media: [
            {
                id: "catalog-calm-breathing-owl-image",
                mediaType: "image",
                storageType: "bundled",
                mediaReference: "calm-breathing-owl-image",
                purpose: "thumbnail",
                variantGroup: null,
                sortOrder: null,
                durationMs: null,
                metadataJson: null,
            },
            {
                id: "catalog-calm-breathing-owl-loop",
                mediaType: "animation",
                storageType: "bundled",
                mediaReference: "calm-breathing-owl-loop",
                purpose: "loop",
                variantGroup: "calm-breathing-main",
                sortOrder: null,
                durationMs: 12_000,
                metadataJson: null,
            },
        ],
    },
    {
        id: "catalog-count-to-ten",
        name: "Tot tien tellen",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-drink-water",
        name: "Water drinken",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-stretch",
        name: "Even stretchen",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-hug",
        name: "Een knuffel vragen",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-quiet-place",
        name: "Een rustig plekje zoeken",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-scream-into-pillow",
        name: "In een kussen schreeuwen",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-push-anger-away",
        name: "De boosheid wegduwen",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-five-four-three-two-one",
        name: "De 5-4-3-2-1-methode",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-hit-pillow",
        name: "Op een dik kussen slaan",
        source: "catalog",
        media: [],
    },
    {
        id: "catalog-dance-anger-away",
        name: "De boosheid wegdansen",
        source: "catalog",
        media: [],
    },
];