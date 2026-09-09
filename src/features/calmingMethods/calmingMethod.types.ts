export type CalmingMethodSource = "catalog" | "custom";
export type CalmingMethodImageType = "bundled" | "local";
export type CalmingMethod = {
    id: string;
    name: string;
    imageType: CalmingMethodImageType;
    imageReference: string;
    source: CalmingMethodSource;
};