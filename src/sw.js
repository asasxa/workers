import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

// Опционально: кэш API отдельно (если нужно offline)
// import { NetworkFirst } from 'workbox-strategies';
// import { registerRoute } from 'workbox-routing';
// registerRoute(
//   ({ url }) => url.pathname.startsWith('/api'),
//   new NetworkFirst()
// );
