const mockArtists = [
  {
    id: 1,
    name: "Ed Sheeran",
    image: "images/imagen0.png",
    songs: [
      { id: 101, name: "Shape of You" },
      { id: 102, name: "Perfect" }
    ]
  },
  {
    id: 2,
    name: "The Weeknd",
    image: "images/imagen1.png",
    songs: [
      { id: 201, name: "Blinding Lights" },
      { id: 202, name: "Save Your Tears" }
    ]
  },
  {
    id: 3,
    name: "Bruno Mars",
    image: "images/imagen2.png",
    songs: [
      { id: 301, name: "Die With A Smile" },
      { id: 302, name: "Locked Out Of Heaven" }
    ]
  }
];

let selectedArtist = null;
let selectedSong = null;
// ahora almacenamos comentarios como objetos con metadatos
let comments = []; // [{ date, songId, songName, artistId, artistName, userName, userEmail, commentText }]


function renderArtists() {
  const artistsList = document.getElementById('artistsList');
  artistsList.innerHTML = '';
  mockArtists.forEach(artist => {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center' + (selectedArtist && selectedArtist.id === artist.id ? ' active' : '');
    li.style.cursor = 'pointer';

    const name = document.createElement('div');
    name.textContent = artist.name;
    name.className = 'fw-bold mb-1';

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'artist-img-wrapper mx-auto mb-1';
    if (selectedArtist && selectedArtist.id === artist.id) {
      imgWrapper.classList.add('expanded');
    }

    const img = document.createElement('img');
    img.src = artist.image;
    img.alt = artist.name;
    img.className = 'artist-square-img mt-1';

    imgWrapper.appendChild(img);

    li.appendChild(name);
    li.appendChild(imgWrapper);

    li.onclick = () => {
      selectedArtist = artist;
      selectedSong = null;
      renderArtists();
      renderSongs();
      hideSongDetails();
    };
    artistsList.appendChild(li);
  });
}

function renderSongs() {
  const songsTitle = document.getElementById('songsTitle');
  const songsList = document.getElementById('songsList');
  songsList.innerHTML = '';
  if (!selectedArtist) {
    songsTitle.textContent = 'Canciones';
    return;
  }
  songsTitle.textContent = `Canciones de ${selectedArtist.name}`;
  selectedArtist.songs.forEach(song => {
    const li = document.createElement('li');
    li.className = 'list-group-item' + (selectedSong && selectedSong.id === song.id ? ' active' : '');
    li.textContent = song.name;
    li.style.cursor = 'pointer';
    li.onclick = () => {
      selectedSong = song;
      renderSongs();
      showSongDetails(song);
    };
    songsList.appendChild(li);
  });
}

function populateSelectsForForm(currentSong) {
  const favArtist = document.getElementById('favArtist');
  const favSong = document.getElementById('favSong');
  const preview = document.getElementById('formArtistImage');
  // limpiar
  favArtist.innerHTML = '<option value="">Seleccione un artista...</option>';
  mockArtists.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.name;
    favArtist.appendChild(opt);
  });
  // seleccionar artista actual
  if (selectedArtist) favArtist.value = selectedArtist.id;

  // popular canciones según artista seleccionado
  function fillSongsForArtist(artistId) {
    favSong.innerHTML = '<option value="">Seleccione una canción...</option>';
    const artist = mockArtists.find(a => String(a.id) === String(artistId)) || selectedArtist;
    if (!artist) return;
    artist.songs.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      favSong.appendChild(opt);
    });
    // si no hay selección y existen canciones, seleccionar la primera
    if (!favSong.value && artist.songs.length) favSong.value = artist.songs[0].id;
  }

  fillSongsForArtist(favArtist.value || (selectedArtist && selectedArtist.id));
  if (currentSong) favSong.value = currentSong.id;

  // establecer preview inicial
  const initialArtist = mockArtists.find(a => String(a.id) === String(favArtist.value)) || selectedArtist;
  if (preview) {
    if (initialArtist) {
      preview.src = initialArtist.image || '';
      preview.alt = initialArtist.name || 'Artista';
      preview.style.display = initialArtist.image ? '' : 'none';
    } else {
      preview.src = '';
      preview.style.display = 'none';
    }
  }

  // actualizar canciones y vista principal cuando cambie artista en el select
  favArtist.onchange = (e) => {
    const artId = e.target.value;
    fillSongsForArtist(artId);

    const art = mockArtists.find(a => String(a.id) === String(artId));
    // actualizar preview en el formulario
    if (preview) {
      if (art) {
        preview.src = art.image || '';
        preview.alt = art.name || 'Artista';
        preview.style.display = art.image ? '' : 'none';
      } else {
        preview.src = '';
        preview.style.display = 'none';
      }
    }

    // sincronizar la vista principal: seleccionar artista en la lista y actualizar canciones
    if (art) {
      selectedArtist = art;
      selectedSong = null; // opcional: limpiar selección de canción principal
      renderArtists();
      renderSongs();
      hideSongDetails(); // ocultar detalles si quieres que el usuario reabra
    } else {
      selectedArtist = null;
      selectedSong = null;
      renderArtists();
      renderSongs();
      hideSongDetails();
    }
  };
}

