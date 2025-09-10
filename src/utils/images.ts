// src/utils/images.ts

export async function getFloatingImages() {
  // Use Vite's import.meta.glob to dynamically import all image files
  const imageModules = import.meta.glob('../assets/*.{png,jpg,jpeg,gif,webp,svg}', { 
    eager: false 
  });
  
  const images = await Promise.all(
    Object.entries(imageModules)
      .filter(([path]) => {
        // Extract filename and exclude files with "bg" in the name
        const filename = path.split('/').pop() || '';
        return !filename.toLowerCase().includes('bg');
      })
      .map(async ([path, importFn]) => {
        const module = await importFn();
        const filename = path.split('/').pop() || '';
        const altText = filename.replace(/\.[^/.]+$/, ""); // Remove extension
        
        return {
          src: (module as any).default,
          alt: altText,
          filename: filename
        };
      })
  );
  
  return images;
}
