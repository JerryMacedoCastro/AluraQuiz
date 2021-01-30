import React from 'react';
import NextLink from 'next/link';

// eslint-disable-next-line react/prop-types
const Link = ({ children, href, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <a {...props}>{children}</a>
    </NextLink>
  );
};

export default Link;
