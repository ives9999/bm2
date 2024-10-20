import NoPhoto from "./NoPhoto";
import React from "react";

export const Featured = ({row, className='w-6'}) => {
    //console.info(row);
    if ('images' in row) {
        const images = row.images;
        let featured = images.find(image => image.isFeatured);
        if (featured) {
            return <img className={className} src={featured.path} alt={featured.name} />
        } else {
            return <NoPhoto alt={row.name} className={className} />
        }
    }
    return <NoPhoto alt={row.name} className={className} />
}