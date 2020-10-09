<template>
  <div>
    <md-toolbar class="md-accent">
    <h1>Nombre de restaurants : {{nbRestaurantsTotal}}</h1>
    </md-toolbar>
    <md-toolbar class="md-medium">
      <div class="md-toolbar-row">
        <h2>{{msg}}</h2>
        <form @submit.prevent="ajouterRestaurant(event)">
          <label>
            Nom : <input name="nom" type="text" required v-model="nom">
          </label>
          <label>
            Cuisine : <input name="cuisine" type="text" required v-model="cuisine">
          </label>
          <button>Ajouter</button>
        </form>
      </div>
    </md-toolbar>
    <p>Chercher par nom : <input
        @input="chercherRestaurants()"
        type="text"
        v-model="nomRestauRecherche"
    ></p>
    <p>Nb de pages total : {{nbPagesTotal}}</p>
    <p>Nb restaurants par page :
      <input
          @input="getRestaurantsFromServer()"
          type="range" min=2 max=1000 v-model="pagesize"
      >{{pagesize}}</p>
    <button :disabled="page===0" @click="pagePrecedente()">Précédent</button>
    <button :disabled="page===nbPagesTotal" @click="pageSuivante()">Suivant</button>
    Page courante : {{page}}
    <md-table>
      <md-table-row>
        <md-table-head>Nom</md-table-head>
        <md-table-head>Cuisine</md-table-head>
      </md-table-row>
      <md-table-row     v-for="(r,index) in restaurants"
                        :key="index"
                        @click="supprimerRestaurant(r)"
                        :style="{backgroundColor:getColor(index)}"
                        :class="{bordureRouge:(index === 2)}">

        <md-table-cell>{{r.name}}</md-table-cell>
        <md-table-cell>{{r.cuisine}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: 'ListeDesRestaurants',
  data: function(){
    return {
      restaurants: [],
      nom: "",
      cuisine: "",
      nbRestaurantsTotal: 0,
      page: 0,
      pagesize: 10,
      nbPagesTotal: 0,
      msg: "",
      nomRestauRecherche: "",
    }
  },
  mounted() {
    console.log("AVANT AFFICHAGE");
    this.getRestaurantsFromServer();
  },
  methods: {
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

      this.nom = "";
      this.cuisine = "";
    },
    getColor(index) {
      return index % 2 ? "lightBlue" : "pink";
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div{
  margin-bottom: 10px;
}
h1{
  margin-left: 35%;
  margin-right: 35%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>