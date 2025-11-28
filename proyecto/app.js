/**
 * Tamagotchi "Cuidando a Taco" - IA Básica
 * Sistema de estados y pensamiento automático del gato
 */

class Tamagotchi {
    constructor() {
        // Estados iniciales
        this.hambre = 50;
        this.energia = 60;
        this.felicidad = 70;

        // Límites seguros
        this.maxStats = 100;
        this.minStats = 0;

        // Tiempo de degradación automática (cada 3 segundos)
        this.degradationInterval = 3000;

        // Historial de pensamientos
        this.pensamientos = [];

        // Inicializar
        this.inicializar();
    }

    /**
     * Inicializa el juego y comienza el ciclo de degradación
     */
    inicializar() {
        this.actualizarUI();
        this.agregarPensamiento("¡Hola! Soy Taco 🐱");

        // Degradación automática de estados
        setInterval(() => {
            this.degradarEstados();
        }, this.degradationInterval);

        // Generar pensamiento automático cada 5-8 segundos
        setInterval(() => {
            const pensamiento = this.generarPensamiento();
            this.agregarPensamiento(pensamiento);
        }, Math.random() * 3000 + 5000);
    }

    /**
     * Degrada los estados del gato automáticamente con el tiempo
     */
    degradarEstados() {
        this.hambre = Math.min(this.hambre + 8, this.maxStats);
        this.energia = Math.max(this.energia - 5, this.minStats);
        this.felicidad = Math.max(this.felicidad - 3, this.minStats);

        this.actualizarUI();
    }

