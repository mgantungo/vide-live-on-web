<!--pages/tv.vue-->
<template>
  <v-app>
    <!-- Top Navigation -->
    <v-app-bar elevation="1" color="surface">
      <v-container fluid>
        <v-row align="center">
          <v-col cols="auto">
            <h1 class="text-h5 font-weight-bold" style="color: rgb(34, 211, 238)">ViDE LIVE</h1>
          </v-col>
          <v-col>
            <v-btn
              variant="text"
              prepend-icon="mdi-home"
              @click="navigateTo('/tv')"
            >
              Home
            </v-btn>
            <v-btn
              variant="text"
              prepend-icon="mdi-trending-up"
              @click="navigateTo('/category/trending')"
            >
              Trending
            </v-btn>
            <v-btn
              variant="text"
              prepend-icon="mdi-movie"
              @click="navigateTo('/category/latest')"
            >
              Latest
            </v-btn>
            <v-btn
              variant="text"
              prepend-icon="mdi-music"
              @click="navigateTo('/category/music')"
            >
              Music
            </v-btn>
            <v-btn
              variant="text"
              prepend-icon="mdi-gamepad-variant"
              @click="navigateTo('/category/gaming')"
            >
              Gaming
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container fluid class="py-6 main-container">
        <v-row class="content-row" no-gutters>
          <!-- Left Section: Player + Related Videos -->
          <v-col cols="12" md="12" lg="12" xl="12" class="left-column">
            <!-- Video Player -->
            <div ref="playerSection">
              <VideoPlayer
                :title="currentVideo.title"
                :channel="currentVideo.channel"
                :views="currentVideo.views"
                :videoUrl="currentVideo.videoUrl"
              />
            </div>

            <!-- Video Info -->
            <v-card class="mt-6" variant="flat">
              <v-card-title class="text-h5 font-weight-bold">
                {{ currentVideo.title }}
              </v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="8">
                    <p class="text-subtitle-1 font-weight-medium">{{ currentVideo.channel }}</p>
                    <p class="text-caption text-medium-emphasis">{{ currentVideo.channelSubscribers }}</p>
                    <div class="d-flex align-center ga-4 mt-2">
                      <div class="d-flex align-center ga-1 text-medium-emphasis">
                        <v-icon size="small">mdi-eye</v-icon>
                        <span class="text-body-2">{{ currentVideo.views }}</span>
                      </div>
                      <div class="d-flex align-center ga-1 text-medium-emphasis">
                        <v-icon size="small">mdi-thumb-up</v-icon>
                        <span class="text-body-2">{{ likes.toLocaleString() }} likes</span>
                      </div>
                      <span class="text-caption text-medium-emphasis">{{ currentVideo.uploadDate }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex ga-2 justify-end align-start">
                    <v-btn
                      :color="isLiked ? 'primary' : ''"
                      :variant="isLiked ? 'flat' : 'tonal'"
                      prepend-icon="mdi-thumb-up"
                      @click="handleLike"
                    >
                      {{ isLiked ? 'Liked' : 'Like' }}
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="flat"
                      @click="subscribeDialogOpen = true"
                    >
                      Subscribe
                    </v-btn>
                    <v-btn
                      variant="tonal"
                      @click="shareDialogOpen = true"
                    >
                      Share
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Video Description -->
            <v-card class="mt-4" variant="tonal">
              <v-card-text>
                <p class="text-body-2">{{ currentVideo.description }}</p>
              </v-card-text>
            </v-card>

            <!-- Related Videos Horizontal Scroller -->
            <div class="mt-6">
              <h2 class="text-h6 font-weight-semibold mb-4">Related Videos</h2>
              <div class="related-videos-scroll">
                <div
                  v-for="video in relatedVideosList"
                  :key="video.id"
                  class="related-video-item"
                  @click="handleVideoClick(video.id)"
                >
                  <VideoCard v-bind="video" />
                </div>
              </div>
            </div>
          </v-col>

          <!-- Right Sidebar: Comments & Categories -->
          <v-col cols="12" md="12" lg="12" xl="12" class="right-column">
            <v-card class="sidebar-card" elevation="2">
              <v-card-text class="pa-6">
                <CommentSection />
                
                <v-divider class="my-6" />
                <CategorySection title="🔥 Trending Now" :videos="trendingVideos" categoryPath="trending" />
                
                <v-divider class="my-6" />
                <CategorySection title="🎵 Music" :videos="musicVideos" categoryPath="music" />
                
                <v-divider class="my-6" />
                <CategorySection title="🎮 Gaming" :videos="gamingVideos" categoryPath="gaming" />
                
                <v-divider class="my-6" />
                <CategorySection title="📚 Education" :videos="educationVideos" categoryPath="education" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Share Dialog -->
    <ShareDialog
      :open="shareDialogOpen"
      @update:open="shareDialogOpen = $event"
      :videoTitle="currentVideo.title"
      :videoUrl="currentVideoUrl"
    />

    <!-- Subscribe Dialog -->
    <SubscribeDialog
      :open="subscribeDialogOpen"
      @update:open="subscribeDialogOpen = $event"
      :channelName="currentVideo.channel"
      :subscribers="currentVideo.channelSubscribers"
    />
  </v-app>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { relatedVideos, trendingVideos, musicVideos, gamingVideos, educationVideos } from '~/stores/videoData'
import { getVideoDetails } from '~/stores/videoDetailsData'
import VideoPlayer from '~/components/VideoPlayer.vue'
import VideoCard from '~/components/VideoCard.vue'
import CategorySection from '~/components/CategorySection.vue'
import CommentSection from '~/components/CommentSection.vue'
import ShareDialog from '~/components/ShareDialog.vue'
import SubscribeDialog from '~/components/SubscribeDialog.vue'

const route = useRoute()
const router = useRouter()

const playerSection = ref(null)
const videoId = computed(() => route.query.video)
const currentVideo = computed(() => getVideoDetails(videoId.value))

const isLiked = ref(false)
const likes = ref(12543)
const shareDialogOpen = ref(false)
const subscribeDialogOpen = ref(false)

const currentVideoUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return `https://streamtv.app/tv?video=${videoId.value || 'default'}`
})

