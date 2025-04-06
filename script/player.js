document.addEventListener("DOMContentLoaded", async () => {
    const audio = document.getElementById("audio");
    const cover = document.getElementById("cover");
    const title = document.getElementById("title");
    const artist = document.getElementById("artist");
    const playPauseBtn = document.getElementById("playPause");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const mobilePlayPauseBtn = document.getElementById("mobilePlayPause");
    const mobilePrevBtn = document.getElementById("mobilePrev");
    const mobileNextBtn = document.getElementById("mobileNext");
    const progressBar = document.getElementById("progress");
    const progressContainer = document.querySelector(".progress-bar-container");
    const background = document.createElement("div");
    
    background.classList.add("background");
    document.body.prepend(background);

    let playlist = [];
    let currentTrackIndex = 0;
    let isPlaying = false;

    async function loadPlaylist() {
        const response = await fetch("music/music.json");
        playlist = await response.json();
        updateTrack();
    }

    function updateTrack() {
        const track = playlist[currentTrackIndex];
        title.textContent = track.title;
        artist.textContent = track.artist;
        cover.src = track.cover;
        audio.src = track.src;
        background.style.backgroundImage = `url(${track.cover})`;
        
        const playPauseIcon = isPlaying 
            ? '<img src="img/icon/pause.svg" alt="Pause">' 
            : '<img src="img/icon/play.svg" alt="Play">';
        
        playPauseBtn.innerHTML = playPauseIcon;
        mobilePlayPauseBtn.innerHTML = playPauseIcon;
        
        document.getElementById('currentTime').textContent = "0:00";
        document.getElementById('duration').textContent = "0:00";
    }

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    }

    function updateProgress() {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = progressPercent + "%";
        document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function seekTo(event) {
        const clickPosition = event.offsetX;
        const containerWidth = progressContainer.offsetWidth;
        const newTime = (clickPosition / containerWidth) * audio.duration;
        audio.currentTime = newTime;
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length; 
        isPlaying = true;
        updateTrack(); 
        audio.play();
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length; 
        isPlaying = true;
        updateTrack(); 
        audio.play();
    }

    audio.addEventListener("play", () => {
        isPlaying = true;
        const icon = '<img src="img/icon/pause.svg" alt="Pause">';
        playPauseBtn.innerHTML = icon;
        mobilePlayPauseBtn.innerHTML = icon;
    });

    audio.addEventListener("pause", () => {
        isPlaying = false;
        const icon = '<img src="img/icon/play.svg" alt="Play">';
        playPauseBtn.innerHTML = icon;
        mobilePlayPauseBtn.innerHTML = icon;
    });

    audio.addEventListener("timeupdate", updateProgress);
    
    audio.addEventListener('loadedmetadata', function() {
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });

    playPauseBtn.addEventListener("click", togglePlay);
    mobilePlayPauseBtn.addEventListener("click", togglePlay);
    
    nextBtn.addEventListener("click", nextTrack);
    mobileNextBtn.addEventListener("click", nextTrack);
    
    prevBtn.addEventListener("click", prevTrack);
    mobilePrevBtn.addEventListener("click", prevTrack);

    progressContainer.addEventListener("click", seekTo);
    
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        document.querySelector('.desktop-controls').style.opacity = '0';
        document.querySelector('.mobile-controls').style.display = 'flex';
    }
    
    loadPlaylist();
});