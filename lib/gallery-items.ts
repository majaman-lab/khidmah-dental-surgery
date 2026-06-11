export type GalleryCategory = "Chamber" | "Equipment" | "Exterior";

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  category: GalleryCategory;
  width: number;
  height: number;
};

export const galleryCategories: GalleryCategory[] = ["Chamber", "Equipment", "Exterior"];

export const galleryItems: GalleryItem[] = [
  {
    src: "/images/khidmah-dental-chamber.jpg",
    alt: "Khidmah Dental Surgery chamber interior",
    title: "Treatment Chamber",
    category: "Chamber",
    width: 1536,
    height: 1024,
  },
  {
    src: "/images/IMG_0905.JPG",
    alt: "Treatment room at Khidmah Dental Surgery",
    title: "Dental Equipment",
    category: "Equipment",
    width: 4032,
    height: 3024,
  },
  {
    src: "/images/IMG_3849.JPG",
    alt: "Chamber interior at Khidmah Dental Surgery",
    title: "Treatment Chamber",
    category: "Chamber",
    width: 960,
    height: 720,
  },
  {
    src: "/images/IMG_3847.JPG",
    alt: "Reception and waiting area at Khidmah Dental Surgery",
    title: "Reception Area",
    category: "Chamber",
    width: 960,
    height: 720,
  },
  {
    src: "/images/IMG_3569.JPG",
    alt: "Chamber entrance at Khidmah Dental Surgery",
    title: "Clinic Entrance",
    category: "Exterior",
    width: 3024,
    height: 4032,
  },
  {
    src: "/images/IMG_3579.JPG",
    alt: "Entrance signboard at Khidmah Dental Surgery",
    title: "Entrance Signboard",
    category: "Exterior",
    width: 4032,
    height: 3024,
  },
  {
    src: "/images/IMG_3955.JPG",
    alt: "Exterior building view of Khidmah Dental Surgery",
    title: "Exterior View",
    category: "Exterior",
    width: 4032,
    height: 3024,
  },
];
