export type CalmingMethodSource = "catalog" | "custom";

export type CalmingMethod = {
    id: string;
    name: string;
    source: CalmingMethodSource;
};

export type CalmingMethodMediaType =
  | "image"
  | "animation"
  | "audio";

export type CalmingMethodMediaStorageType =
  | "bundled"
  | "local";

export type CalmingMethodMedia = {
  id: string;
  calmingMethodId: CalmingMethod["id"];
  mediaType: CalmingMethodMediaType;
  storageType: CalmingMethodMediaStorageType;
  mediaReference: string;
  purpose: string | null;
  variantGroup: string | null;
  sortOrder: number | null;
  durationMs: number | null;
  metadataJson: string | null;
};

export type CatalogCalmingMethodMedia = Omit<
  CalmingMethodMedia,
  "calmingMethodId"
>;

export type CatalogCalmingMethod = CalmingMethod & {
  media: readonly CatalogCalmingMethodMedia[];
};