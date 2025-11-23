<!--components/CategorySection.vue-->
<template>
  <div class="category-section">
    <div class="category-header">
      <h3 class="text-h6 font-weight-semibold">{{ title }}</h3>
      <v-btn
        v-if="categoryPath"
        icon
        size="small"
        variant="text"
        @click="handleSeeAll"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    
    <v-list class="video-list">
      <v-list-item
        v-for="video in videos"
        :key="video.id"
        class="px-0"
        @click="handleVideoClick(video.id)"
      >
        <VideoCard
          :title="video.title"
          :channel="video.channel"
          :views="video.views"
          :duration="video.duration"
          compact
        />
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import VideoCard from './VideoCard.vue'

const props = defineProps({
  title: String,
  videos: Array,
  categoryPath: String,
})

const router = useRouter()

const handleVideoClick = (videoId) => {
  router.push(`/tv?video=${videoId}`)
}

const handleSeeAll = () => {
  if (props.categoryPath) {
    router.push(`/category/${props.categoryPath}`)
  }
}
</script>

<style scoped>
.category-section {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.video-list {
  background: transparent;
}

.video-list :deep(.v-list-item) {
  padding: 0;
  margin-bottom: 12px;
}
</style>