    /**
     * SISTEMA DE IA: Genera pensamientos basado en los estados de Taco
     * Lógica condicional del gato "pensante"
     */
    generarPensamiento() {
        // Prioridad 1: Hambre extrema
        if (this.hambre > 75) {
            const frases = [
                "¡Dame comida YA! 🍕",
                "¡Tengo un hambre TERRIBLE!",
                "Mis tripas suenan... ¿Dónde está la comida?",
                "COMIDA... Necesito COMIDA ahora",
                "¡Muero de hambre! 😭"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Prioridad 2: Energía muy baja
        if (this.energia < 25) {
            const frases = [
                "Estoy tan cansado... 😴",
                "Necesito dormir URGENTE",
                "Mis patas no responden...",
                "¿Puede alguien apagar la luz?",
                "Zzzzz... estoy hecho polvo"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Prioridad 3: Hambre moderada
        if (this.hambre > 60) {
            const frases = [
                "¿Hay algo para comer? 👃",
                "Mi estómago ruge...",
                "Me gustaría probar algo delicioso",
                "¿A qué hora es la comida?"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Prioridad 4: Energía baja
        if (this.energia < 40) {
            const frases = [
                "Estoy algo cansado 😐",
                "Un pequeño descanso no vendría mal",
                "Me siento débil",
                "Necesito recuperar fuerzas"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Prioridad 5: Muy feliz
        if (this.felicidad > 85) {
            const frases = [
                "¡Estoy FELIZ! 😻",
                "¡La vida es hermosa!",
                "¿Podemos jugar más? ¡Por favor!",
                "¡Este es el mejor día!",
                "¡Me encanta mi vida! 💛"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Prioridad 6: Felicidad moderada
        if (this.felicidad > 70) {
            const frases = [
                "Me siento bien 😊",
                "La vida está bonita",
                "¿Quieres jugar conmigo?",
                "Estoy de buen humor"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Prioridad 7: Felicidad baja
        if (this.felicidad < 40) {
            const frases = [
                "Me siento triste 😢",
                "¿Por qué estoy tan solo?",
                "Necesito atención...",
                "Estoy deprimido 😞"
            ];
            return frases[Math.floor(Math.random() * frases.length)];
        }

        // Pensamientos neutrales por defecto
        const frases = [
            "Simplemente existo... 😺",
            "¿Qué haré ahora?",
            "La vida es un misterio",
            "Mmmm... 🐱",
            "Estoy aquí, presente"
        ];
        return frases[Math.floor(Math.random() * frases.length)];
    }

    /**
     * Acción: Alimentar a Taco
     */
    alimentar() {
        if (this.hambre > 10) {
            this.hambre = Math.max(this.hambre - 40, this.minStats);
            this.energia = Math.max(this.energia - 5, this.minStats);
            this.felicidad = Math.min(this.felicidad + 15, this.maxStats);
            
            this.agregarPensamiento("¡Ñam ñam! 😋 Gracias por la comida");
        } else {
            this.agregarPensamiento("Estoy muy lleno... 🤢");
        }
        
        this.actualizarUI();
    }

    /**
     * Acción: Jugar con Taco
     */
    jugar() {
        if (this.energia < 20) {
            this.agregarPensamiento("Estoy muy cansado para jugar 😴");
        } else {
            this.energia = Math.max(this.energia - 30, this.minStats);
            this.hambre = Math.min(this.hambre + 20, this.maxStats);
            this.felicidad = Math.min(this.felicidad + 35, this.maxStats);
            
            const juegos = [
                "¡Wiii! ¡Me encanta jugar! 🎮",
                "¡Esto es divertido! 😹",
                "¡Atrápame si puedes! 🏃",
                "¡Jajaja! ¡Más juegos! 🎪"
            ];
            this.agregarPensamiento(juegos[Math.floor(Math.random() * juegos.length)]);
        }
        
        this.actualizarUI();
    }

    /**
     * Acción: Dormir para recuperar energía
     */
    dormir() {
        this.energia = Math.min(this.energia + 50, this.maxStats);
        this.hambre = Math.min(this.hambre + 15, this.maxStats);
        this.felicidad = Math.max(this.felicidad - 5, this.minStats);
        
        const suenos = [
            "Zzzzzzz... 😴",
            "Que descanso tan reconfortante... 🛏️",
            "Tengo buenos sueños contigo",
            "Zzz... Sueño con atún... Zzz"
        ];
        this.agregarPensamiento(suenos[Math.floor(Math.random() * suenos.length)]);
        
        this.actualizarUI();
    }

    /**
     * Acción: Acariciar a Taco para aumentar felicidad
     */
    acariciar() {
        this.felicidad = Math.min(this.felicidad + 20, this.maxStats);
        this.energia = Math.max(this.energia - 5, this.minStats);
        this.hambre = Math.min(this.hambre + 5, this.maxStats);
        
        const reacciones = [
            "¡Purr purr! 🐱❤️",
            "Esto es lo mejor del mundo 😻",
            "¡Sigue acariciándome!",
            "Te quiero humano ❤️"
        ];
        this.agregarPensamiento(reacciones[Math.floor(Math.random() * reacciones.length)]);
        
        this.actualizarUI();
    }

    /**
     * Agrega un pensamiento al historial
     */
    agregarPensamiento(pensamiento) {
        // Actualizar pensamiento actual
        document.getElementById('petThought').textContent = pensamiento;
        
        // Agregar al historial
        this.pensamientos.unshift(pensamiento);
        if (this.pensamientos.length > 5) {
            this.pensamientos.pop();
        }

        // Actualizar log visual
        const thoughtLog = document.getElementById('thoughtLog');
        thoughtLog.innerHTML = this.pensamientos
            .map(p => `<div class="thought-item">💭 ${p}</div>`)
            .join('');
    }

    /**
     * Actualiza la interfaz con los estados actuales
     */
    actualizarUI() {
        // Actualizar barras de progreso
        document.getElementById('hambreBar').style.width = this.hambre + '%';
        document.getElementById('hambreValue').textContent = Math.round(this.hambre);

        document.getElementById('energiaBar').style.width = this.energia + '%';
        document.getElementById('energiaValue').textContent = Math.round(this.energia);

        document.getElementById('felicidadBar').style.width = this.felicidad + '%';
        document.getElementById('felicidadValue').textContent = Math.round(this.felicidad);

        // Cambiar avatar según estado
        this.actualizarAvatar();

        // Deshabilitar botones según condiciones
        this.actualizarDisponibilidadBotones();
    }

    /**
     * Cambia el avatar del gato según su estado
     */
    actualizarAvatar() {
        const avatar = document.getElementById('petAvatar');
        
        if (this.energia < 20) {
            avatar.textContent = '😴';
        } else if (this.hambre > 80) {
            avatar.textContent = '😵';
        } else if (this.felicidad > 85) {
            avatar.textContent = '😻';
        } else if (this.felicidad < 35) {
            avatar.textContent = '😿';
        } else {
            avatar.textContent = '🐱';
        }
    }

    /**
     * Actualiza disponibilidad de botones según estado de Taco
     */
    actualizarDisponibilidadBotones() {
        const jugarBtn = document.getElementById('jugarBtn');
        const dormirBtn = document.getElementById('dormirBtn');

        // No puede jugar si tiene muy poca energía o hambre extrema
        jugarBtn.disabled = this.energia < 20 || this.hambre > 80;

        // Dormir siempre disponible pero no si está muy descansado
        dormirBtn.disabled = this.energia > 95;
    }

    /**
     * Reinicia el juego
     */
    reiniciar() {
        this.hambre = 50;
        this.energia = 60;
        this.felicidad = 70;
        this.pensamientos = [];
        
        this.agregarPensamiento("¡Nuevo día! ¡Vamos a empezar! 🎉");
        this.actualizarUI();
    }
}

// Crear instancia global de Taco
let taco;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    taco = new Tamagotchi();
});
