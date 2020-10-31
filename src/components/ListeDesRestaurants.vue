<template>
  <div>
    <h2>{{msg}}</h2>
    <md-toolbar class="md-accent">
    <h1>Nombre de restaurants : {{nbRestaurantsTotal}}</h1>
    </md-toolbar>
    <md-toolbar class="md-dense">

      <!-- Ouverture de la boiture de dialogue Ajouter Restaurant -->
      <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>Ajouter un restaurant</md-dialog-title>

        <form @submit.prevent="ajouterRestaurant($event)">
          <label>
            Nom : <input name="nom" type="text" required v-model="nom">
          </label>
          <label>
            Cuisine : <input name="cuisine" type="text" required v-model="cuisine">
          </label>
          <button>Ajouter</button>
        </form>
        <md-dialog-actions>
          <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-snackbar :md-active.sync="affichage">Vous avez réussir à créer un restaurant !</md-snackbar>

      <md-button class="md-primary md-raised centrer" @click="showDialog = true">Ajouter un Restaurant</md-button>



      <!-- Ouverture de la boite de dialogue modifier -->

      <md-dialog :md-active.sync="showDialog3">
        <md-dialog-title>Modifier le restaurant</md-dialog-title>
        <form @submit.prevent="modifierRestaurant($event)">
          <label>
            Nom : <input name="nom" type="text" required v-model="editnom"/>
          </label>
          <label>
            Cuisine : <input name="cuisine" type="text" required v-model="editcuisine"/>
          </label>
          <button>Modifier</button>
        </form>
        <md-dialog-actions>
          <md-button class="md-primary" @click="showDialog3 = false">Close</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-snackbar :md-active.sync="affichage2">Vous avez réussir à modifier un restaurant !</md-snackbar>
      <md-snackbar :md-active.sync="affichage3">Vous avez réussir à supprimer un restaurant !</md-snackbar>

      <!-- Ouverture de la boite de dialogue détails -->


        <md-dialog :md-active.sync="showDialog4">
          <md-dialog-title>Détails du restaurant</md-dialog-title>

          <md-tabs md-dynamic-height>
            <md-tab md-label="General">
              <p>{{editnom}} {{editcuisine}}</p>
              <p>{{Numero}} {{Lieux}}</p>
            </md-tab>

            <md-tab md-label="Adresse">
              <p>{{Adresse}}</p>
              <p>{{LAT}}</p>
              <p>{{LON}}</p>
            </md-tab>
            <md-tab md-label="Map">
              <div style="height: 500px; width: 100%">
              <l-map
                  v-if="showMap"
                  :zoom="zoom"
                  :center="center"
                  :options="mapOptions"
                  style="height: 100%"
                  @update:center="centerUpdate"
                  @update:zoom="zoomUpdate"
              >
                <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                />
              </l-map>
              </div>
            </md-tab>
          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog4 = false">Close</md-button>
          </md-dialog-actions>
        </md-dialog>


    </md-toolbar>

    <p>Chercher par nom : <input
        @input="chercherRestaurants()"
        type="text"
        v-model="nomRestauRecherche"> Nombre de pages total : {{nbPagesTotal}}</p>
    <p>Nombre restaurants par page :
      <input
          @input="getRestaurantsFromServer()"
          type="range" min=2 max=1000 v-model="pagesize"
      >{{pagesize}}</p>
    <md-button class="md-raised" :disabled="page===0" @click="pagePrecedente()">Précédent</md-button>
    <strong>Page courante : {{page+1}}</strong>
    <md-button class="md-raised" :disabled="page===nbPagesTotal" @click="pageSuivante()">Suivant</md-button>
    <md-table>
      <md-table-row>
        <md-table-head><Strong><i>Nom</i></Strong></md-table-head>
        <md-table-head><Strong><i>Cuisine</i></Strong></md-table-head>
        <md-table-head><Strong><i>Modifier</i></Strong></md-table-head>
        <md-table-head><Strong><i>Supprimer</i></Strong></md-table-head>
        <md-table-head><Strong><i>Détails</i></Strong></md-table-head>
      </md-table-row>
      <md-table-row     v-for="(r,index) in restaurants"
                        :key="index"
                        :style="{backgroundColor:getColor(index)}"
                        :class="{bordureRouge:(index === 2)}">

        <md-table-cell>{{r.name}}</md-table-cell>
        <md-table-cell>{{r.cuisine}}</md-table-cell>
        <md-table-cell>
          <md-button class="md-primary md-raised " @click="AfficherModifier(r)">Modifier</md-button>
        </md-table-cell>
        <md-table-cell>
          <md-button class="md-primary md-raised " @click="supprimerRestaurant(r)">Supprimer</md-button>
        </md-table-cell>
        <md-table-cell>
        <md-button class="md-fab md-primary" @click="AfficherCarte(r)">
          <md-icon>add</md-icon>
        </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-empty-state
        md-icon="devices_other"
        md-label="Ajouter un restaurant"
        md-description="Aucun restaurant portant ce nom a été trouvé. Veuillez en créer un !">
      <md-button class="md-primary md-raised" @click="showDialog = true">Ajouter un Restaurant</md-button>
    </md-empty-state>
  </div>
</template>

