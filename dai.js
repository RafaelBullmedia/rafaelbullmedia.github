let adsManager;
let adsLoader;
let adDisplayContainer;

/**
 * Inicializa la configuración del SDK de IMA y solicita el primer anuncio.
 */
function init() {
  createAdDisplayContainer();
  adDisplayContainer.initialize();

  adsLoader = new google.ima.AdsLoader(adDisplayContainer);

  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded
  );
  adsLoader.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError
  );

  requestAds();
}

/**
 * Crea el contenedor de anuncios y lo ajusta a pantalla completa.
 */
function createAdDisplayContainer() {
  const adContainer = document.getElementById('adContainer');
  adContainer.style.position = 'absolute';
  adContainer.style.top = '0';
  adContainer.style.left = '0';
  adContainer.style.width = '100vw';
  adContainer.style.height = '100vh';

  adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
}

/**
 * Solicita un nuevo anuncio con el tamaño dinámico.
 */
function requestAds() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const adsRequest = new google.ima.AdsRequest();
/*  adsRequest.adTagUrl =
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/6881/televisa.bullmedia/spotvideo&description_url=https%3A%2F%2Fwww.bullmedia.mx%2F&tfcd=0&npa=0&sz=640x360%7C640x480%7C854x480%7C1200x675%7C1280x720%7C1280x800%7C1920x1080&pp=TabletBitRates&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator=' + new Date().getTime();
*/
adsRequest.adTagUrl =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/6881/televisa.bullmedia/spotvideo&description_url=https%3A%2F%2Fwww.bullmedia.mx%2F&tfcd=0&npa=0&sz=640x360%7C640x480%7C854x480%7C1200x675%7C1280x720%7C1280x800%7C1920x1080&pp=TabletBitRates&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator=' + new Date().getTime();

  adsRequest.linearAdSlotWidth = width;
  adsRequest.linearAdSlotHeight = height;
  adsRequest.nonLinearAdSlotWidth = width;
  adsRequest.nonLinearAdSlotHeight = height;

  adsLoader.requestAds(adsRequest);
}

/**
 * Maneja la carga del AdsManager y ajusta los anuncios a pantalla completa.
 * @param {!google.ima.AdsManagerLoadedEvent} adsManagerLoadedEvent
 */
function onAdsManagerLoaded(adsManagerLoadedEvent) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  adsManager = adsManagerLoadedEvent.getAdsManager(null);

  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    onAdsCompleted
  );

  try {
    adsManager.init(width, height, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    console.log('Error al iniciar los anuncios:', adError);
  }
}

/**
 * Se ejecuta cuando un anuncio termina. Inicia otro automáticamente.
 */
function onAdsCompleted() {
  console.log('Anuncio completado. Cargando otro...');
  requestAds(); // Pedimos un nuevo anuncio
}

/**
 * Maneja errores en la carga de anuncios.
 * @param {!google.ima.AdErrorEvent} adErrorEvent
 */
function onAdError(adErrorEvent) {
  console.error('Error en la carga del anuncio:', adErrorEvent.getError());
  if (adsManager) {
    adsManager.destroy();
  }
  setTimeout(requestAds, 5000); // Esperamos 5 segundos antes de intentar otro anuncio
}

// Ajustar el tamaño de los anuncios al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
  if (adsManager) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
  }
});

// Iniciar la petición del anuncio automáticamente al cargar la página.
window.onload = init;
