<!--components/SubscribeDialog.vue-->
<template>
  <v-dialog v-model="dialogOpen" max-width="500">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="d-flex align-center ga-2">
          <v-icon>mdi-bell</v-icon>
          <span>Subscribe to {{ channelName }}</span>
        </div>
        <v-btn
          icon
          variant="text"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle class="pb-4">
        Join {{ subscribers }} and never miss new content from this channel
      </v-card-subtitle>

      <v-card-text>
        <div v-if="isSubscribed" class="text-center py-8">
          <v-icon size="64" color="primary" class="mb-4">mdi-check-circle</v-icon>
          <p class="text-h6">You're subscribed!</p>
        </div>

        <v-form v-else @submit.prevent="handleSubmit">
          <v-text-field
            v-model="formData.name"
            label="Name"
            variant="outlined"
            :error-messages="errors.name"
            maxlength="100"
            required
            class="mb-3"
          />

          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            variant="outlined"
            :error-messages="errors.email"
            maxlength="255"
            required
            class="mb-3"
          />

          <v-checkbox
            v-model="formData.notifications"
            label="Send me email notifications for new videos"
            hide-details
            class="mb-4"
          />

          <v-btn
            type="submit"
            block
            color="primary"
            size="large"
            :loading="isSubmitting"
          >
            {{ isSubmitting ? "Subscribing..." : "Subscribe" }}
          </v-btn>

          <p class="text-caption text-center text-medium-emphasis mt-3">
            You can unsubscribe at any time from the notification emails
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  open: Boolean,
  channelName: String,
  subscribers: String,
})

const emit = defineEmits(['update:open'])

const dialogOpen = ref(props.open)

const formData = reactive({
  email: '',
  name: '',
  notifications: true,
})

const errors = reactive({})
const isSubmitting = ref(false)
const isSubscribed = ref(false)

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

const validateField = (field, value) => {
  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value.trim()) {
      errors[field] = 'Email is required'
      return false
    } else if (!emailRegex.test(value)) {
      errors[field] = 'Please enter a valid email address'
      return false
    } else if (value.length > 255) {
      errors[field] = 'Email must be less than 255 characters'
      return false
    }
  } else if (field === 'name') {
    if (!value.trim()) {
      errors[field] = 'Name is required'
      return false
    } else if (value.length > 100) {
      errors[field] = 'Name must be less than 100 characters'
      return false
    }
  }
  
  delete errors[field]
  return true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // Validate all fields
  const nameValid = validateField('name', formData.name)
  const emailValid = validateField('email', formData.email)
  
  if (!nameValid || !emailValid) {
    isSubmitting.value = false
    return
  }

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    isSubscribed.value = true

    // Reset form after short delay
    setTimeout(() => {
      formData.email = ''
      formData.name = ''
      formData.notifications = true
      Object.keys(errors).forEach(key => delete errors[key])
      isSubscribed.value = false
      close()
    }, 2000)
  } catch (error) {
    console.error('Subscription failed:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
