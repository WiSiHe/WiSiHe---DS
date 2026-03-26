import { createFileRoute } from '@tanstack/react-router'
import { Button, Flex, Tag } from '@wisihe/ui-react'
import { cn } from '@wisihe/utils'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { BiLogoRedbubble, BiRightArrow } from 'react-icons/bi'
import { BsClockFill, BsEye } from 'react-icons/bs'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { getPainting } from '../server/fns'

export const Route = createFileRoute('/paintings/$slug')({
  loader: ({ params }) => getPainting({ data: params.slug }),
  component: PaintingDetail,
})

function PaintingDetail() {
  const painting = Route.useLoaderData()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  if (!painting) return <div>Painting not found</div>

  const {
    title,
    description,
    paintedAt,
    images,
    tags,
    video,
    redbubbleUrl,
    format,
    viewsCount,
  } = painting

  const aspectRatioClass = {
    landscape: 'aspect-video',
    portrait: 'aspect-3/4',
    square: 'aspect-square',
  }[format] || 'aspect-square'

  const formattedDate = new Date(paintedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="pt-32 min-h-screen pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Carousel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className={cn("relative overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl", aspectRatioClass)}>
            <div className="overflow-hidden h-full w-full" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((img, index) => (
                  <div key={img.url} className="relative flex-[0_0_100%] min-w-0 h-full">
                    <img
                      src={img.url}
                      alt={`${title} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {img.lqip && index === selectedIndex && (
                      <motion.div
                         initial={{ opacity: 1 }}
                         animate={{ opacity: 0 }}
                         transition={{ duration: 0.5 }}
                         className="absolute inset-0 bg-cover bg-center blur-2xl"
                         style={{ backgroundImage: `url(${img.lqip})` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface/80 backdrop-blur-md border border-border hover:bg-surface transition-all text-foreground"
                >
                  <IoChevronBack size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface/80 backdrop-blur-md border border-border hover:bg-surface transition-all text-foreground"
                >
                  <IoChevronForward size={24} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2">
              {images.map((img, index) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    index === selectedIndex ? "bg-accent scale-125" : "bg-border"
                  )}
                />
              ))}
            </div>
          )}

          {video && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Process Video</h3>
              <div className="aspect-video rounded-2xl overflow-hidden border border-border">
                <iframe
                   src={`https://www.youtube.com/embed/${new URL(video).pathname.slice(1)}`}
                   className="w-full h-full"
                   allowFullScreen
                   title={`${title} process video`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
          <Flex direction="column" gap={24}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
              
              <Flex gap={12} wrap="wrap" className="mb-6">
                <Flex align="center" gap={6} className="text-sm bg-surface px-3 py-1 rounded-full border border-border">
                  <BsClockFill className="text-accent" />
                  <span>{formattedDate}</span>
                </Flex>
                <Flex align="center" gap={6} className="text-sm bg-surface px-3 py-1 rounded-full border border-border">
                  <BsEye className="text-accent" />
                  <span>{viewsCount} views</span>
                </Flex>
              </Flex>

              <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap mb-8">
                {description}
              </p>

              {tags.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider mb-3">Tags</h4>
                  <Flex gap={8} wrap="wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} variant="outline" className="hover:border-accent hover:text-accent transition-colors">
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                </div>
              )}

              {redbubbleUrl && (
                <div className="p-6 rounded-2xl bg-surface border border-border shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Want to own this piece?</h3>
                  <p className="text-sm text-foreground/60 mb-4">Available for purchase on Redbubble.</p>
                  <Button 
                    className="w-full justify-center gap-2 py-6 text-lg font-bold"
                  >
                    <a href={redbubbleUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                      <BiLogoRedbubble size={24} />
                      Go to Store
                      <BiRightArrow />
                    </a>
                  </Button>
                </div>
              )}
            </motion.div>
          </Flex>
        </div>
      </div>
    </div>
  )
}
