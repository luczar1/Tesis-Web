Vue.component('list-courses', {
  props: ['cursos', 'titulo'],
  data: () => {
    return {
      page: 1,
      cantPerPage: 10,
    }
  },
  methods: {
      getCursosPage(pg){
          let cursosRet = [];
          const start = (pg - 1) * this.cantPerPage;
          const end = pg* this.cantPerPage;

        for (let i=start; i<end; i++) {
          cursosRet.push(this.cursos[i]);
        }

        return cursosRet;
      },
    listPages(){
      let list = [];
      for (let i = 1; i <= this.cursos.length / this.cantPerPage; i++) {
        list.push(i);
      }

      return list;
    },
    currentPage(pg) {
        if (pg === this.page) {
          return true
        }
        return false;
    },
    nextPage() {
        if (this.listPages().length>this.page) {
          this.page++;
        }
    },
    prevPage(){
        if (this.page>1) {
          this.page--;
        }
    }
  },
  template: `<div class="card strpied-tabled-with-hover">
                                <div class="card-header ">
                                    <h4 class="card-title">{{titulo}}</h4>
                                    <!--<p class="card-category">Here is a subtitle for this table</p>-->
                                </div>
                                <div class="card-body table-full-width table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                              <th>Código</th>
                                              <th>Nombre</th>
                                              <th>Unidad Académica</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="curso in getCursosPage(page)">
                                                <td><button class="btn vtn-default"> {{curso.codigo}} </button></td>
                                                <td>{{curso.nombre}}</td>
                                                <td>{{curso.nombreUA}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="card-footer">
                                  <div class="form-inline float-right">
                                      <input class="form-control" type="number" v-model="cantPerPage">
                                    <div class="btn-group">
                                      <button class="btn btn-default" @click="prevPage"><i class="fas fa-arrow-left"></i></button>
                                      <button v-for="pg in listPages()" class="btn" :class="{ 'btn-primary': pg === page, 'btn-default': pg != page}"  @click="page = pg">{{pg}}</button>
                                      <button class="btn btn-default" @click="nextPage"><i class="fas fa-arrow-right"></i></button>
                                    </div>
                                  </div>
                                </div>
                            </div>`,
});



var app = new Vue({
  el: '#app',
  data: {
    navbar:[
    ],
    cursos:[

    ],
  },
  methods: {
    loadNavBar() {
      this.$http.get('/api/navBar')
        .then((response) => {

          let navBarItems = response.body;

          for (let key in navBarItems) {
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
    loadCourses(){
      this.$http.get('/curso')
        .then((response) => {

          let cursos = response.body;

          for (let key in cursos) {
            this.cursos.push(cursos[key]);

          }
        }, err => {
          console.log(err);
        });
    },
  },
  beforeMount(){
    this.loadNavBar();
    this.loadCourses();
  },
});