// Reset like state when video changes
watch(videoId, () => {
  isLiked.value = false
  likes.value = 12543 + Math.floor(Math.random() * 10000)
  
  // Scroll to player when video changes
  if (process.client && playerSection.value) {
    setTimeout(() => {
      playerSection.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }, 100)
  }
})

const handleLike = () => {
  isLiked.value = !isLiked.value
  likes.value = isLiked.value ? likes.value + 1 : likes.value - 1
}

const handleVideoClick = (id) => {
  router.push(`/tv?video=${id}`)
  // Scroll will be triggered by the videoId watcher
}

const navigateTo = (path) => {
  router.push(path)
}

// Get related videos (exclude current video)
const relatedVideosList = computed(() => {
  const allVideos = [...relatedVideos, ...trendingVideos, ...musicVideos, ...gamingVideos, ...educationVideos]
  
  // Remove duplicates and current video
  const uniqueVideos = allVideos.filter(
    (video, index, self) => index === self.findIndex((v) => v.id === video.id) && video.id !== videoId.value
  )
  
  // Shuffle and take first 5
  return uniqueVideos.sort(() => Math.random() - 0.5).slice(0, 5)
})

// Initialize likes on mount
onMounted(() => {
  likes.value = 12543 + Math.floor(Math.random() * 10000)
})
</script>

<style scoped>
/* Main container with max-width */
.main-container {
  max-width: 1920px;
  margin: 0 auto;
}

/* Desktop layout (xl and up - 1920px+) */
@media (min-width: 1920px) {
  .content-row {
    display: flex;
    gap: 24px;
  }
  
  .left-column {
    flex: 0 0 65vw;
    max-width: 65vw;
  }
  
  .right-column {
    flex: 0 0 30vw;
    max-width: 30vw;
  }
}

/* Large desktop layout (lg - 1264px to 1920px) */
@media (min-width: 1264px) and (max-width: 1919px) {
  .content-row {
    display: flex;
    gap: 24px;
  }
  
  .left-column {
    flex: 0 0 calc(65% - 12px);
    max-width: calc(65% - 12px);
  }
  
  .right-column {
    flex: 0 0 calc(35% - 12px);
    max-width: calc(35% - 12px);
  }
}

/* Tablet layout (md - 960px to 1263px) */
@media (min-width: 960px) and (max-width: 1263px) {
  .content-row {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .left-column,
  .right-column {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .sidebar-card {
    position: static !important;
    max-height: none !important;
  }
}

/* Mobile layout (sm and below - up to 959px) */
@media (max-width: 959px) {
  .content-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .left-column,
  .right-column {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .sidebar-card {
    position: static !important;
    max-height: none !important;
  }
}

/* Sidebar sticky behavior - only on large screens */
@media (min-width: 1264px) {
  .sidebar-card {
    position: sticky;
    top: 80px;
    max-height: calc(100vh - 96px);
    overflow-y: auto;
  }
}

.related-videos-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.related-video-item {
  width: 300px;
  flex-shrink: 0;
  cursor: pointer;
}

/* Mobile - smaller video cards */
@media (max-width: 599px) {
  .related-video-item {
    width: 250px;
  }
}

/* Custom scrollbar for sidebar */
.sidebar-card::-webkit-scrollbar {
  width: 8px;
}

.sidebar-card::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 4px;
}

.sidebar-card::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.sidebar-card::-webkit-scrollbar-thumb:hover {
  background: #22d3ee;
}

/* Custom scrollbar for related videos horizontal scroll */
.related-videos-scroll::-webkit-scrollbar {
  height: 8px;
}

.related-videos-scroll::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 4px;
}

.related-videos-scroll::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.related-videos-scroll::-webkit-scrollbar-thumb:hover {
  background: #22d3ee;
}
</style>
