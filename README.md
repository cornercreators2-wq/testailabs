# AI Creator Lab — ready for Vercel

This is a plain HTML, CSS and JavaScript website. Images and fonts are included as separate files. There is no build step, framework, package installation or environment variable to configure.

## Deploy

1. Extract this ZIP.
2. Upload the extracted contents to your GitHub repository, with `index.html` and `vercel.json` at the repository root. Upload the files and folders, not the ZIP itself.
3. Import that repository into Vercel, or redeploy your existing linked project.
4. Confirm the settings below. The included `vercel.json` already supplies the build and output settings.

| Vercel setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | The folder containing `index.html` and `vercel.json`; normally the repository root |
| Build Command | Empty / disabled |
| Install Command | Empty / disabled |
| Output Directory | `.` |

Alternatively, run `npx vercel --prod` inside the extracted folder that contains `index.html`.

Do not select `public`, `dist`, `build`, or `assets` as the output directory. If you put this entire package inside another repository folder, select that enclosing folder as Vercel's Root Directory.

## Why the earlier ZIP could show 404

The earlier archive put the homepage at `/index.html` but the images in `/public/images/`, while the HTML requested `/images/`. Vercel's static preset can choose `public` as its output when that folder exists, leaving the homepage outside the deployed output. Serving the archive root instead makes those image URLs miss their files. This package uses one consistent root and explicitly sets its output to `.`.

Reference: [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build).

## Included files

- `index.html`: the complete landing page.
- `assets/css/`: separate stylesheet.
- `assets/js/`: deferred page behavior and the original provider integrations.
- `assets/images/`: original image assets, responsive versions, local case-study thumbnails and the existing training-video poster.
- `assets/fonts/`: local Inter and Sora fonts, with their licenses.
- `favicon.png`: the original logo as a browser icon.
- `vercel.json`: static deployment settings and cache headers.

The archive has no extra enclosing folder, so `index.html` is immediately at its root.

## Optimizations

- Removed every base64 image from the HTML, deduplicating the repeated logos.
- Restored the correct original logo, meetup photo, testimonial images and image order from the supplied standalone HTML.
- Kept full-resolution original images and added responsive WebP sizes for smaller displays.
- Added native lazy loading below the fold, asynchronous image decoding and explicit dimensions to reserve image space.
- Prioritized the training-video poster; bundled the fonts and YouTube thumbnails locally.
- Moved CSS and JavaScript into separately cacheable files. The JavaScript is deferred.
- Load Typeform when the form approaches the viewport or an Apply button is clicked. Load YouTube players only after activation.
- Preserve the original Vidalytics embed, Typeform ID, video IDs, and `ref` / `trakyo_id` attribution from query parameters or hash parameters.
- Cache assets with content-based filenames for one year. Revalidate HTML so new deployments appear promptly.
- Reduce animation work on small screens and respect reduced-motion preferences.
- Fix narrow-screen overflow and improve keyboard access to video controls and the terms popup.

The HTML is approximately 97% smaller than the supplied base64 HTML. This compares HTML file bytes, not total video traffic or a guaranteed loading-time score.

## External services

All site images and fonts are included and will be hosted on your deployed domain. Video playback still comes from the original Vidalytics and YouTube services. Application delivery still uses the original Typeform form; submissions go to that existing form. The application also has a direct link if the embed is unavailable.

The package requires no replacement video, form ID, API key, or separate image-hosting account. Provider playback and form availability remain controlled by those existing accounts.

## Editing and local preview

Edit the HTML, CSS, or JavaScript files directly. Because asset filenames use content hashes and long cache lifetimes, rename an asset when changing its contents and update its references in the HTML or CSS. No automated build is required.

For a local preview, run `python -m http.server 8000` in this folder and open `http://localhost:8000`. Test the actual application and video on your deployed domain as well, since provider domain restrictions can differ from a local preview.
