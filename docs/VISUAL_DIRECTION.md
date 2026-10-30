# Dirección visual · Terminator Ads

## Norte
Cristal claro, datos nítidos. Inspiración Liquid Glass: superficies translúcidas, luz en los bordes, profundidad suave y movimiento contenido. La interfaz debe sentirse ligera y precisa, con los datos como protagonista.

## Sistema
- Usar los tokens de `src/app/globals.css`; extenderlos antes de introducir valores aislados.
- Fondo perla con luces azul hielo y lavanda. Texto tinta; índigo como acento principal y verde para leads. No convertir cada módulo en un color diferente.
- Superficies `.glass`: blanco al 62%, borde blanco, desenfoque de 24px y sombra interior. Mantener las tablas más opacas y legibles. Alternativa sólida si no hay soporte de blur.
- Paneles de 28px de radio; controles compactos en cápsula. Espaciado basado en múltiplos de 4. Evitar cristal anidado que multiplique el coste de renderizado.
- Geist para la interfaz; cifras tabulares y uso limitado de monoespaciada en tablas. Un título protagonista por vista, encabezados breves y etiquetas discretas.
- Iconografía de trazo simple; los símbolos decorativos no se anuncian a lectores de pantalla.

## Movimiento y accesibilidad
Entrada de 650–750ms, interacciones de 180–300ms con `--ease-liquid`. Desplazamientos de 2–4px al pasar el cursor. Animar transform y opacity; nunca blur continuamente. Respetar `prefers-reduced-motion`. Foco visible, tabla desplazable con teclado y etiquetas semánticas. No reducir contraste para intensificar el cristal.

## Continuidad
Cada nueva vista debe reutilizar cabecera, superficies, radios, tipografía, estados y tokens. No añadir controles decorativos sin funcionalidad ni tendencias inventadas. Estados de carga, error y vacío forman parte del diseño. En móvil, apilar métricas y mantener el desplazamiento de la tabla dentro de su panel.

## Próximas iteraciones
1. Validar contraste, lectura y rendimiento sobre datos reales en escritorio y móvil.
2. Refinar reflejos y opacidad sobre los mismos tokens, conservando una jerarquía clara.
3. Extraer componentes compartidos cuando aparezca una segunda vista; mantener una sola fuente de estilos.
4. Considerar refracción reactiva al puntero únicamente si aporta valor y respeta dispositivos táctiles y movimiento reducido.

Antes de integrar: revisar 360px, 768px y 1440px; teclado, movimiento reducido, valores largos, tablas vacías y errores. Esta primera versión usa CSS para simular cristal; no implementa refracción óptica real.
