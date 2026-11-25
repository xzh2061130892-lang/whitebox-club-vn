(() => {
  const paths = {
    door: 'M3 14h10M4 13V3l7-1v11M8 8h.1', play: 'M4 2.5 13 8l-9 5.5z',
    map: 'M1.5 4 6 2l4 2 4.5-2v10L10 14l-4-2-4.5 2zM6 2v10m4-8v10',
    book: 'M2 2.5h9a2 2 0 0 1 2 2v9H4a2 2 0 0 1-2-2zM2 11h11M5 5h5',
    archive: 'M2 5h12v8H2zM1.5 2.5h13V5h-13zM6 8h4',
    club: 'M2 7 8 2l6 5M3.5 6.5v7h9v-7M7 13V9h2v4',
    settings: 'M2 4h3m4 0h5M2 12h7m4 0h1M5 2v4h4V2zM9 10v4h4v-4z',
    lock: 'M3.5 7h9v7h-9zM5.5 7V4.5a2.5 2.5 0 0 1 5 0V7M8 10v1',
    tea: 'M2 5.5h9V9a4.5 4.5 0 0 1-9 0zM11 6h1.5a2 2 0 0 1 0 4H11M2 14h11M5 2v1m3-1v1',
    camera: 'M2 4.5h3l1-2h4l1 2h3v9H2zM10.5 9a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
    medal: 'M11.5 6a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM5.5 9l-1 5 3.5-2 3.5 2-1-5',
    gallery: 'M2 2.5h12v11H2zM2 11l4-4 3 3 2-2 3 3',
    music: 'M6 11V4l7-2v8M6 11a2 2 0 1 1-2-1.5m9 .5a2 2 0 1 1-2-1.5',
    arcade: 'M4 5h8l2 6c.4 2-1 3-2.5 1.5L10 11H6l-1.5 1.5C3 14 1.6 13 2 11zM4.5 8h3M6 6.5v3M10.5 8h.1m1.5 1h.1',
    wardrobe: 'M6.5 4a1.5 1.5 0 1 1 2 1.4L8 6v1l6 4v1H2v-1l6-4',
    zoom: 'M10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM9.5 9.5l4 4M4.5 6.5h4M6.5 4.5v4',
    coin: 'M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0zM6.5 6.5h3v3h-3z',
    gift: 'M2 6h12v3H2zM3 9v5h10V9M8 6v8M8 6C2 6 3 1 6 3zm0 0c6 0 5-5 2-3z',
  };
  window.WhiteboxIcon = name => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg'), path = document.createElementNS(ns, 'path');
    for (const [key, value] of Object.entries({ viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor',
      'stroke-width': '1.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'ui-icon' }))
      svg.setAttribute(key, value);
    path.setAttribute('d', paths[name]); svg.append(path);
    return svg;
  };
})();
