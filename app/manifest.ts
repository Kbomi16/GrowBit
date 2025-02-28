import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: '#355d39',
    background_color: '#ffffff',
    icons: [
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/icons/icon_maskable.png',
        type: 'image/png',
      },
      {
        purpose: 'any',
        sizes: '512x512',
        src: '/icons/icon_rounded.png',
        type: 'image/png',
      },
    ],
    orientation: 'any',
    display: 'standalone',
    dir: 'auto',
    lang: 'en-KO',
    name: 'GrowBit',
    short_name: 'GrowBit',
    start_url: '/',
    id: '/',
    description: '습관 기르기 애플리케이션',
  }
}
