export type GalleryCategory = "Doctor" | "Chamber" | "Equipment";

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  category: GalleryCategory;
  width: number;
  height: number;
};

export const galleryCategories: GalleryCategory[] = ["Doctor", "Chamber", "Equipment"];

export const galleryItems: GalleryItem[] = [];
