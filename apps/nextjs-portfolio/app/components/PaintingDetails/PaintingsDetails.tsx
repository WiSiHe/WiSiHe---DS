"use client";
import useIsMobile from "@/hooks/useIsMobile";
import { PaintingQueryResult } from "@/sanity.types";
import { patchPaintingViews, urlForImage } from "@/sanity/lib/utils";
import { cn } from "@wisihe/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiLogoRedbubble, BiRightArrow } from "react-icons/bi";
import { BsClockFill, BsEye } from "react-icons/bs";
import Chip from "../Chip/Chip";

type PaintingDetailProps = {
  paintingData: Exclude<PaintingQueryResult, null>;
};

const PaintingDetail = ({ paintingData }: PaintingDetailProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasAddedView, setHasAddedView] = useState(false);
  // const [showAllDescription, setShowAllDescription] = useState(false);

  const constraintsRef = useRef(null);

  const {
    title,
    _id,
    views,
    description,
    tagsV2 = [],
    paintedAt,
    viewsCount,
    // format,
    image,
    images = [],
    video,
    redbubbleUrl,
  } = paintingData;

  // Combine the primary image + any additional images
  const allImages = [image, ...images];

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
  };

  const formattedPaintedAt = new Date(paintedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Which image is currently selected
  const currentImage = allImages[selectedIndex] || image;

  const isMobile = useIsMobile(768);

  // On mount, patch painting views
  useEffect(() => {
    const addView = async () => {
      const viewerId = generateOrRetrieveViewerId();

      if (
        Array.isArray(views) &&
        !views.some((view) => view.viewerId === viewerId) &&
        !hasAddedView
      ) {
        setHasAddedView(true);
        await patchPaintingViews(_id, viewerId);
      }
    };
    void addView();
  }, [_id, views, hasAddedView]);

  const generateOrRetrieveViewerId = (): string => {
    try {
      let viewerId = localStorage.getItem("viewerId");
      if (!viewerId) {
        viewerId = crypto.randomUUID();
        localStorage.setItem("viewerId", viewerId);
      }
      return viewerId;
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback if localStorage fails
      return crypto.randomUUID();
    }
  };

  const imageUrl =
    urlForImage(currentImage)?.width(1600).fit("max").format("webp").url() ??
    "";

  return (
    <div
      className="pt-20 min-h-[calc(100vh_-_5rem)] overflow-clip"
      ref={constraintsRef}
    >
      <section className="grid items-start grid-cols-12 gap-4 mx-auto text-white lg:gap-10 max-w-(--breakpoint-2xl)">
        <section className="relative flex flex-col items-center justify-center w-full p-4 lg:py-20 col-span-full">
          <motion.div
            layoutId={`image-${title}`}
            className="relative w-full aspect-square lg:aspect-auto h-full min-h-[50vh] lg:min-h-[90vh]" // ensure there's enough space for <Image fill />
          >
            {/* LQIP background placeholder */}
            <motion.img
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring" }}
              src={currentImage.lqip ?? ""}
              alt={title}
              className="absolute inset-0 object-contain w-full h-full scale-110 pointer-events-none blur-3xl"
              aria-hidden="true"
            />
            <div className="w-full h-full overflow-clip rounded-3xl">
              <Image
                src={imageUrl}
                alt={title}
                priority
                fill
                className="object-cover lg:object-contain rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1024px"
              />
            </div>
          </motion.div>
          {allImages.length > 1 && (
            <div className="z-10 flex items-center justify-center w-full gap-4 pt-4">
              {allImages.map((img, index) => {
                const thumbUrl =
                  urlForImage(img)?.width(100).height(100).quality(30).url() ??
                  "";
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectImage(index)}
                    className={cn(
                      "shrink-0 transition-transform hover:scale-105 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary",
                      index === selectedIndex ? "ring-3 ring-primary" : "",
                    )}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <Image
                      loading="lazy"
                      height={100}
                      width={100}
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1} for ${title}`}
                      className="object-cover object-top w-16 h-16 rounded-lg"
                    />
                  </motion.button>
                );
              })}
            </div>
          )}
        </section>
        <motion.aside
          layout
          className="z-10 flex flex-col items-center justify-center gap-5 pointer-events-none col-span-full lg:right-14 lg:bottom-4 lg:top-32 lg:fixed"
        >
          <motion.div
            initial={{ scale: 0.8, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0.9, x: -20 }}
            drag={!isMobile}
            whileDrag={{ scale: 1.05 }}
            transition={{ type: "spring" }}
            dragElastic={1} // Higher the value, the more elastic the drag
            dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }}
            dragConstraints={constraintsRef}
            className="w-full lg:rounded-lg pointer-events-auto h-fit lg:bg-dark/40 backdrop-blur-3xl p-4 lg:p-10 lg:max-w-[520px] lg:shadow-2xl lg:cursor-grab"
          >
            <div className={cn("pt-2 flex flex-col gap-4")}>
              <motion.h1
                // layoutId={`title-${title}`}
                className="text-3xl font-bold text-balance"
              >
                {title}
              </motion.h1>
              {tagsV2.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {/* Example Chip usage */}
                  <Chip
                    outlined
                    Icon={() => <BsClockFill className="size-4" />}
                    label={formattedPaintedAt}
                    size="small"
                  />
                  <Chip
                    outlined
                    Icon={() => <BsEye className="size-4" />}
                    label="Views:"
                    additionalText={viewsCount?.toString() ?? "0"}
                    // size="small"
                  />
                  {tagsV2.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/paintings?filter=${tag.name.toLocaleLowerCase()}`}
                    >
                      <Chip variation="primary" label={tag.name} />
                    </Link>
                  ))}
                </div>
              )}
              {redbubbleUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  <hr className="my-4 opacity-15" />

                  <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold">
                      Want to own this piece?
                    </h2>
                    <p>
                      This painting is available for purchase on my Redbubble
                      store.
                    </p>
                    <a
                      href={redbubbleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 mt-2 flex rounded-lg bg-[#e31421] hover:bg-[#e31421]/80 font-semibold text-white justify-center items-center gap-2 w-fit"
                    >
                      <BiLogoRedbubble className="inline" /> Go to store{" "}
                      <BiRightArrow />
                    </a>
                  </div>
                </motion.div>
              )}
              <h2 className="text-2xl font-bold">Description</h2>
              <p
                className={cn(
                  "prose-invert",
                  // showAllDescription ? 'line-clamp-none' : 'line-clamp-6'
                )}
              >
                {description}
              </p>
              {/* <div className="flex justify-end">
                <button
                  className="px-3 py-1 font-semibold text-white rounded-sm w-fit ring-primary ring-3 hover:bg-primary/10"
                  onClick={() => setShowAllDescription(!showAllDescription)}
                >
                  {showAllDescription ? 'Show less' : 'Show more'}
                </button>
              </div> */}
            </div>
          </motion.div>
        </motion.aside>
      </section>

      {/* Optional video below the image */}
      {video && (
        <div className="grid items-start max-w-(--breakpoint-lg) grid-cols-12 gap-10 py-20 mx-auto text-white">
          <div className="relative rounded-sm col-span-full aspect-video overflow-clip">
            <iframe
              src={`https://www.youtube.com/embed/${new URL(video).pathname.slice(1)}`}
              className="w-full h-full rounded-sm"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Connected Video"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaintingDetail;
