<template>
  <div class="profile-container">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card profile-card text-center">
          <div class="card-body">
            <div class="d-flex justify-content-center">
              <img
                src="https://ui-avatars.com/api/?name=Luke+Skywalker&background=random"
                alt="Avatar"
                class="profile-avatar"
              />
            </div>
            <h3 class="mt-3">Luke Skywalger</h3>
            <div class="mt-3">
              <div class="info-item">luke.skywalker@jedi.com</div>
            </div>
            <div class="mt-4">
              <div class="d-grid gap-2">
                <button class="btn btn-primary btn-pill">Update Profile</button>
                <button class="btn btn-warning btn-pill">Change Password</button>
                <button class="btn btn-danger btn-pill">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GradientBackground />
</template>
<script>
import GradientBackground from '@/components/GradientBackground.vue'

export default {
  name: 'ProfilePage',
  components: {
    GradientBackground,
  },
}
</script>
<style>
.profile-container {
  z-index: 100;
  width: 100vw !important;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.profile-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
  background: #fff;
}
.info-item:last-child {
  border-bottom: none;
}
.btn-pill {
  border-radius: 30px !important;
  width: 100%;
}
</style>
