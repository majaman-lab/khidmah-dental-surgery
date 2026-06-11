"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery-items";
import { cn } from "@/lib/utils";

const allCategory = "All";
type ActiveCategory = typeof allCategory | GalleryCategory;
const categoryOptions: ActiveCategory[] = [allCategory, ...galleryCategories];

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>(allCategory);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>(galleryItems);

  useEffect(() => {
    let mounted = true;

    fetch("/api/gallery")
      .then((response) => response.json())
      .then((data: { items?: GalleryItem[] }) => {
        if (mounted && data.items?.length) {
          setItems(data.items);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === allCategory) {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const activeIndex = activeItem ? filteredItems.findIndex((item) => item.src === activeItem.src) : -1;

  function showRelativeImage(direction: -1 | 1) {
    if (!activeItem || filteredItems.length === 0) {
      return;
    }

    const nextIndex = (activeIndex + direction + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[nextIndex]);
  }

  return (
    <section id="gallery" className="section-shell content-section scroll-mt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Gallery</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Real chamber moments
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Browse official Khidmah Dental Surgery photos of the chamber, treatment room, reception, and location.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "h-10 rounded-md border px-4 text-sm font-bold transition",
                activeCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:text-primary",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {filteredItems.length > 0 ? (
        <motion.div layout className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filteredItems.map((item, index) => (
            <motion.button
              key={item.src}
              type="button"
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActiveItem(item)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
              <div className="border-t border-border bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {item.category}
                </p>
                <h3 className="mt-1 text-base font-bold">{item.title}</h3>
              </div>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-lg border border-dashed border-primary/30 bg-white/82 p-8 text-center shadow-sm"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-accent text-primary">
            <Camera className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-xl font-bold">No photos in this category</h3>
          <p className="mx-auto mt-3 max-w-2xl leading-8 text-muted-foreground">
            Choose another category to view more real Khidmah Dental Surgery photos.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-foreground/88 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
          >
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-foreground shadow-sm"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {filteredItems.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => showRelativeImage(-1)}
                  className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white text-foreground shadow-sm sm:flex"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => showRelativeImage(1)}
                  className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white text-foreground shadow-sm sm:flex"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            ) : null}

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.26 }}
              className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft"
            >
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                width={activeItem.width}
                height={activeItem.height}
                sizes="100vw"
                className="max-h-[78vh] w-full object-contain"
                priority
              />
              <div className="flex items-start gap-3 p-5">
                <Camera className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {activeItem.category}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{activeItem.title}</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
