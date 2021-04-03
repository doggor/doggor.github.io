importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js");

if (workbox) {
    workbox.routing.registerRoute(
        /\/$/,
        new workbox.strategies.NetworkFirst()
    );

    workbox.routing.registerRoute(
        /\.js$/,
        new workbox.strategies.NetworkFirst()
    );

    workbox.routing.registerRoute(
        /\.css$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'css-cache',
        })
    );

    workbox.routing.registerRoute(
        // Cache image files.
        /\.(?:png|jpg|jpeg|svg|gif)$/,
        // Use the cache if it's available.
        new workbox.strategies.CacheFirst({
            // Use a custom cache name.
            cacheName: 'image-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    // Cache only 20 images.
                    maxEntries: 20,
                    // Cache for a maximum of a week.
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                })
            ],
        })
    );

    workbox.googleAnalytics.initialize();
} else {
    console.log(`Oops, Workbox didn't load!`);
}