<script>
import _ from "lodash";
import {latLng} from "leaflet";
export default {
  name: 'ListeDesRestaurants',
  data: function(){
    return {
      restaurants: [],
      nom: "",
      cuisine: "",
      editnom: "",
      editcuisine: "",
      nbRestaurantsTotal: 0,
      page: 0,
      pagesize: 10,
      nbPagesTotal: 0,
      msg: "",
      nomRestauRecherche: "",
      affichage:false,
      affichage2: false,
      affichage3 : false,
      showDialog: false,
      showDialog2: false,
      showDialog3: false,
      showDialog4: false,
      LID: null,
      Adresse: null,
      LAT: null,
      LON: null,
      Lieux: "",
      Numero: 0,
      zoom: 13,
      center: latLng(47.41322, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
    }
  },
  mounted() {
    console.log("AVANT AFFICHAGE");
    this.getRestaurantsFromServer();
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    pagePrecedente() {
      if (this.page === 0) return;

      this.page--;
      this.getRestaurantsFromServer();
    },
    pageSuivante() {
      if (this.page === this.dernierePage) return;
      this.page++;
      this.getRestaurantsFromServer();
    },
    getRestaurantsFromServer() {
      let url = "http://localhost:8080/api/restaurants?";
      url += "page=" + this.page;
      url += "&pagesize=" + this.pagesize;
      url += "&name=" + this.nomRestauRecherche;


      fetch(url)
          .then((responseJSON) => {
            // arrow functions, conserve le bon "this"
            // la réponse est en JSON, on la convertit avec la ligne suivante
            responseJSON.json().then((resJS) => {
              // Maintenant resJS est un vrai objet JavaScript
              this.restaurants = resJS.data;
              this.nbRestaurantsTotal = resJS.count;
              this.nbPagesTotal = Math.round(
                  this.nbRestaurantsTotal / this.pagesize
              );
            });
          })
          .catch(function (err) {
            console.log(err);
          });
    },
    chercherRestaurants: _.debounce(function () {
      // appelée que si on n'a pas tapé de touches pendant un certain délai
      this.getRestaurantsFromServer();

    }, 300),
    supprimerRestaurant(r) {
      let url = "http://localhost:8080/api/restaurants/" + r._id;

      fetch(url, {
        method: "DELETE",
      })
          .then((responseJSON) => {
            responseJSON.json().then((resJS) => {
              // Maintenant res est un vrai objet JavaScript
              console.log(resJS.msg);
              this.msg = resJS.msg;
              // On rafraichit la vue
              this.getRestaurantsFromServer();
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      window.setTimeout(() => {
        this.affichage3 = true
      }, 1500)

      this.affichage3 = false;
      this.showDialog = false;

    },
    AfficherModifier(event) {
      this.showDialog3 = true;
      console.log(event);
      this.editnom = event.name;
      this.editcuisine = event.cuisine;
      this.LID = event._id;
    },
    AfficherCarte(event) {
      this.showDialog4 = true;
      this.editnom = event.name;
      this.editcuisine = event.cuisine;
      this.LID = event._id;
      this.Adresse = event.address;
      this.LAT = this.Adresse.coord[0];
      this.LON = this.Adresse.coord[1];
      this.Numero = this.Adresse.building;
      this.Lieux = this.Adresse.street;

    },
    modifierRestaurant(event) {

      let form = event.target;

      let donneesFormulaire = new FormData(form);

      let url = "http://localhost:8080/api/restaurants/"+ this.LID;

      fetch(url, {
        method: "PUT",
        body: donneesFormulaire,
      })
          .then((responseJSON) => {
            responseJSON.json().then((resJS) => {
              // Maintenant res est un vrai objet JavaScript
              console.log(resJS.msg);
              this.msg = resJS.msg;
              // On rafraichit la vue
              this.getRestaurantsFromServer();
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      window.setTimeout(() => {
        this.affichage2 = true
      }, 1500)

      this.affichage2 = false;
      this.editnom = "";
      this.editcuisine = "";
      this.showDialog3 = false;
    },
    ajouterRestaurant(event) {
      // Récupération du formulaire. Pas besoin de document.querySelector
      // ou document.getElementById puisque c'est le formulaire qui a généré
      // l'événement
      let form = event.target;

      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData(form);

      let url = "http://localhost:8080/api/restaurants";

      fetch(url, {
        method: "POST",
        body: donneesFormulaire,
      })
          .then((responseJSON) => {
            responseJSON.json().then((resJS) => {
              // Maintenant res est un vrai objet JavaScript
              console.log(resJS.msg);
              this.msg = resJS.msg;
              // On rafraichit la vue
              this.getRestaurantsFromServer();
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      window.setTimeout(() => {
        this.affichage = true
      }, 1500)

      this.nom = "";
      this.cuisine = "";
      this.affichage = false;
    },
    getColor(index) {
      return index % 2 ? "lightBlue" : "pink";
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Material+Icons");
i{
  color: black;
  font-size: 20px;
}
th{
  background-color: dimgrey;
  border: medium solid black;
}
td{
  border: medium solid black;
}
button{
  margin-left: 10px;
  margin-bottom: 5px;
}
div{
  margin-bottom: 10px;
}
h1{
  color: black;
  margin-left: 35%;
  margin-right: 35%;
}
.centrer{
  left: 43%;
}
.md-dialog /deep/.md-dialog-container {
  max-width: 768px;
  max-height: 750px;
}
</style>
