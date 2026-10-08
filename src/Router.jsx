import React from 'react';

export function usePathname() {
  return window.location.pathname;
}

export function Link({ to, ...props }) {
  return <a href={String(to ?? '/')} {...props} />;
}
