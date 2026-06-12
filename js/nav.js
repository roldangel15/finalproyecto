//importamos las dos funciones que usaremosde main.js
import { getAlojamientos, renderCards } from '/js/main.js';
// por "elEncabezado" cambiaremos de manera dinamica la barra de navegacion
const elEncabezado = document.getElementById('encabezado');

// el objeto "filtros" se usara para actualizar y realizar los filtros de busqueda
let filtros = {
  location: '',
  adultos: 0,
  menores: 0
};

/**
 * 
 * @returns aplica los filtros de busqueda por lugar y nro de huespedes que provee el Apartamento y actualiza segun el filtro la grilla de apartamentos disponibles
 * 
 */
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

/**
 * 
 * @returns en la barra de navegacion en la parte de de Guests despliega el cuadro para aumentar el numero de Huespedes, adultos y niños o menores
 */

function agregarNavHuesped() {
  return `
    <div class="mb-6">
      <h3 class="text-base font-bold text-gray-900">Adults</h3>
      <p class="text-sm text-gray-400 mb-3">Ages 13 or above</p>
      <div class="flex items-center gap-4">
        <button class="w-8 h-8 rounded-md border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="disminuye-adultos">−</button>
        <span class="cantAdultos text-base font-medium text-gray-800 w-6 text-center">${filtros.adultos}</span>
        <button class="w-8 h-8 rounded-md border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="aumenta-adultos">+</button>
      </div>
    </div>
    <div class="h-px bg-gray-100 mb-6"></div>
    <div>
      <h3 class="text-base font-bold text-gray-900">Children</h3>
      <p class="text-sm text-gray-400 mb-3">Ages 0-12</p>
      <div class="flex items-center gap-4">
        <button class="w-8 h-8 rounded-md border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="disminuye-menores">−</button>
        <span class="cantMenores text-base font-medium text-gray-800 w-6 text-center">${filtros.menores}</span>
        <button class="w-8 h-8 rounded-md border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition text-lg font-light" data-action="aumenta-menores">+</button>
      </div>
    </div>
  `;
}

/**
 * funcion que se encarga de aumentar o desplegar en la parte de abajo de Location de la barra de navegacion las coincidencias de busqueda
 * @param {es el texto que escribe en "Location"} valorBusqueda 
 * @returns las coincidencias de busqueda que se desplegaran
 */
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

/** 
 * Actualiza los datos en lo concerniente a Guests de la barra de navegacion
*/
function actualizarHuespedNav() {
  // Actualizar TODOS los elementos con estas clases (desktop y móvil)
  const cantAdultosElements = document.querySelectorAll('.cantAdultos');
  const cantMenoresElements = document.querySelectorAll('.cantMenores');
  const inputGuestsElements = document.querySelectorAll('.input-guests');
  
  const totalGuests = filtros.adultos + filtros.menores;
  const guestsValue = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';
  
  cantAdultosElements.forEach(el => el.textContent = filtros.adultos);
  cantMenoresElements.forEach(el => el.textContent = filtros.menores);
  inputGuestsElements.forEach(el => el.value = guestsValue);
}

/**
 * Muestra la barra de navegacion resumida a 3 bontones
 */

function barraNavReplegada() {
  const locationValue = filtros.location || '';
  const totalGuests = filtros.adultos + filtros.menores;
  const guestsValue = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';
 
  elEncabezado.innerHTML = `
    <nav class="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 mb-8">
      <img src="./src/images/icons/logo-f7862584.svg" alt="logo-windbnb" class="p-4 lg:px-10 lg:py-6" />
      <span class="flex px-7 py-5 relative justify-center lg:w-1/2 lg:justify-center">
        <input type="text" readonly class="p-2.5 rounded-l-2xl shadow w-33 outline-none cursor-pointer bg-white" placeholder="  Add location" id="lugares" value="${locationValue}" />
        <input class="p-2.5 shadow w-33 outline-none cursor-pointer bg-white input-guests" type="text" readonly placeholder="   Add guests" id="huespedes" value="${guestsValue}" />
        <button id="btnSearch" class="p-3.5 shadow rounded-r-2xl lg:right-20 cursor-pointer bg-white hover:bg-gray-50 transition">
          <img src="./src/images/icons/search.svg" alt="search-icon" class="w-4" />
        </button>
      </span>
    </nav>
  `;
}

/**
 * Muestra la barra de navegacion desplegada segun la busqueda que se desea realizar
 */

