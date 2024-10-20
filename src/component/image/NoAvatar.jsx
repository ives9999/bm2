import React from 'react';

const NoAvatar = ({title=''}) => {
    const src = '/assets/imgs/noavatar.png';
    return (
        <img src={src} alt={title} />
    );
};

export default NoAvatar;