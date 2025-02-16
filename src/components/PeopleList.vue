<template>
  <div class="people-list">
    <h2>People</h2>
    <PersonItem v-for="person in people" :key="person.id" :person="person" />
  </div>
</template>

<script>
import PersonItem from './PersonItem.vue'

export default {
  components: { PersonItem },
  data() {
    return {
      people: [
        {
          id: 1,
          name: 'Elton Lin',
          location: 'San Francisco, CA',
          time: '6m ago',
          distance: '40 mi',
        },
        {
          id: 2,
          name: 'Christine Huang',
          location: 'Cupertino, CA',
          time: 'Now',
          distance: '0 mi',
        },
        {
          id: 3,
          name: 'Orkun Kucuksevim',
          location: 'San Francisco, CA',
          time: '25m ago',
          distance: '40 mi',
        },
        {
          id: 4,
          name: 'Alex Johnson',
          location: 'New York, NY',
          time: '10m ago',
          distance: '500 mi',
        },
        {
          id: 5,
          name: 'Maria Lopez',
          location: 'Los Angeles, CA',
          time: '15m ago',
          distance: '350 mi',
        },
      ],
    }
  },
}
</script>

<style scoped>
.people-list {
  max-height: 100%;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: white;
  padding: 10px;
}
</style>
