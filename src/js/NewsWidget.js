/* eslint-disable no-console */
export default class NewsWidget {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.newsList = null;
    this.updateBtn = null;
    this.isOnline = navigator.onLine;
  }

  init() {
    this.bindToDOM();
    this.bindNetworkEvents();
    this.createRequest();
  }

  bindToDOM() {
    this.container.innerHTML = NewsWidget.startMarkUp;
    this.newsList = this.container.querySelector('.news__list');
    this.updateBtn = this.container.querySelector('.header__btn');

    this.updateBtn.addEventListener('click', () => this.createRequest());

    this.updateOnlineStatus();
  }

  bindNetworkEvents() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateOnlineStatus();
      this.createRequest();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateOnlineStatus();
    });
  }

  updateOnlineStatus() {
    if (this.isOnline) {
      this.container.classList.remove('offline');
    } else {
      this.container.classList.add('offline');
    }
  }

  async createRequest() {
    if (!this.isOnline) {
      this.showOfflineMessage();
      return;
    }

    this.showAnimation();
    try {
      const request = await fetch('https://workers-back-r0r5.onrender.com');

      if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
      }

      const response = await request.json();
      this.hideAnimation();

      if (response.data && response.data.length > 0) {
        this.showNews(response.data);
        this.hideError();
      } else {
        this.showError('Нет данных для отображения');
      }
    } catch (err) {
      console.log('Error: ', err);
      this.hideAnimation();
      this.showError('Не удалось загрузить данные. Проверьте подключение и обновите страницу.');
    }
  }

  static get startMarkUp() {
    return `<div class="container">
    <header class="header">
      <h1 class="header__title">Новости мира кино</h1>
      <button class="header__btn">Обновить</button>
      <span class="network-status"></span>
    </header>
    <div class="news__list"></div>
    <div class="loading-overlay">
      <div class="loader"></div>
      <div class="loading-text">Загрузка новостей...</div>
    </div>
  </div>`;
  }

  static newsMarkUp(date = '', text = '', url = '', id = '') {
    return `<div class="news" data-id="${id}">
    <div class="news__date">${date}</div>
    <div class="news__content">
      <div class="news__imagebox">
        <img src="${url}" alt="">
      </div>
      <div class="news__text">
        <div class="mask-text__item">${text}</div>
      </div>
    </div>
  </div>`;
  }

  static get offlineMarkUp() {
    return `<div class="offline-message">
      <div class="offline-icon">📡</div>
      <div class="offline-text">Нет подключения к интернету</div>
      <div class="offline-subtext">Показываем сохранённые данные</div>
    </div>`;
  }

  showNews(data) {
    this.newsList.innerHTML = '';
    data.forEach((elem) => {
      this.newsList.insertAdjacentHTML(
        'beforeend',
        NewsWidget.newsMarkUp(elem.created, elem.title, elem.image, elem.id)
      );
    });
  }

  showAnimation() {
    const loader = this.container.querySelector('.loading-overlay');
    if (loader) {
      loader.style.display = 'flex';
    }
    this.newsList.style.opacity = '0.5';
  }

  hideAnimation() {
    const loader = this.container.querySelector('.loading-overlay');
    if (loader) {
      loader.style.display = 'none';
    }
    this.newsList.style.opacity = '1';
  }

  showError(message = '') {
    this.hideAnimation();

    const existingError = this.newsList.querySelector('.error');
    if (existingError) {
      existingError.querySelector('.error__mes').textContent = message ||
        'Не удалось загрузить данные. Проверьте подключение и обновите страницу.';
      return;
    }

    this.newsList.insertAdjacentHTML(
      'beforeend',
      `<div class="error">
        <div class="error__icon">⚠️</div>
        <div class="error__mes">${message || 'Не удалось загрузить данные. Проверьте подключение и обновите страницу.'}</div>
      </div>`
    );
  }

  showOfflineMessage() {
    this.hideAnimation();

    const existingOffline = this.container.querySelector('.offline-message');
    if (existingOffline) {
      return;
    }

    this.container.insertAdjacentHTML('beforeend', NewsWidget.offlineMarkUp);
  }

  hideError() {
    const error = this.newsList.querySelector('.error');
    if (error) {
      error.remove();
    }
    const offlineMsg = this.container.querySelector('.offline-message');
    if (offlineMsg) {
      offlineMsg.remove();
    }
  }
}
