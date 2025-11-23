<!--pages/category/[categoryName].vue-->
<template>
  <v-app>
    <!-- Header -->
    <v-app-bar elevation="1" color="surface">
      <v-container fluid>
        <v-row align="center">
          <v-col cols="auto">
            <v-btn
              icon
              variant="text"
              @click="goBack"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              variant="text"
              prepend-icon="mdi-home"
              @click="goHome"
            >
              Home
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <!-- Category Content -->
      <v-container v-if="category" fluid class="py-8">
        <div class="mb-8">
          <h2 class="text-h3 font-weight-bold mb-2">{{ category.title }}</h2>
          <p class="text-medium-emphasis">{{ category.videos.length }} videos available</p>
        </div>

        <!-- Video Grid -->
        <v-row>
          <v-col
            v-for="video in category.videos"
            :key="video.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <div @click="handleVideoClick(video.id)">
              <VideoCard v-bind="video" />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Category Not Found -->
      <v-container v-else fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <h1 class="text-h3 font-weight-bold mb-4">Category Not Found</h1>
            <v-btn
              color="primary"
              size="large"
              @click="goHome"
            >
              Go to Home
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  trendingVideos,
  musicVideos,
  gamingVideos,
  educationVideos,
  relatedVideos,
} from '~/stores/videoData'
import VideoCard from '~/components/VideoCard.vue'

const route = useRoute()
const router = useRouter()

const categoryMap = {
  trending: { title: "🔥 Trending Videos", videos: trendingVideos },
  music: { title: "🎵 Music Videos", videos: musicVideos },
  gaming: { title: "🎮 Gaming Videos", videos: gamingVideos },
  education: { title: "📚 Education Videos", videos: educationVideos },
  latest: { title: "📺 Latest Videos", videos: relatedVideos },
}

const category = computed(() => {
  const categoryName = route.params.categoryName
  return categoryMap[categoryName] || null
})

const goBack = () => {
  router.push('/tv')
}

const goHome = () => {
  router.push('/tv')
}

const handleVideoClick = (videoId) => {
  router.push(`/tv?video=${videoId}`)
}
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
</style>
