import React from 'react';

const NoPhoto = ({alt='', className='w-6'}) => {
    const src = '/assets/imgs/nophoto.png';
    return (
        <img className={className} src={src} alt={alt} />
    );
};

export default NoPhoto;