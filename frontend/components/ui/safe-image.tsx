"use client"

/**
 * SafeImage — A drop-in replacement for next/image that gracefully handles
 * Cloudinary outages or broken image URLs.
 *
 * If an image fails to load (e.g. Cloudinary is down or deactivated),
 * it silently swaps to the fallback src instead of showing a broken image icon.
 *
 * Usage:
 *   import SafeImage from "@/components/ui/safe-image"
 *   <SafeImage src={cloudinaryUrl} alt="..." fill fallbackSrc="/placeholder.webp" />
 */

import Image, { ImageProps } from "next/image"
import { useState } from "react"

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  /** URL to show if the primary src fails. Defaults to /placeholder.webp */
  fallbackSrc?: string
  /** Extra className to apply to the wrapping div when showing the fallback */
  fallbackClassName?: string
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/1000642616.webp",
  fallbackClassName,
  className,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasFailed, setHasFailed] = useState(false)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={`${className ?? ""} ${hasFailed ? (fallbackClassName ?? "") : ""}`.trim()}
      onError={() => {
        if (!hasFailed) {
          setHasFailed(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
