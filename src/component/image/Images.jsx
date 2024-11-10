import NoPhoto from "./NoPhoto";
import React from "react";
import {Link} from "react-router-dom";

export const Featured = ({row, link=null, className='w-6'}) => {
    //console.info(row);
    let res = <NoPhoto alt={row.name} className={className} />;
    if ('images' in row) {
        const images = row.images;
        let featured = images.find(image => image.isFeatured);
        const img = (featured) ? <img className={className} src={featured.path} alt={featured.name} /> : <NoPhoto alt={row.name} className={className} />
        res = (link) ? <Link to={link}>{img}</Link> : img;
    }
    return res;
}