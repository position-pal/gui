<template>
  <div class="route-dialog-overlay" @click="$emit('close')">
    <div class="route-dialog" @click.stop>
      <h3>Start a monitored journey</h3>
      <p class="route-description">
        Share your destination and arrival time to get monitored by other group members.
      </p>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="destination">Destination</label>
          <input
            type="text"
            id="destination"
            v-model="formData.destination"
            placeholder="Where are you going?"
            required
          >
        </div>
        <div class="form-group">
          <label for="arrivalTime">Expected Arrival Time</label>
          <input
            type="datetime-local"
            id="arrivalTime"
            v-model="formData.arrivalTime"
            required
          >
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-primary">Start Routing</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RouteFormDialog',
  data() {
    return {
      formData: {
        destination: '',
        arrivalTime: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { ...this.formData })
      this.formData.destination = ''
      this.formData.arrivalTime = ''
    }
  }
}
</script>

<style scoped>
.route-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.route-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.route-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: #1AAB8A;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-primary:hover {
  background: #168f73;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
