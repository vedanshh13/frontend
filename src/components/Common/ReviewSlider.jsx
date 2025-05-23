import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"

// Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

// Icons
import { FaStar } from "react-icons/fa"

// Swiper modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// API
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const truncateWords = 15

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <div className="text-white text-center my-10">Loading reviews...</div>
  }

  return (
    <div className="text-white w-full">
      <div className="my-10 max-w-screen-xl mx-auto px-4 overflow-hidden">
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          spaceBetween={20}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide
              key={i}
              className="!w-[250px] md:!w-[280px] lg:!w-[300px]"
            >
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-md shadow-md h-full">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">
                      {`${review?.user?.firstName} ${review?.user?.lastName}`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName ?? "Unknown Course"}
                    </h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : `${review?.review}`}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">
                    {review?.rating?.toFixed(1) ?? "N/A"}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review?.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider

