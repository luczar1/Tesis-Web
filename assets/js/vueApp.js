var app = new Vue({
  el: '#app',
  data: {
    navbar:[
    ],
  },
  methods: {
    loadNavBar() {
      this.$http.get('/api/navBar')
        .then((response) => {

          let navBarItems = response.body;

          for (key in navBarItems) {
            this.navbar.push(navBarItems[key]);

          }
        }, err => {
          console.log(err);
        });
    },
    checkLocation(link) {
      if (link == window.location.pathname) {
        return true;
      }
      return false;
    },
  },
  beforeMount(){
    this.loadNavBar();
  },
});
