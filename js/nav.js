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
    <div class="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-30">
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
    </div>
  `;
}
/**
 * funcion que se encarga de aumentar o desplegar en la parte de abajo de Location de la barra de navegacion las coincidencias de busqueda
 * @param {es el texto que escribe en "Location"} valorBusqueda 
 * @returns las coincidencias de busqueda que se desplegaran
 */
function agregarNavLocation(valorBusqueda)
{ 
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
  
  let html = ``;  

  if (ciudadesFiltradas.length === 0 && valorBusqueda) {
    html += `<div class="px-6 py-8 text-center"><p class="text-sm text-gray-500">No destinations found for "${valorBusqueda}"</p></div>`;
  } else {
    ciudadesFiltradas.forEach(ciudad => {
      html += `
        <div class="px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition" data-action="select-city" data-ciudad="${ciudad.city}">
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
 
 html += `
      </div>

    </div>
  `;
  return html;


}
/*debemos ver si lo quitamos
/** 
 * Actualiza los datos en lo concerniente a Guests de la barra de navegacion
*/
function actualizarHuespedNav() {
  const cantAdultos = document.getElementById('cantAdultos');
  const cantMenores = document.getElementById('cantMenores');
  const inputGuests = document.getElementById('huespedes');
  
  if (cantAdultos) cantAdultos.textContent = filtros.adultos;
  if (cantMenores) cantMenores.textContent = filtros.menores;
  
  const totalGuests = filtros.adultos + filtros.menores;
  if (inputGuests) {
    inputGuests.value = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : '';
  }
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
      <img
        src="./src/images/icons/logo-f7862584.svg"
        alt="logo-windbnb"
        class="p-4 lg:px-10 lg:py-6"
      />
      <span class="flex px-7 py-5 relative justify-center lg:w-1/2 lg:justify-center">
        <input
          type="text"
          readonly
          class="p-2.5 rounded-l-2xl shadow w-33 outline-none cursor-pointer"
          placeholder="  Add location"
          id="lugares"
          value="${locationValue}"
        />
        <input
          class="p-2.5 shadow w-33 outline-none cursor-pointer"
          type="text"
          readonly
          placeholder="   Add guests"
          id="huespedes"
          value="${guestsValue}"
        />
        <button id="btnSearch" class="p-3.5 shadow rounded-r-2xl lg:right-20 cursor-pointer">
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

  let agregarLocalidadHtml = opcion === 'location' ? agregarNavLocation(filtros.location):'';
  let agregarHuespedHtml = opcion === 'huesped' ? agregarNavHuesped():'';
  let visibleLugarConci = opcion === 'location' ? '':'class = "hidden"';
  let visibleCuadroHuesp = opcion === 'huesped' ? '':'class = "hidden"';

  //  REEMPLAZA COMPLETAMENTE el contenido del encabezado
    elEncabezado.innerHTML = `

<div class="hidden md:flex fixed top-0 left-0 w-full bg-white shadow-md z-50 flex-col pt-14 px-16 font-sans" style="height:60%;">  
  <div class="w-full max-w-6xl mx-auto flex flex-col h-full justify-between pb-10">
    
    <!-- BARRA DE BÚSQUEDA CON INPUTS INDEPENDIENTES Y FOCO DINÁMICO -->
    <div class="grid grid-cols-3 gap-2 h-20 items-center">
      
      <!-- Input de Ubicación (Borde negro dinámico al enfocar) -->
      <div class="h-full flex flex-col justify-center pl-8 border border-gray-200 rounded-2xl bg-white transition-all duration-150 cursor-pointer shadow-sm focus-within:border-2 focus-within:border-black focus-within:ring-0">
  <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wider">Location</label>
  <input 
  id="lugares" 
  type="text" 
  placeholder="Add location"
  value ="${filtros.location}"
  
  class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 focus:ring-0 border-none p-0" value="">
  <!-- JavaScript inyectará aquí el menú flotante sin agrandar esta caja -->
</div>

      <!-- Input de Huéspedes (Ahora con borde gris por defecto y negro solo al enfocar/hacer clic) -->
      <div tabindex="0" class="h-full flex flex-col justify-center pl-8 border border-gray-200 rounded-2xl bg-white transition-all duration-150 cursor-pointer shadow-sm focus:border-2 focus:border-black focus:outline-none focus-within:border-2 focus-within:border-black">
        <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wider">Guests</label>
        <input 
          id="huespedes" 
          type="text" 
          readonly
          placeholder="   Add guests" 
          class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 focus:ring-0 border-none p-0"
          value="${guestsText}"
          />
     
      </div>

      <!-- Sección del Botón Buscar -->
      <div class="h-full flex items-center justify-end pr-4 ">
        <button id="btnSearchExpanded" class="bg-[#EB5757] hover:bg-red-500 text-white flex items-center px-8 py-3.5 rounded-2xl shadow-sm transition-colors focus:outline-none">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span class="font-bold text-sm tracking-wide">search</span>
        </button>
      </div>

    </div>

    <!-- SECCIÓN INFERIOR DE CONTADORES (ALINEADA ABAJO DE GUESTS) -->
    <div class="grid grid-cols-3 flex-grow pt-8">
      <!-- Columna izquierda vacía para empujar el contenido -->
      <div> 
        <div  ${visibleLugarConci}> <!-- OCULTAREMOS O HAREMOS VISIBLE -->
           ${agregarLocalidadHtml}
        </div>  
      </div>

      <!-- Columna central que contiene los selectores justo debajo de "Guests" -->
      <div class="space-y-8 pl-8">
        <div ${visibleCuadroHuesp}> <!-- OCULTAREMOS O HAREMOS VISIBLE -->
        <!-- Contador de Adultos -->
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
        </div>    
      </div>

      <!-- Columna derecha vacía -->
      <div></div>
    </div>

  </div>
</div>



<!-- diseño movil-->

   
  <div class="fixed top-0 left-0 w-full h-[100%] bg-white shadow-md z-50 flex flex-col pt-14 px-6 font-sans  overflow-hidden md:hidden">
  
  <!-- Contenedor del contenido principal -->
  <div class="w-full max-w-md mx-auto flex-grow flex flex-col justify-between mt-2 pb-6">
 
    <!-- Título de la búsqueda y Botón X alineados en la misma línea -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Edit your search</h2>
      <button id="btnSearchExpanded" class="text-xl font-light text-gray-500 hover:text-black focus:outline-none p-1">&times;</button>
    </div>

    <!-- Bloque de inputs (Ubicación y Huéspedes) -->
    <div class="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
      <div class="p-3 border-b border-gray-100">
        <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wide">Location</label>
        

        <input 
         id="lugares" 
         type="text" 
         placeholder="Add location" 
         class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 border-none p-0"
         value ="${filtros.location}"/>


      </div>
      <div class="p-3">
        <label class="block text-[10px] font-black uppercase text-gray-900 tracking-wide">Guests</label>
       

         <input 
          id="huespedes" 
          type="text" 
          readonly
          placeholder="   Add guests" 
          class="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 placeholder-gray-400 focus:ring-0 border-none p-0"
          value="${guestsText}"
          />
      </div>
    </div>

    <div  ${visibleLugarConci}> <!-- OCULTAREMOS O HAREMOS VISIBLE -->
           ${agregarLocalidadHtml}
     </div>
    <!-- Selectores de Contador (Adultos y Niños) -->
    <div ${visibleCuadroHuesp}>
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
    </div>

    <!-- Botón de Búsqueda centrado en la base del contenedor h-[60%] -->
    <div class="flex justify-center mt-auto">
      <button id="btnSearchExpanded" class="bg-[#EB5757] hover:bg-red-500 text-white flex items-center px-7 py-2.5 rounded-2xl shadow-md transition-colors focus:outline-none">
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
    
    const input = opcion === 'location' ? document.getElementById('lugares') : document.getElementById('huespedes');
    
    if (input) {
      input.focus();
      if (opcion === 'location') {
        
        const val = input.value;
        input.value = '';
        input.value = val;
      }
    }
  }, 0);

}


//-----------------------------------------

// control y  delegacion de eventos delegacion
//--------------------

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]') || e.target;
  const action = target.getAttribute('data-action');
  
  if (target.id === 'lugares') {
    e.preventDefault();
    barraNavExpandida('location');
    return;
  }
 
  if (target.id === 'huespedes') {
    e.preventDefault();
    barraNavExpandida('huesped');
    return;
   
  }

  if (target.id === 'btnSearch') {
    aplicarFiltros();
    return;
  }

  if (target.id === 'lugares' || target.closest('#lugares')) {
    barraNavExpandida('location');
    return;
  }

  if (target.id === 'huespedes' || target.closest('#huespedes')) {
    barraNavExpandida('huesped');
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

  if (target.id === 'btnSearchExpanded' || target.closest('#btnSearchExpanded')) {
    aplicarFiltros();
    barraNavReplegada();
    return;
  }
  // Cerrar al hacer clic fuera
  const searchContainer = document.querySelector('.relative.z-20');
  if (searchContainer && !searchContainer.contains(e.target)) {
    barraNavReplegada();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'lugares') {
    filtros.location = e.target.value.trim();

    // 1. Identificamos en qué vista estamos (Escritorio o Móvil)
    const esMovil = window.innerWidth < 768; // md es 768px en Tailwind
    let contenedorDestino;

    if (esMovil) {
      // En móvil, buscamos el div de resultados que está al final del bloque
      contenedorDestino = document.querySelector('.block.md\\:hidden > div > div:last-child');
    } else {
      // En escritorio, buscamos la columna izquierda inferior vacía
      contenedorDestino = document.querySelector('.grid-cols-3.flex-grow > div:first-child > div');
    }

    // 2. Si no encontramos el contenedor correcto, salimos para evitar errores
    if (!contenedorDestino) return;

    // 3. Si el input está vacío, limpiamos la zona de abajo inmediatamente
    if (filtros.location === '') {
      contenedorDestino.innerHTML = '';
      aplicarFiltros();
      return;
    }

    // 4. Actualización inmediata y limpia: Sobrescribimos el contenedor de abajo
    contenedorDestino.innerHTML = agregarNavLocation(filtros.location);

    aplicarFiltros();
  }
});

barraNavReplegada();

