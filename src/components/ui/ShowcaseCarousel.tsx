import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { formatDateSafe } from "../../utils/DateFormatter";
import { templatesWithTheirIds } from "../../data/TemplateIds";
import type { Swiper as SwiperType } from "swiper";

interface ShowcaseCarouselProps {
  items: any[];
  type: "project" | "render";
}

export const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({
  items,
  type,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <div 
      className="relative w-full py-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Optional gradient background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 opacity-10 blur-3xl rounded-3xl"></div>
      
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop={true}
        loopedSlides={items.length}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper relative z-10 pb-12"
        style={{
          '--swiper-pagination-color': '#a78bfa',
          '--swiper-pagination-bullet-inactive-color': '#ffffff',
          '--swiper-pagination-bullet-inactive-opacity': '0.4',
          '--swiper-pagination-bullet-size': '10px',
          '--swiper-pagination-bullet-horizontal-gap': '6px',
        } as React.CSSProperties}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={`${item.id}-${index}`}
            onClick={() => handleSlideClick(index)}
            className="!w-[240px] sm:!w-[280px] md:!w-[320px] lg:!w-[340px] cursor-pointer"
          >
            <div className="relative rounded-2xl overflow-hidden group shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_35px_rgba(80,63,205,0.4)] transition-all duration-500">
              {/* Video or Image preview */}
              <div
                className="relative h-56 sm:h-64 overflow-hidden bg-gray-900"
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector("video");
                  if (video) {
                    video.playbackRate = 2;
                    video.play();
                  }
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector("video");
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                {type === "project" ? (
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={item.projectVidUrl}
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).poster =
                        "https://via.placeholder.com/300x200/1e1e1e/ffffff?text=Preview+Unavailable";
                    }}
                  />
                ) : item.type === "mp4" || item.type === "webm" ? (
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={item.outputUrl}
                  />
                ) : item.type === "gif" ? (
                  <img
                    src={item.outputUrl}
                    alt="GIF Render"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-300">
                    No preview
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                {/* Category tag */}
                <div className="absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold uppercase rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-sm">
                  {type === "project" ? "Template" : "Render"}
                </div>
              </div>

              <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                <h3 className="text-sm sm:text-base font-semibold leading-tight mb-1 truncate">
                  {type === "project"
                    ? item.title
                    : type === "render"
                    ? templatesWithTheirIds?.[String(item.templateId)] ||
                      "Unknown Template"
                    : "Rendered Video"}
                </h3>
                <p className="text-xs text-gray-300 truncate">
                  {type === "render"
                    ? "Rendered at: " + formatDateSafe(item.renderedAt)
                    : type === "project"
                    ? "Created at: " + formatDateSafe(item.createdAt)
                    : "Click to preview or edit"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom styled pagination CSS - add to your global CSS or style tag */}
      <style>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 100%);
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.6);
        }
      `}</style>
    </div>
  );
};