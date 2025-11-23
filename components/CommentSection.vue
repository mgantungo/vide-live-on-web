<!--components/CommentSection.vue-->
<template>
  <div class="comment-section">
    <h2 class="text-h6 font-weight-semibold mb-4">Comments ({{ comments.length }})</h2>
    
    <!-- Add Comment -->
    <v-card class="mb-4" variant="flat" color="surface">
      <v-card-text>
        <v-textarea
          v-model="newComment"
          label="Add a comment..."
          rows="3"
          variant="outlined"
          hide-details
        />
        <v-btn
          class="mt-2"
          block
          color="primary"
          prepend-icon="mdi-send"
          @click="handleAddComment"
        >
          Post Comment
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Comments List -->
    <div class="comments-list">
      <v-card
        v-for="comment in comments"
        :key="comment.id"
        class="mb-3"
        variant="flat"
        color="surface"
      >
        <v-card-text>
          <div class="comment-header">
            <div>
              <p class="text-subtitle-2 font-weight-medium">{{ comment.author }}</p>
              <span class="text-caption text-medium-emphasis">{{ comment.timestamp }}</span>
            </div>
          </div>
          <p class="text-body-2 mt-2">{{ comment.text }}</p>
          <v-btn
            variant="text"
            size="small"
            :color="comment.isLiked ? 'primary' : ''"
            class="mt-2"
            @click="handleLikeComment(comment.id)"
          >
            <v-icon start :class="comment.isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'">
              {{ comment.isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}
            </v-icon>
            {{ comment.likes }}
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { initialComments } from '~/stores/commentData'

const comments = ref([...initialComments])
const newComment = ref('')

const handleLikeComment = (id) => {
  comments.value = comments.value.map((comment) =>
    comment.id === id
      ? {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        }
      : comment
  )
}

const handleAddComment = () => {
  if (newComment.value.trim()) {
    const comment = {
      id: Date.now().toString(),
      author: "You",
      text: newComment.value,
      likes: 0,
      timestamp: "Just now",
      isLiked: false,
    }
    comments.value = [comment, ...comments.value]
    newComment.value = ""
  }
}
</script>

<style scoped>
.comment-section {
  padding: 16px 0;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.comment-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

/* Custom scrollbar */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: #22d3ee;
}
</style>
