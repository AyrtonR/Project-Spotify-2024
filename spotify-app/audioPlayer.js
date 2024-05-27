function playTrack(trackUrl) {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = trackUrl;
    audioPlayer.play();
  }
  
  function pauseTrack() {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.pause();
  }