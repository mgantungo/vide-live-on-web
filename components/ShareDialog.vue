<!--components/ShareDialog.vue-->
<template>
  <v-dialog v-model="dialogOpen" max-width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h6">Share Video</div>
          <div class="text-caption text-medium-emphasis">
            Share this video with your friends and followers
          </div>
        </div>
        <v-btn
          icon
          variant="text"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div class="mb-4">
          <!-- Copy Link Section -->
          <v-text-field
            :model-value="videoUrl"
            readonly
            variant="outlined"
            hide-details
            density="comfortable"
          >
            <template v-slot:append-inner>
              <v-btn
                icon
                size="small"
                color="primary"
                @click="handleCopyLink"
              >
                <v-icon>{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <!-- Social Media Share Options -->
        <div class="share-options">
          <v-btn
            v-for="option in shareOptions"
            :key="option.name"
            class="share-btn"
            variant="flat"
            color="surface"
            @click="option.action"
          >
            <div class="share-btn-content">
              <v-icon :icon="option.icon" size="24" />
              <span class="text-caption">{{ option.name }}</span>
            </div>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  open: Boolean,
  videoTitle: String,
  videoUrl: String,
})

const emit = defineEmits(['update:open'])

const dialogOpen = ref(props.open)
const copied = ref(false)

watch(() => props.open, (newVal) => {
  dialogOpen.value = newVal
})

watch(dialogOpen, (newVal) => {
  if (!newVal) {
    close()
  }
})

const close = () => {
  emit('update:open', false)
}

const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.videoUrl)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const shareOptions = computed(() => [
  {
    name: "Facebook",
    icon: "mdi-facebook",
    action: () => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.videoUrl)}`,
        "_blank",
        "width=600,height=400"
      )
    },
  },
  {
    name: "Twitter",
    icon: "mdi-twitter",
    action: () => {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.videoTitle)}&url=${encodeURIComponent(props.videoUrl)}`,
        "_blank",
        "width=600,height=400"
      )
    },
  },
  {
    name: "LinkedIn",
    icon: "mdi-linkedin",
    action: () => {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.videoUrl)}`,
        "_blank",
        "width=600,height=400"
      )
    },
  },
  {
    name: "WhatsApp",
    icon: "mdi-whatsapp",
    action: () => {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(props.videoTitle + " " + props.videoUrl)}`,
        "_blank"
      )
    },
  },
  {
    name: "Email",
    icon: "mdi-email",
    action: () => {
      window.location.href = `mailto:?subject=${encodeURIComponent(props.videoTitle)}&body=${encodeURIComponent(props.videoUrl)}`
    },
  },
])
</script>

<style scoped>
.share-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.share-btn {
  height: auto !important;
  padding: 16px 8px !important;
}

.share-btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.share-btn:hover {
  background-color: rgba(34, 211, 238, 0.1) !important;
}
</style>
