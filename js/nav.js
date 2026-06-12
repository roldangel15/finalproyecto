import { getAlojamientos, renderCards } from '/js/main.js';

const elEncabezado = document.getElementById('encabezado');

let filtros = {
  location: '',
  adultos: 0,
  menores: 0
};

function aplicarFiltros() {
  const todos = getAlojamientos();
  if (!todos || todos.length === 0) return;
  const filtrados = todos.filter(a => {
    const coincideLocation = !filtros.location ||
      a.city.toLowerCase().includes(filtros.location.toLowerCase()) ||
      a.country.toLowerCase().includes(filtros.location.toLowerCase());
    const totalGuests = filtros.adultos + filtros.menores;
    const coincideGuests = totalGuests === 0 || a.maxGuests >= totalGuests;
    return coincideLocation && coincideGuests;
  });
  renderCards(filtrados);
}

function agregarNavHuesped() {
  return `
    <div class="mb-6">
      <h3 class="text-base font-bold text-gray-900">Adults</h3>
      <p class="text-sm text-gray-400 mb-3">Ages 13 or above</p>
      <div class="flex items-center gap-4">
        <button class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="disminuye-adultos">−</button>
        <span id="cantAdultos" class="text-base font-medium text-gray-800 w-6 text-center">${filtros.adultos}</span>
        <button class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="aumenta-adultos">+</button>
      </div>
    </div>
    <div class="h-px bg-gray-100 mb-6"></div>
    <div>
      <h3 class="text-base font-bold text-gray-900">Children</h3>
      <p class="text-sm text-gray-400 mb-3">Ages 0-12</p>
      <div class="flex items-center gap-4">
        <button class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="disminuye-menores">−</button>
        <span id="cantMenores" class="text-base font-medium text-gray-800 w-6 text-center">${filtros.menores}</span>
        <button class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="aumenta-menores">+</button>
      </div>
    </div>
  `;
}

function agregarNavLocation(valorBusqueda) {
  if (valorBusqueda === '') return '';
  const alojamientos = getAlojamientos();
  if (!alojamientos) return '';
  const ciudades = alojamientos
    .reduce((acc, a) => {
      if (!acc.some(item => item.city === a.city && item.country === a.country)) {
        acc.push({ city: a.city, country: a.country });
      }
      return acc;
    }, [])
    .sort((a, b) => a.city.localeCompare(b.city));
  const ciudadesFiltradas = ciudades.filter(c => c.city.toLowerCase().includes(valorBusqueda.toLowerCase()));
  
  let html = '<div class="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden mt-2">';
  if (ciudadesFiltradas.length === 0) {
    html += `<div class="px-6 py-8 text-center"><p class="text-sm text-gray-500">No destinations found for "${valorBusqueda}"</p></div>`;
  } else {
    ciudadesFiltradas.forEach(ciudad => {
      html += `
        <div class="px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition border-b border-gray-100 last:border-b-0" data-action="select-city" data-ciudad="${ciudad.city}">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <img src="./src/images/icons/location.svg" alt="location" class="h-5 w-5">
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-gray-900">${ciudad.city}, ${ciudad.country}</h4>
            <p class="text-xs text-gray-500 mt-0.5">City in ${ciudad.country}</p>
          </div>
        </div>
      `;
    });
  }
  html += '</div>';
  return html;
}

function actualizarHuespedNav() {
  const cantAdultos = document.getElementById('cantAdultos');
  const cantMenores = document.getElementById('cantMenores');
  const inputGuests = document.getElementById('huespedes');
  const inputGuestsMobile = document.getElementById('huespedes-mobile');
  
  if (cantAdultos) cantAdultos.textContent = filtros.adultos;
  if (cantMenores) cantMenores.textContent = filtros.menores;
  
  const totalGuests = filtros.adultos + filtros.menores;
  const guestsValue = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';
  
  if (inputGuests) inputGuests.value = guestsValue;
  if (inputGuestsMobile) inputGuestsMobile.value = guestsValue;
}

