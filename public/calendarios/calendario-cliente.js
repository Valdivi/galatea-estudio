import { supabase, obtenerUsuario } from './auth.js';

let mesActual = 3; // Forzamos Abril (mes 3 en programación)
let anioActual = 2026;
let usuarioActual = null;

async function init() {
    usuarioActual = await obtenerUsuario();
    if (!usuarioActual) {
        window.location.href = 'login.html';
        return;
    }

    // Buscamos a qué cliente pertenece tu usuario
    const { data: vinculo } = await supabase
        .from('auth_users')
        .select('cliente_id')
        .eq('user_id', usuarioActual.id)
        .single();

    if (vinculo) {
        renderizarCalendario(vinculo.cliente_id);
    }
}

async function renderizarCalendario(clienteId) {
    const grid = document.getElementById('calendario');
    const labelMes = document.getElementById('mes-actual');
    grid.innerHTML = '';

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    labelMes.textContent = `${meses[mesActual]} ${anioActual}`;

    // Traer eventos de la tabla maestra que ya vinculamos
    const { data: eventos } = await supabase
        .from('calendario_maestro')
        .select('*')
        .eq('cliente_id', clienteId);

    const diasMes = new Date(anioActual, mesActual + 1, 0).getDate();

    for (let dia = 1; dia <= diasMes; dia++) {
        const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const evs = (eventos || []).filter(e => e.fecha === fechaStr);
        
        grid.innerHTML += `
            <div class="day-box">
                <div class="day-number">${dia}</div>
                ${evs.map(e => `
                    <div class="day-idea" style="color: #1B9EAD; font-weight: bold;">${e.conmemoracion}</div>
                    <span class="state-badge ${e.estado.toLowerCase().replace(/ /g, '-')}">${e.estado}</span>
                `).join('')}
            </div>`;
    }
}

init();