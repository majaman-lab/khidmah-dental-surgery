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

export const galleryItems: GalleryItem[] = [
  {
    src: "/images/doctor-portrait.png",
    alt: "Dr. Md. Iqbal Hossain at Khidmah Dental Surgery",
    title: "Dr. Md. Iqbal Hossain",
    category: "Doctor",
    width: 1304,
    height: 1694,
  },
  {
    src: "/images/khidmah-dental-chamber.jpg",
    alt: "Khidmah Dental Surgery chamber interior",
    title: "Chamber Showcase",
    category: "Chamber",
    width: 1536,
    height: 1024,
  },
  {
    src: "/images/IMG_0905.JPG",
    alt: "Treatment room at Khidmah Dental Surgery",
    title: "Treatment Room",
    category: "Equipment",
    width: 4032,
    height: 3024,
  },
  {
    src: "/images/IMG_3849.JPG",
    alt: "Chamber interior at Khidmah Dental Surgery",
    title: "Chamber Interior",
    category: "Chamber",
    width: 960,
    height: 720,
  },
  {
    src: "/images/IMG_3847.JPG",
    alt: "Waiting area at Khidmah Dental Surgery",
    title: "Waiting Area",
    category: "Chamber",
    width: 960,
    height: 720,
  },
  {
    src: "/images/IMG_3569.JPG",
    alt: "Chamber entrance at Khidmah Dental Surgery",
    title: "Chamber Entrance",
    category: "Chamber",
    width: 3024,
    height: 4032,
  },
  {
    src: "/images/IMG_3579.JPG",
    alt: "Khidmah Dental Surgery entrance signboard",
    title: "Entrance Signboard",
    category: "Chamber",
    width: 4032,
    height: 3024,
  },
];