function barraNavReplegada() {
  const locationValue = filtros.location || '';
  const totalGuests = filtros.adultos + filtros.menores;
  const guestsValue = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';

  elEncabezado.innerHTML = `
    <nav class="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 mb-8">
      <img src="./src/images/icons/logo-f7862584.svg" alt="logo-windbnb" class="p-4 lg:px-10 lg:py-6" />
      <span class="flex px-7 py-5 relative justify-center lg:w-1/2 lg:justify-center">
        <input type="text" readonly class="p-2.5 rounded-l-2xl shadow w-33 outline-none cursor-pointer bg-white" placeholder="  Add location" id="lugares" value="${locationValue}" />
        <input class="p-2.5 shadow w-33 outline-none cursor-pointer bg-white" type="text" readonly placeholder="   Add guests" id="huespedes" value="${guestsValue}" />
        <button id="btnSearch" class="p-3.5 shadow rounded-r-2xl lg:right-20 cursor-pointer bg-white hover:bg-gray-50 transition">
          <img src="./src/images/icons/search.svg" alt="search-icon" class="w-4" />
        </button>
      </span>
    </nav>
  `;
}

function barraNavExpandida(opcion = 'location') {
  const totalGuests = filtros.adultos + filtros.menores;
  const guestsText = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';
  let agregarLocalidadHtml = opcion === 'location' ? agregarNavLocation(filtros.location) : '';
  let agregarHuespedHtml = opcion === 'huesped' ? agregarNavHuesped() : '';
  let visibleLugarConci = opcion === 'location' ? '' : 'hidden';
  let visibleCuadroHuesp = opcion === 'huesped' ? '' : 'hidden';

  elEncabezado.innerHTML = `
    <!-- DISEÑO ESCRITORIO -->
    <div class="hidden md:flex fixed top-0 left-0 w-full bg-white shadow-md z-50 flex-col pt-14 px-16 font-sans" style="height:60%;">  
      <div class="w-full max-w-6xl mx-auto flex flex-col h-full justify-between pb-10">
        <div class="grid grid-cols-3 gap-2 h-20 items-center">
          <div class="h-full flex flex-col justify-center pl-8 border border-gray-200 rounded-2xl bg-white transition-all duration-150 cursor-pointer shadow-sm focus-within:border-2 focus-within:border-black">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wider">Location</label>
            <input id="lugares" type="text" placeholder="Add location" value="${filtros.location}" class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0" />
          </div>
          <div tabindex="0" class="h-full flex flex-col justify-center pl-8 border border-gray-200 rounded-2xl bg-white transition-all duration-150 cursor-pointer shadow-sm focus:border-2 focus:border-black">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wider">Guests</label>
            <input id="huespedes" type="text" readonly placeholder="Add guests" class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0" value="${guestsText}" />
          </div>
          <div class="h-full flex items-center justify-end pr-4">
            <button id="btnSearchExpanded" class="bg-[#EB5757] hover:bg-red-500 text-white flex items-center px-8 py-3.5 rounded-2xl shadow-sm transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="font-bold text-sm tracking-wide">search</span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-3 flex-grow pt-8">
          <div> 
            <div class="${visibleLugarConci}">
              ${agregarLocalidadHtml}
            </div>  
          </div>
          <div class="space-y-8 pl-8">
            <div class="${visibleCuadroHuesp}">
              ${agregarHuespedHtml}
            </div>    
          </div>
          <div></div>
        </div>
      </div>
    </div>

    <!-- DISEÑO MÓVIL -->
    <div class="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col font-sans md:hidden">
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Edit your search</h2>
        <button id="btnCerrarMobile" class="text-2xl font-light text-gray-500 hover:text-black p-1">✕</button>
      </div>
      <div class="flex-1 overflow-y-auto px-6 py-4 pb-32">
        <div class="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white mb-4">
          <div class="p-4 border-b border-gray-100">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wide mb-2">Location</label>
            <input id="lugares-mobile" type="text" placeholder="Add location" class="w-full text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400 border-none p-0" value="${filtros.location}" />
          </div>
          <div class="p-4">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wide mb-2">Guests</label>
            <input id="huespedes-mobile" type="text" readonly placeholder="Add guests" class="w-full text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400 border-none p-0" value="${guestsText}" />
          </div>
        </div>
        <div class="${visibleLugarConci}">
          ${agregarLocalidadHtml}
        </div>
        <div class="${visibleCuadroHuesp}">
          ${agregarHuespedHtml}
        </div>
      </div>
      <div class="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg">
        <button id="btnSearchMobile" class="w-full bg-[#EB5757] hover:bg-red-500 text-white flex items-center justify-center px-7 py-3.5 rounded-2xl shadow-md transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span class="font-semibold text-sm">Search</span>
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const input = opcion === 'location' 
      ? (window.innerWidth < 768 ? document.getElementById('lugares-mobile') : document.getElementById('lugares'))
      : (window.innerWidth < 768 ? document.getElementById('huespedes-mobile') : document.getElementById('huespedes'));
    
    if (input) {
      input.focus();
      if (opcion === 'location') {
        const val = input.value;
        input.value = '';
        input.value = val;
      }
    }
  }, 100);
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]') || e.target;
  const action = target.getAttribute('data-action');

  if (target.id === 'lugares' || target.id === 'lugares-mobile') {
    e.preventDefault();
    barraNavExpandida('location');
    return;
  }
  if (target.id === 'huespedes' || target.id === 'huespedes-mobile') {
    e.preventDefault();
    barraNavExpandida('huesped');
    return;
  }
  if (target.id === 'btnSearch') {
    aplicarFiltros();
    return;
  }
  if (target.id === 'btnCerrarMobile') {
    barraNavReplegada();
    return;
  }
  if (target.id === 'btnSearchExpanded' || target.id === 'btnSearchMobile' || target.closest('#btnSearchExpanded') || target.closest('#btnSearchMobile')) {
    aplicarFiltros();
    barraNavReplegada();
    return;
  }
  if (action === 'select-city') {
    const ciudad = target.getAttribute('data-ciudad') || target.closest('[data-ciudad]').getAttribute('data-ciudad');
    filtros.location = ciudad;
    aplicarFiltros();
    barraNavReplegada();
    return;
  }
  if (action === 'aumenta-adultos') {
    filtros.adultos++;
    actualizarHuespedNav();
    aplicarFiltros();
    return;
  }
  if (action === 'disminuye-adultos' && filtros.adultos > 0) {
    filtros.adultos--;
    actualizarHuespedNav();
    aplicarFiltros();
    return;
  }
  if (action === 'aumenta-menores') {
    filtros.menores++;
    actualizarHuespedNav();
    aplicarFiltros();
    return;
  }
  if (action === 'disminuye-menores' && filtros.menores > 0) {
    filtros.menores--;
    actualizarHuespedNav();
    aplicarFiltros();
    return;
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'lugares' || e.target.id === 'lugares-mobile') {
    filtros.location = e.target.value.trim();
    
    const esMovil = window.innerWidth < 768;
    let contenedorDestino;

    if (esMovil) {
      contenedorDestino = document.querySelector('.fixed.top-0.left-0.w-full.h-full.bg-white.z-50 > div.flex-1 > div:nth-child(3)');
    } else {
      contenedorDestino = document.querySelector('.grid-cols-3.flex-grow > div:first-child > div');
    }

    if (!contenedorDestino) return;

    if (filtros.location === '') {
      contenedorDestino.innerHTML = '';
      aplicarFiltros();
      return;
    }

    contenedorDestino.innerHTML = agregarNavLocation(filtros.location);
    aplicarFiltros();
  }
});

barraNavReplegada();