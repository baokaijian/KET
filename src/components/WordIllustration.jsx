import { useState } from "react";
import { wordById } from "../data/learning.js";
import { assetUrl } from "../utils/assets.js";

export default function WordIllustration({
  word,
  size = "large",
  className = "",
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const image = word?.image || wordById[word?.id]?.image;
  if (!image || !["pass", "fixed"].includes(image.reviewStatus)) return null;
  return (
    <div
      className={`word-photo ${size === "small" ? "small" : ""} ${className}`}
      data-testid={`word-image-${word.id}`}
    >
      {failedSrc === image.src ? (
        <p role="status">图片暂时无法加载</p>
      ) : (
        <img
          src={assetUrl(image.src)}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(image.src)}
        />
      )}
    </div>
  );
}
