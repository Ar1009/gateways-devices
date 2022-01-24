<template>
  <div class="ma-16">
    <div class="d-flex justify-end">
      <v-btn class="mr-5" color="success" large @click.stop="showGateway(gateways)">
        <v-icon left>mdi-eye-circle</v-icon>Gateway
      </v-btn>
      <v-btn color="success" large @click.stop="dialog=true">
        <v-icon left>mdi-plus</v-icon>Gateway
      </v-btn>
    </div>
    <v-row>
      <div class="col-md-12 col-sm-12 col-xs-4 justify-center mt-6">
        <v-data-table :headers="headers" :items="gateways" class="elevation-1">
          <template v-slot:top>
            <div data-app>
              <AddGateway
                :editedIndex="editedIndex"
                :editedItem="editedItem"
                :gateway="gateway"
                :gateways="gateways"
                v-on:save="save"
                v-on:close="close"
                v-model="dialog"
              />
            </div>

            <div data-app>
              <DeleteItem
                :editedItem="editedItem"
                v-on:deleteItemConfirm="deleteItemConfirm"
                v-on:closeDelete="closeDelete"
                v-model="dialogDelete"
              />
            </div>

            <div data-app>
              <ShowGateway
                :gatewaysToShow="gatewaysToShow"
                v-on:closeShow="closeShow"
                v-model="dialogShowGateway"
              />
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue" @click.stop="showGateway(item)">mdi-eye-circle</v-icon>
            <v-icon class="ma-1" color="success" @click.stop="editItem(item)">mdi-pencil-circle</v-icon>
            <v-icon class="ma-1" color="red" @click.stop="deleteItem(item)">mdi-delete-circle</v-icon>
          </template>
        </v-data-table>
      </div>
    </v-row>
  </div>
</template>
<script>
import AddGateway from "@/components/AddGateway";
import DeleteItem from "@/components/DeleteItem";
import ShowGateway from "@/components/ShowGateway";
export default {
  name: "Gateway",
  data: () => ({
    dialog: false,
    dialogD: false,
    dialogDelete: false,
    dialogShowGateway: false,
    headers: [
      { text: "Serie", value: "num_serie" },
      { text: "Nombre", value: "nombre_gateway" },
      { text: "Dirección IPv4", value: "ipv4" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    gateways: [],
    gatewaysToShow: [],
    editedIndex: -1,
    editedItem: {
      num_serie: "",
      nombre_gateway: 0,
      ipv4: 0,
      devices: []
    },
    gateway: {
      num_serie: "",
      nombre_gateway: 0,
      ipv4: 0,
      devices: []
    }
  }),

  components: {
    AddGateway,
    DeleteItem,
    ShowGateway
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.listarGateway();
  },

  methods: {
    listarGateway() {
      this.axios
        .get("/gateway")
        .then(response => {
          this.gateways = response.data;
        })
        .catch(e => {
          console.log("Gateway-Device app can't connect with Database");
        });
    },
    editItem(item) {
      this.editedIndex = this.gateways.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    showGateway(item) {
      if (item.length > -1) {
        this.gatewaysToShow = item;
        this.dialogShowGateway = true;
        return true;
      }
      this.gatewaysToShow.push(item);
      this.dialogShowGateway = true;
    },

    deleteItem(item) {
      this.editedIndex = this.gateways.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm(itemDelete) {
      this.gateways.splice(this.editedIndex, 1);
      this.editedItem = Object.assign({}, this.gateway);
      this.axios.delete("/gateway/" + itemDelete._id)
      .then(res => {
            this.closeDelete();
          })
          .catch(e => {});
      
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.gateway);
        this.editedItem.devices = [];
        this.editedIndex = -1;
      });
      this.editedItem = {
        num_serie: "",
        nombre_gateway: 0,
        ipv4: 0,
        devices: []
      };
    },

    closeShow() {
      this.dialogShowGateway = false;
      this.gatewaysToShow = [];
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.gateway);
        this.editedItem.devices = [];
      });
      this.editedItem = {
        num_serie: "",
        nombre_gateway: 0,
        ipv4: 0,
        devices: []
      };
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.gateway);
        this.editedIndex = -1;
      });
      this.editedItem = {
        num_serie: "",
        nombre_gateway: 0,
        ipv4: 0,
        devices: []
      };
    },

    save(gw, ei) {
      if(ei>-1){
        this.gateways.splice(ei,1,gw)
      }else{
        this.gateways.push(gw);
            this.editedItem = {
              num_serie: "",
              nombre_gateway: 0,
              ipv4: 0,
              devices: []
            };
            this.gateway = {
              num_serie: "",
              nombre_gateway: 0,
              ipv4: 0,
              devices: []
            };
      }
       
      this.close();
    }
  }
};
</script>
