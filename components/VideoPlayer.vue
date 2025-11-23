<!--components/VideoPlayer.vue-->
<template>
  <v-card class="video-player" elevation="2">
    <div class="video-container">
      <!-- HTML5 Video Element -->
      <video
        ref="videoRef"
        class="video-element"
        :src="videoUrl"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @ended="handleVideoEnded"
        @click="togglePlayPause"
      >
        Your browser does not support the video tag.
      </video>

      <!-- Play/Pause button overlay - only when paused -->
      <v-overlay
        v-model="showPlayOverlay"
        contained
        class="play-overlay"
        @click.stop="togglePlayPause"
      >
        <v-btn
          icon
          size="x-large"
          color="primary"
          elevation="8"
        >
          <v-icon size="48">mdi-play</v-icon>
        </v-btn>
      </v-overlay>

      <!-- Controls overlay -->
      <div class="controls-overlay" :class="{ 'show': showControls }">
        <v-container fluid class="controls-container">
          <!-- Progress bar -->
          <v-slider
            v-model="progress"
            :min="0"
            :max="100"
            hide-details
            color="primary"
            track-color="grey-darken-2"
            class="progress-slider"
            @click="handleProgressClick"
          />

          <!-- Control buttons -->
          <div class="controls-buttons">
            <div class="controls-left">
              <v-btn
                icon
                size="small"
                variant="text"
                @click="togglePlayPause"
              >
                <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                @click="handleSkipBack"
              >
                <v-icon>mdi-skip-backward</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                @click="handleSkipForward"
              >
                <v-icon>mdi-skip-forward</v-icon>
              </v-btn>

              <div class="volume-controls">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="toggleMute"
                >
                  <v-icon>{{ isMuted || volume === 0 ? 'mdi-volume-off' : 'mdi-volume-high' }}</v-icon>
                </v-btn>
                <v-slider
                  v-model="volume"
                  :min="0"
                  :max="100"
                  hide-details
                  color="primary"
                  track-color="grey-darken-2"
                  class="volume-slider"
                  @input="handleVolumeChange"
                />
              </div>

              <span class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </span>
            </div>

            <div class="controls-right">
              <v-btn
                icon
                size="small"
                variant="text"
                @click="toggleFullscreen"
              >
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  title: String,
  channel: String,
  views: String,
  videoUrl: String,
})

const videoRef = ref(null)
const isPlaying = ref(false)
const volume = ref(80)
const progress = ref(0)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isFullscreen = ref(false)
const showControls = ref(true)
const showPlayOverlay = computed(() => !isPlaying.value)

// Format time in MM:SS or HH:MM:SS
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00"
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Update video element when playing state changes
watch(isPlaying, (newVal) => {
  if (!videoRef.value) return
  
  if (newVal) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
})

// Sync volume with video element
watch([volume, isMuted], ([newVolume, newMuted]) => {
  if (videoRef.value) {
    videoRef.value.volume = newVolume / 100
    videoRef.value.muted = newMuted
  }
})

// Handle video time updates
const handleTimeUpdate = () => {
  if (!videoRef.value) return
  const current = videoRef.value.currentTime
  const total = videoRef.value.duration
  
  currentTime.value = current
  if (total > 0) {
    progress.value = (current / total) * 100
  }
}

// Handle video metadata loaded
const handleLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

// Handle video ended
const handleVideoEnded = () => {
  isPlaying.value = false
  progress.value = 0
  if (videoRef.value) {
    videoRef.value.currentTime = 0
  }
}

// Reset on video change
watch(() => props.videoUrl, () => {
  isPlaying.value = false
  progress.value = 0
  currentTime.value = 0
  if (videoRef.value) {
    videoRef.value.currentTime = 0
  }
})

const handleProgressClick = (event) => {
  if (!videoRef.value || duration.value === 0) return
  const newTime = (progress.value / 100) * duration.value
  videoRef.value.currentTime = newTime
  currentTime.value = newTime
}

const handleSkipBack = () => {
  if (!videoRef.value) return
  const newTime = Math.max(0, currentTime.value - 10)
  videoRef.value.currentTime = newTime
}

const handleSkipForward = () => {
  if (!videoRef.value) return
  const newTime = Math.min(duration.value, currentTime.value + 10)
  videoRef.value.currentTime = newTime
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const handleVolumeChange = () => {
  isMuted.value = volume.value === 0
}

const toggleFullscreen = () => {
  if (!videoRef.value?.parentElement) return
  
  if (!isFullscreen.value) {
    videoRef.value.parentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
}
</script>

<style scoped>
.video-player {
  position: relative;
  background: black;
  border-radius: 8px;
  overflow: hidden;
}

.video-container {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.play-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.controls-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.video-container:hover .controls-overlay {
  opacity: 1;
}

.controls-overlay.show {
  opacity: 1;
}

.controls-container {
  padding: 16px;
}

.progress-slider {
  margin-bottom: 8px;
}

.controls-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.volume-slider {
  width: 100px;
}

.time-display {
  font-size: 14px;
  color: white;
  margin-left: 8px;
}
</style>
