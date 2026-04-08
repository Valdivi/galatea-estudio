import { supabase, obtenerUsuario } from './auth.js';

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let usuarioActual = null;
let clienteId = null;

async function init() {
    usuarioActual = await obtenerUsuario();
    if (!usuarioActual) {
        window.location.href = 'login.html';
        return;
    }

    // Obtener vinculación del usuario con el cliente
    const { data: vinculo } = await supabase
        .from('auth_users')
        .select('cliente_id, clientes(nombre)')
        .eq('user_id', usuarioActual.id)
        .single();

    if (vinculo) {
        clienteId = vinculo.cliente_id;
        document.getElementById('cliente-nombre').textContent = vinculo.clientes.nombre;
        renderizarTodo();
    }
}

async function renderizarTodo() {
    const grid = document.getElementById('calendario');
    const labelMes = document.getElementById('mes-actual');
    grid.innerHTML = '';

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    labelMes.textContent = `${meses[mesActual]} ${anioActual}`;

    // Cargar eventos del mes desde Supabase
    const inicio = new Date(anioActual, mesActual, 1).toISOString();
    const fin = new Date(anioActual, mesActual + 1, 0).toISOString();

    const { data: eventos } = await supabase
        .from('calendario_maestro')
        .select('*')
        .eq('cliente_id', clienteId)
        .gte('fecha', inicio)
        .lte('fecha', fin);

    // Dibujar días
    const diasMes = new Date(anioActual, mesActual + 1, 0).getDate();
    const primerDia = new Date(anioActual, mesActual, 1).getDay();

    for (let i = 0; i < primerDia; i++) {
        grid.innerHTML += '<div class="day-box"></div>';
    }

    for (let dia = 1; dia <= diasMes; dia++) {
        const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const evs = (eventos || []).filter(e => e.fecha === fechaStr);
        
        grid.innerHTML += `
            <div class="day-box">
                <div class="day-number">${dia}</div>
                ${evs.map(e => `
                    <div class="day-idea">${e.conmemoracion}</div>
                    <span class="state-badge ${e.estado.toLowerCase().replace(/ /g, '-')}">${e.estado}</span>
                `).join('')}
            </div>`;
    }
}

// Configurar botones
window.mesAnterior = () => { mesActual--; if(mesActual < 0){ mesActual=11; anioActual--; } renderizarTodo(); };
window.mesSiguiente = () => { mesActual++; if(mesActual > 11){ mesActual=0; anioActual++; } renderizarTodo(); };

init();