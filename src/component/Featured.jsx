import React from 'react'
import { Link } from 'react-router-dom'

const Featured = ({
  images,
  link,
  alt
                  }) => {
  //console.info(images);
  let featured = '/assets/imgs/nophoto.png'
  if (images && Array.isArray(images) && images.length > 0) {
    featured = images.find(image => image.isFeatured === 1);
    featured = featured.path;
  }
  return (
    <Link to={link}>
      <img className="w-full rounded-4xl p-4" src={featured}  alt={alt}/>
    </Link>
  )
}

export default Featured
