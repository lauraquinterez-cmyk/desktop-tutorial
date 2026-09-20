// ===== Efecto de escritura (typing) =====
const palabras = ['dispositivos Móviles 📱', 'la Web 🌐', 'crear experiencias ✨'];
const typingEl = document.getElementById('typing-text');
let indicePalabra = 0;
let indiceLetra = 0;
let borrando = false;

function escribir() {
    const palabra = palabras[indicePalabra];
    indiceLetra += borrando ? -1 : 1;
    typingEl.textContent = palabra.slice(0, indiceLetra);

    let velocidad = borrando ? 40 : 90;

    if (!borrando && indiceLetra === palabra.length) {
        borrando = true;
        velocidad = 1600; // pausa al terminar la palabra
    } else if (borrando && indiceLetra === 0) {
        borrando = false;
        indicePalabra = (indicePalabra + 1) % palabras.length;
        velocidad = 400;
    }

    setTimeout(escribir, velocidad);
}
escribir();

// ===== Revelar elementos al hacer scroll =====
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');

            // Animar barras de habilidades cuando aparecen
            const barra = entrada.target.querySelector('.skill-fill');
            if (barra) {
                barra.style.width = barra.dataset.level;
            }
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observador.observe(el));

// ===== Menú móvil =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

navLinks.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.textContent = '☰';
    });
});

// ===== Botón volver arriba =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
