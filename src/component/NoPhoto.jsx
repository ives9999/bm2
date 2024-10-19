import React from 'react';

const NoPhoto = ({title=''}) => {
    const src = '/assets/imgs/nophoto.png';
    return (
        <img src={src} alt={title} />
    );
};

export default NoPhoto;