Integrantes:
Gonzales Palacios Noelia Patricia
Huaman Bernaola Karen Salome
Tume Flores Osmar Ibrahin
Yana Revilla Cesar Augusto

Temática
La aplicación "SoundRate"  tiene por tematica para calificar y comentar canciones y artistas (estética inspirada en Spotify). La interfaz esta centrada en listar artistas, ver sus canciones, y permitir que usuarios publiquen comentarios sobre canciones.
Funcionalidades principales
  Lista de artistas y expansión de imagen al seleccionar: renderArtists — archivo app.js.
  Listado de canciones por artista y selección de una canción: renderSongs — app.js.
  Panel de detalles de canción con formulario para enviar comentarios: showSongDetails — app.js.
  Formulario con selects dependientes (artista → canciones), validación nativa y limpieza: populateSelectsForForm, setupFormHandler — app.js.
  Almacenamiento temporal en memoria de los comentarios (array comments) y renderizado de comentarios por canción: renderComments — app.js.
  Tabla resumen con todos los comentarios registrados: renderCommentsTable — app.js.
  Protección básica contra inyección al insertar texto en el DOM: escapeHtml — app.js.
  Estilos y diseño responsivo con CSS compilado y fuente SCSS: styles.css y styles.scss. Mapa de fuentes: styles.css.map.
  Estructura HTML y puntos de anclaje para renderizado dinámico y formularios: index.html.