function showSongDetails(song) {
  document.getElementById('songDetails').style.display = '';
  document.getElementById('songName').textContent = `${song.name} - ${selectedArtist.name}`;
  // limpiar form fields
  document.getElementById('userName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('commentText').value = '';
  populateSelectsForForm(song);
  renderComments(song.id);
  setupFormHandler(song);
}

function hideSongDetails() {
  document.getElementById('songDetails').style.display = 'none';
}

function setupFormHandler(contextSong) {
  const form = document.getElementById('commentForm');
  const clearBtn = document.getElementById('clearFormBtn');
  form.onsubmit = function(e) {
    e.preventDefault();
    // Validación nativa + validaciones extra
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const favArtistId = document.getElementById('favArtist').value;
    const favSongId = document.getElementById('favSong').value;
    const commentText = document.getElementById('commentText').value.trim();

    if (userName.length < 2 || commentText.length < 5) {
      form.classList.add('was-validated');
      return;
    }

    const artistObj = mockArtists.find(a => String(a.id) === String(favArtistId)) || selectedArtist;
    const songObj = (artistObj && artistObj.songs.find(s => String(s.id) === String(favSongId))) || contextSong;

    const newComment = {
      date: new Date().toLocaleString('es-ES'),
      songId: songObj.id,
      songName: songObj.name,
      artistId: artistObj.id,
      artistName: artistObj.name,
      userName,
      userEmail,
      commentText
    };
    comments.push(newComment);

    // renderizado
    renderComments(contextSong.id);
    renderCommentsTable();
    // limpiar form y feedback
    form.reset();
    form.classList.remove('was-validated');
  };

  clearBtn.onclick = () => {
    form.reset();
    form.classList.remove('was-validated');
  };
}

function renderComments(songId) {
  const commentsList = document.getElementById('commentsList');
  commentsList.innerHTML = '';
  const songComments = comments.filter(c => String(c.songId) === String(songId));
  if (songComments.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-light';
    li.textContent = 'Sin comentarios aún.';
    commentsList.appendChild(li);
  } else {
    songComments.forEach(c => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-dark text-light';
      li.innerHTML = `<strong>${escapeHtml(c.userName)}</strong> <small class="text-muted">(${c.date})</small><br>${escapeHtml(c.commentText)}`;
      commentsList.appendChild(li);
    });
  }
}

function renderCommentsTable() {
  const tbody = document.getElementById('commentsTableBody');
  tbody.innerHTML = '';
  comments.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(c.date)}</td>
      <td>${escapeHtml(c.songName)}</td>
      <td>${escapeHtml(c.artistName)}</td>
      <td>${escapeHtml(c.userName)}</td>
      <td>${escapeHtml(c.userEmail)}</td>
      <td>${escapeHtml(c.commentText)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// pequeña utilidad para prevenir inyección en el DOM
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.onload = function() {
  renderArtists();
  renderSongs();
  renderCommentsTable();
};