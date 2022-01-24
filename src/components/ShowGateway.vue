<template>
  <div>
    <v-dialog v-model="show" max-width="1000px">
      <template v-if="gatewaysToShow.length===0">
          <v-card >
            <v-card-title>
              <span class="text-h5">No gateways to show</span>
            </v-card-title>
            <v-card-actions class="justify-center">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-2" text @click.stop="close">Close</v-btn>
        </v-card-actions>
          </v-card>
        </template>
        <template v-else>
      <v-card class="pa-2" >
        <div v-for="(editedItem, index) in gatewaysToShow" :key="index">
          <v-card class="ma-5">
            <v-card-title>
              <span class="text-h4">Gateway {{editedItem.nombre_gateway}} information</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.num_serie" label="No. Serie" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nombre_gateway" label="Gateway name" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.ipv4" label="IPv4 address" readonly></v-text-field>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <div class="device" v-for="(device, index) in editedItem.devices" :key="index">
                  <v-card outlined class="mt-5">
                    <v-card-title>
                      <span class="text-h5">Device {{index+1}} information</span>
                    </v-card-title>

                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-text-field v-model="device.uid" label="UID" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field v-model="device.vendor" label="Vendor" readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-text-field v-model="device.created" label="Date Created" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-radio-group class="float-rigth" v-model="device.status" row readonly>
                          <template v-slot:label>
                            <div>
                              <strong>Status</strong>
                            </div>
                          </template>
                          <v-radio label="Enabled" :value="true"></v-radio>
                          <v-radio label="Disable" :value="false"></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </div>        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-2" text @click.stop="close">Close</v-btn>
        </v-card-actions>
      </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "ShowGateway",
  props: {
    value: Boolean,
    gatewaysToShow: []
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
  methods: {
    close() {
      this.$emit("closeShow");
    }
  }
};
</script>