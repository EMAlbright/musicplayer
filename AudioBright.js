document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', searchSong);

  async function searchSong() {
    const searchInput = document.getElementById('search-input').value;
    const url =
      'https://shazam.p.rapidapi.com/search?term=' +
      encodeURIComponent(searchInput);
    const options = {
      headers: {
        'X-RapidAPI-Key': '2af26f4245msh16ed231a749e96fp196140jsn816f5f0c8e15',
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      const songList = document.getElementById('song-list');

      if (
        data.tracks &&
        data.tracks.hits &&
        data.tracks.hits.length > 0
      ) {
        const tracks = data.tracks.hits.slice(0, 10).map((hit) => hit.track);

        songList.innerHTML = ''; 

        tracks.forEach((track, index) => {
          const trackElement = document.createElement('div');
          trackElement.classList.add('track');
          trackElement.dataset.genre = track.genre;
          trackElement.innerHTML = `
            <h3>${track.title}</h3>
            <p>${track.subtitle}</p>
            <button class="play-button">Play</button>
            <button class="pause-button">Pause</button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1">
          `;

          const playButton = trackElement.querySelector('.play-button');
          playButton.addEventListener('click', () => playTrack(track.hub.actions[1].uri, index));

          const pauseButton = trackElement.querySelector('.pause-button');
          pauseButton.addEventListener('click', () => pauseTrack(index));

          const volumeSlider = trackElement.querySelector('.volume-slider');
          volumeSlider.addEventListener('input', () => setVolume(volumeSlider.value, index));

          songList.appendChild(trackElement);
        });
      } else {
        console.log('No songs found.');
        songList.innerHTML = '<p>No songs found.</p>';
      }
    } catch (error) {
      console.error(error);
    }
  }

  const audioInstances = [];

  function playTrack(uri, index) {
    const audio = new Audio(uri);
    audio.volume = 1;
    audioInstances[index] = audio;
    audio.play();

    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        button.style.display = 'none';
      } else {
        button.style.display = 'inline-block';
      }
    });

    const pauseButtons = document.querySelectorAll('.pause-button');
    pauseButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        button.style.display = 'inline-block';
      } else {
        button.style.display = 'none';
      }
    });
  }

  function pauseTrack(index) {
    const audio = audioInstances[index];
    if (audio) {
      audio.pause();

      const playButtons = document.querySelectorAll('.play-button');
      playButtons.forEach((button) => {
        button.style.display = 'inline-block';
      });

      const pauseButtons = document.querySelectorAll('.pause-button');
      pauseButtons.forEach((button) => {
        button.style.display = 'none';
      });
    }
  }

  function setVolume(volume, index) {
    const audio = audioInstances[index];
    if (audio) {
      audio.volume = volume;
    }
  }
});

  