// src/utils/images.ts
export const FLOATING_IMAGES = [
  'aufw2.jpg',
  'ice.jpg', 
  'PBH_FACT.gif',
  'PBH_FOTO.gif',
  'PBH_HOME.gif',
  'PBH_NEWS.gif',
  'titel01c.gif',
  'screenshot.png',
  'icon-1.png',
  'icon-2.png',
  'icon-3.png',
  'flyer-1.png',
  'flyer-2.png',
  'flyer-3.png',
  'flyer-4.png',
  'flyer-5.png',
  'flyer-6-qrcodes.png'
];

export async function getFloatingImages() {
  const modules = await Promise.all(
    FLOATING_IMAGES.map(async (filename) => {
      const module = await import(`../assets/${filename}`);
      return {
        src: module.default,
        alt: filename.replace(/\.[^/.]+$/, "") // Remove extension for alt text
      };
    })
  );
  return modules;
}
