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
    const progressContainer = document.querySelector(".progress-container");
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
            ? '<img src="img/pause.svg" alt="Pause">' 
            : '<img src="img/play.svg" alt="Play">';
        
        playPauseBtn.innerHTML = playPauseIcon;
        mobilePlayPauseBtn.innerHTML = playPauseIcon;
    }

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    }

    function updateProgress() {
        progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
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
        const icon = '<img src="img/pause.svg" alt="Pause">';
        playPauseBtn.innerHTML = icon;
        mobilePlayPauseBtn.innerHTML = icon;
    });

    audio.addEventListener("pause", () => {
        isPlaying = false;
        const icon = '<img src="img/play.svg" alt="Play">';
        playPauseBtn.innerHTML = icon;
        mobilePlayPauseBtn.innerHTML = icon;
    });

    audio.addEventListener("timeupdate", updateProgress);
    
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