function barraNavExpandida(opcion = 'location') {
  const totalGuests = filtros.adultos + filtros.menores;
  const guestsText = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';
  let agregarLocalidadHtml = opcion === 'location' ? agregarNavLocation(filtros.location) : '';
  let agregarHuespedHtml = opcion === 'huesped' ? agregarNavHuesped() : '';
  let visibleLugarConci = opcion === 'location' ? '' : 'class="hidden"';
  let visibleCuadroHuesp = opcion === 'huesped' ? '' : 'class="hidden"';
 
  elEncabezado.innerHTML = `
    <!-- DISEÑO ESCRITORIO -->
    <div class="hidden md:flex fixed top-0 left-0 w-full bg-white shadow-md z-50 flex-col pt-14 px-16 font-sans" style="height:60%;">  
      <div class="w-full max-w-6xl mx-auto flex flex-col h-full justify-between pb-10">
        <div class="grid grid-cols-3 gap-2 h-20 items-center">
          <div class="h-full flex flex-col justify-center pl-8 border border-gray-200 rounded-2xl bg-white transition-all duration-150 cursor-pointer shadow-sm focus-within:border-2 focus-within:border-black">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wider">Location</label>
            <input id="lugares-desktop" type="text" placeholder="Add location" value="${filtros.location}" class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0" />
          </div>
          <div tabindex="0" class="h-full flex flex-col justify-center pl-8 border border-gray-200 rounded-2xl bg-white transition-all duration-150 cursor-pointer shadow-sm focus:border-2 focus:border-black">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wider">Guests</label>
            <input class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0 input-guests" type="text" readonly placeholder="Add guests" value="${guestsText}" />
          </div>
          <div class="h-full flex items-center justify-end pr-4">
            <button class="btn-search-desktop bg-[#EB5757] hover:bg-red-500 text-white flex items-center px-8 py-3.5 rounded-2xl shadow-sm transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="font-bold text-sm tracking-wide">search</span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-3 flex-grow pt-8">
          <div> 
            <div ${visibleLugarConci}>
              ${agregarLocalidadHtml}
            </div>  
          </div>
          <div class="space-y-8 pl-8">
            <div ${visibleCuadroHuesp}>
              ${agregarHuespedHtml}
            </div>    
          </div>
          <div></div>
        </div>
      </div>
    </div>

    <!-- DISEÑO MÓVIL -->
    <div class="fixed top-0 left-0 w-full h-full bg-white shadow-md z-50 flex flex-col pt-14 px-6 font-sans overflow-hidden md:hidden">
      <div class="w-full max-w-md mx-auto flex-grow flex flex-col justify-between mt-2 pb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Edit your search</h2>
          <button class="btn-close-mobile text-xl font-light text-gray-500 hover:text-black focus:outline-none p-1">×</button>
        </div>
        <div class="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
          <div class="p-3 border-b border-gray-100">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wide">Location</label>
            <input id="lugares-mobile" type="text" placeholder="Add location" class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0" value="${filtros.location}" />
          </div>
          <div class="p-3">
            <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wide">Guests</label>
            <input class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0 input-guests" type="text" readonly placeholder="Add guests" value="${guestsText}" />
          </div>
        </div>
        <div ${visibleLugarConci} class="mobile-location-results">
          ${agregarLocalidadHtml}
        </div>
        <div ${visibleCuadroHuesp}>
          ${agregarHuespedHtml}
        </div>
        <div class="flex justify-center mt-auto">
          <button class="btn-search-mobile bg-[#EB5757] hover:bg-red-500 text-white flex items-center px-7 py-2.5 rounded-2xl shadow-md transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="font-semibold text-sm">Search</span>
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const input = opcion === 'location' 
      ? (window.innerWidth < 768 ? document.getElementById('lugares-mobile') : document.getElementById('lugares-desktop'))
      : (document.getElementById('huespedes'));
    
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

//-----------------------------------------

// control y  delegacion de eventos delegacion
//--------------------
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]') || e.target;
  const action = target.getAttribute('data-action');

  if (target.id === 'lugares' || target.id === 'lugares-desktop' || target.id === 'lugares-mobile') {
    e.preventDefault();
    barraNavExpandida('location');
    return;
  }
  if (target.id === 'huespedes' || target.classList.contains('input-guests')) {
    e.preventDefault();
    barraNavExpandida('huesped');
    return;
  }
  if (target.id === 'btnSearch') {
    aplicarFiltros();
    return;
  }
  if (target.classList.contains('btn-close-mobile')) {
    barraNavReplegada();
    return;
  }
  if (target.classList.contains('btn-search-desktop') || target.classList.contains('btn-search-mobile') || target.closest('.btn-search-desktop') || target.closest('.btn-search-mobile')) {
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
  if (e.target.id === 'lugares' || e.target.id === 'lugares-desktop' || e.target.id === 'lugares-mobile') {
    filtros.location = e.target.value.trim();
    
    const esMovil = window.innerWidth < 768;
    let contenedorDestino;

    if (esMovil) {
      // En movil, buscamos el contenedor específico con clase
      contenedorDestino = document.querySelector('.mobile-location-results');
    } else {
      // En escritorio, buscamos la columna izquierda inferior
      contenedorDestino = document.querySelector('.grid-cols-3.flex-grow > div:first-child > div:not(.hidden)');
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