<template>
  <div>
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Are you sure you want to delete this gateway?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-2" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteItemConfirm">Accept</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<<script>
export default {
  name: 'DeleteItem',
  props: {
    value: Boolean,
    editedItem:{
      type:Object
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods:{
    deleteItemConfirm () {
        this.$emit("deleteItemConfirm", this.editedItem);
        this.closeDelete()
      },

      closeDelete () {
        this.$emit("closeDelete");
      },
  },
}
</script>