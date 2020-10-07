window.onload=init;

function init() {
    Vue.use(VueMaterial.default);
    new Vue({
        el: "#app",
        data: {
            restaurants: [],
            nbRestaurants:0,
            nom: '',
            cuisine: '',
            apiBaseURL:"http://localhost:8080/api/restaurants",
            page:0,
            pagesize:10,
            nomRecherche:""
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getDataFromServer();
        },
        methods: {
            // async obligatoire si utilisation de await, pas la peine sinon
            async getDataFromServer() {
                // On va chercher les données sur le serveur
                /*
                fetch(this.apiBaseURL)
                .then(responseEnJson => {
                    console.log("J'ai eu une réponse JSON du serveur ");
                    return responseEnJson.json();
                }).then(reponseJS => {
                    //console.log(reponseJS.data[0].name);
                    // on initialise le modele des restaurants
                    // avec les data reçues
                    this.restaurants = reponseJS.data;
                }).catch(err => {
                    console.log(err.msg);
                });
                */

                // Avec await
                let url = this.apiBaseURL 
                + "?page=" + this.page
                + "&pagesize=" + this.pagesize
                + "&name=" + this.nomRecherche;

                try {
                    let reponseJSON = await fetch(url);
                    let reponseJS = await reponseJSON.json();
                    this.restaurants = reponseJS.data;
                    this.nbRestaurants = reponseJS.count;
                } catch(err) {
                    console.log("Erreur dans les fetchs GET " + err.msg);
                }  
            },
            async supprimerRestaurant(id) {
                try {
                    let reponseJSON = await fetch(this.apiBaseURL + "/" + id, {
                        method:"DELETE"
                    });
                    let reponseJS = await reponseJSON.json();
                    console.log("Restaurant supprime : " + reponseJS.msg);
                    this.getDataFromServer(); // on rafraichit l'affichage
                } catch(err) {
                    console.log("Erreur dans le fetchs DELETE " + err.msg);
                }
            },
            async ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                let donneesFormulaire = new FormData();
                donneesFormulaire.append("nom", this.nom);
                donneesFormulaire.append("cuisine", this.cuisine);

                let reponseJSON = await fetch(this.apiBaseURL, {
                    method:"POST",
                    body:donneesFormulaire
                })
                let reponseJS = await reponseJSON.json();
                console.log(reponseJS.msg);

                this.nom = "";
                this.cuisine = "";

                this.getDataFromServer(); // on rafraichit
            },
            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'pink';
            },
            pageSuivante() {
                console.log("page suivante");
                this.page++;
                this.getDataFromServer();
            },
            pagePrecedente() {
                console.log("page precedente");
                this.page--;
                this.getDataFromServer();
            }
        }
    })
}
