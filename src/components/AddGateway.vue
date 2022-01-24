<template>
  <div>
    <v-dialog v-model="show" max-width="700px">
      <v-form id="gatewayForm" @submit.prevent="checkForm" method="post" novalidate="true">
        <v-card>
          <v-card-title>
            <span class="text-h4">Gateway information</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <div>
                  <v-alert v-if="errors" dense outlined type="error">
                    <ul>
                      <li v-for="(error,index) in errors" :key="index">{{ error }}</li>
                    </ul>
                  </v-alert>
                </div>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.num_serie" label="No. Serie" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.nombre_gateway" label="Gateway name"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.ipv4"
                    label="IPv4 address"
                    hint="Example: 10.100.15.26"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <div class="row d-flex justify-start mt-5 mb-5">
                  <v-col cols="12" sm="6" md="4">
                    <v-btn
                      class="ml-3 add-device"
                      color="light-blue darken-2"
                      :disabled="disabled"
                      text
                      large
                      @click.stop="addDevice()"
                    >
                      <v-icon left>mdi-plus</v-icon>Device
                    </v-btn>
                  </v-col>
                </div>
              </v-row>
              <v-divider></v-divider>
              <div class="device" v-for="(device, index) in editedItem.devices" :key="index">
                <v-card class="mt-5">
                  <v-btn
                    class="float-right"
                    color="red darken-1"
                    icon
                    dark
                    @click="deleteDevice(index)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-card-title>
                    <span class="text-h5">Device {{index+1}} information</span>
                  </v-card-title>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field v-model="device.uid" type="number" min="1" label="UID" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field v-model="device.vendor" label="Vendor"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-radio-group class="float-rigth" v-model="device.status" row>
                        <template v-slot:label>
                          <div>
                            <strong>Status</strong>
                          </div>
                        </template>
                        <v-radio label="Online" :value="true"></v-radio>
                        <v-radio label="Offline" :value="false"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions class="mr-3">
            <v-spacer></v-spacer>
            <v-btn color="light-blue darken-2" text type="submit">Guardar</v-btn>
            <v-btn color="red darken-1" text @click.stop="close">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "AddGateway",
  data: () => ({
    errors: null,
    mostrar: false,
    count: 0,
    disabled: false,
    deviceExist: [],
    gatewayExist: false,
    expression: /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/,
    defaultGateway: {
      num_serie: "",
      nombre_gateway: "",
      ipv4: "",
      devices: []
    }
  }),
  props: {
    value: Boolean,
    editedItem: {
      type: Object
    },
    gateway: {
      type: Object
    },
    gateways: {
      type: Array
    },
    editedIndex: Number,
    keydown: null,
    onblur: null
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
    checkForm(e) {
      if (this.editedIndex > -1) {
        Object.assign(this.gateways[this.editedIndex], this.gateway);
        this.axios
          .put("/edit-gateway", this.editedItem)
          .then(res => {
            this.errors = res.data.mssg;
            if (!this.errors) {
              this.$emit("save", res.data, this.editedIndex);
              return true;
            }
            e.preventDefault();
          })
          .catch(e => {});
      } else {
        this.axios
          .post("/new-gateway", this.editedItem)
          .then(res => {
            this.errors = res.data.mssg;
            if (!this.errors) {
              this.$emit("save", res.data);
              return true;
            }
            e.preventDefault();
          })
          .catch(e => {});
      }
    },
    gatewayExistM(num_serie) {
      this.axios
        .get("/gateway_exist/" + num_serie)
        .then(response => {
          if (response.data != null) {
            return true;
          } else {
            return response.data;
          }
        })
        .catch(e => {});
    },
    close() {
      this.disabled = false;
      this.errors = null;
      this.$emit("close");
    },
    addDevice() {
      if (this.editedItem.devices.length < 10) {
        this.editedItem.devices.push({
          uid: 0,
          vendor: "",
          status: true
        });
      }
      if (this.editedItem.devices.length === 10 && this.errors) {
        this.errors.push("Only can asign ten devices by gateway");
        this.disabled = true;
      } else if (this.editedItem.devices.length === 10 && !this.errors) {
        this.errors = [];
        this.errors.push("Only can asign ten devices by gateway");
        this.disabled = true;
      }
    },
    deleteDevice(index) {
      if (this.editedItem.devices[index]._id) {
        this.axios.delete("/device/" + this.editedItem.devices[index]._id);
        this.axios
          .put(
            "/gateway_delete_device/" +
              this.editedItem._id +
              "/" +
              this.editedItem.devices[index]._id
          )
          .then(res => {});
      }

      this.editedItem.devices.splice(index, 1);
      if (this.editedItem.devices.length < 10 && this.errors != null) {
        this.disabled = false;
        let found = this.errors.findIndex(
          element => element === "Only can asign ten devices by gateway"
        );
        if (found > -1) {
          this.errors.splice(found, 1);
        }
      }
    }
  }
};
</script>
