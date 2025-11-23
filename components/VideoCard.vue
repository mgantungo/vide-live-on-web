<!--components/VideoCard.vue-->
<template>
  <v-card
    :class="['video-card', { 'compact': compact }]"
    hover
    @click="$emit('click')"
  >
    <div class="video-card-content">
      <div class="thumbnail-wrapper">
        <div class="video-card-thumbnail">
          <!-- Thumbnail placeholder with gradient -->
          <div class="thumbnail-gradient" />
          
          <!-- Play overlay -->
          <v-overlay
            contained
            class="play-overlay-card"
            scrim="black"
            opacity="0.4"
          >
            <v-btn
              icon
              color="primary"
              size="large"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-overlay>

          <!-- Duration badge -->
          <v-chip
            class="duration-badge"
            size="small"
            color="black"
            variant="flat"
          >
            <v-icon start size="small">mdi-clock-outline</v-icon>
            {{ duration }}
          </v-chip>
        </div>
      </div>

      <!-- Video details section -->
      <v-card-text :class="compact ? 'pa-2' : 'pa-3'">
        <h3 :class="['video-title', compact ? 'text-body-2' : 'text-subtitle-1']">
          {{ title }}
        </h3>
        <p :class="['text-medium-emphasis', compact ? 'text-caption' : 'text-body-2', 'mt-1']">
          {{ channel }}
        </p>
        <p :class="['text-medium-emphasis', compact ? 'text-caption' : 'text-body-2']">
          {{ views }}
        </p>
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  channel: String,
  views: String,
  duration: String,
  thumbnail: String,
  compact: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.video-card {
  cursor: pointer;
  transition: transform 0.2s;
  background: rgba(30, 41, 59, 0.5);
}

.video-card:hover {
  transform: translateY(-4px);
}

.video-card.compact {
  display: flex;
}

.video-card.compact .video-card-content {
  display: flex;
  gap: 12px;
}

.video-card.compact .thumbnail-wrapper {
  width: 160px;
  flex-shrink: 0;
}

.video-card-thumbnail {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, #1e293b 50%, rgba(34, 211, 238, 0.2) 100%);
  border-radius: 8px;
  overflow: hidden;
}

.thumbnail-gradient {
  position: absolute;
  inset: 0;
}

.play-overlay-card {
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-card:hover .play-overlay-card {
  opacity: 1;
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.video-title {
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
</style>
