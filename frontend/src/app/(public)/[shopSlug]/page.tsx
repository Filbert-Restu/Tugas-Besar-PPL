import React from 'react';

export default function Page({ params }: { params: { shopSlug: string } }) {
  return <div>{params.shopSlug}</div>;
}
