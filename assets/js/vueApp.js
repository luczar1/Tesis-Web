Vue.component('box-curso', {
  props: ['curso'],
  data: () => {
    return {
      section: 'general',
    }
  },
  methods: {
    close() {
      this.$emit('closeCurso', true);
    },
    getImgPath() {
      return "https://www.ucc.edu.ar/portalucc/archivos/File/fjs/fotos/" + this.curso.img;
    },
    changeSection(newSection) {
      this.section = newSection;
    },
    toggleNotifAppDocentes(){
      for (let docente of this.curso.docentes) {
        docente.sendNotifApp = !docente.sendNotifApp;
      }
    },
    toggleNotifEmailDocentes(){
      for (let docente of this.curso.docentes) {
        docente.sendNotifEmail = !docente.sendNotifEmail;
      }
    },
  },
  template: `
      <div class="card" v-if="curso != null">
        <div class="card-header">
        <div class="row">
          <div class="col-sm-10"><h4 class="card-title">{{curso.nombre}}</h4></div>
          <div class="col-sm-2 text-right"><button type="button" class="btn btn-outline-dark" style="cursor: pointer" @click="close()"><i class="fas fa-times-circle fa-2x"></i></button></div>
        </div>
          
      </div>
      <div class="card-body">
      <div class="row">
        <div class="col-sm-12">
          <nav class="nav nav-pills">
            <a class="nav-link" :class="{'active': section == 'general'}" href="#" @click="changeSection('general')">General</a>
            <a class="nav-link" :class="{'active': section == 'profesores'}" href="#" @click="changeSection('profesores')">Profesores ({{this.curso.docentes.length}})</a>
            <a class="nav-link" :class="{'active': section == 'alumnos'}" href="#" @click="changeSection('alumnos')">Alumnos ({{this.curso.alumnos.length}})</a>
          </nav>
        </div>
       </div>
       <div class="row">
       
        <div class="col-sm-12" v-if="section == 'general'">
          <div class="row pt-3">
            <div class="col-sm-4">
              <img :src="getImgPath()" style="width: 100%;">
            </div>
            <div class="col-sm-8">
              <div><b>Descripcion:</b> {{curso.descripcion}}</div>
              <div><b>Inicio:</b> {{curso.inicio}}</div>
              <div><b>Fin:</b> {{curso.fin}}</div>
              <div><b>Estado:</b> {{curso.estado}}</div>
            </div>
          </div>
        </div>
        <div class="col-sm-12" v-if="section == 'profesores'">
          <div class="row pt-3">
            <div class="col-sm-12">
              <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Clave UCC</th>
                      <th scope="col">Apellido</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">E-Mail</th>
                      <th scope="col"><i class="fas fa-at"></i></th>
                      <th scope="col"><i class="fas fa-bell"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="docente in curso.docentes">
                      <td>{{docente.clave}}</td>
                      <td>{{docente.apellido}}</td>
                      <td>{{docente.nombre}}</td>
                      <td>{{docente.email}}</td>
                      <td style="padding-left: 30px"><input class="form-check-input position-static" type="checkbox" v-model="docente.sendNotifEmail"></td>
                      <td style="padding-left: 30px"><input class="form-check-input position-static" type="checkbox" v-model="docente.sendNotifApp"></td>
                    </tr>
                  </tbody>
                  <tfoot>
                  <tr>
                      <th scope="col" colspan="4">Marcar/Desmarcar todos</th>
                      <th scope="col"><i class="fas fa-at" style="cursor: pointer" @click="toggleNotifEmailDocentes()"></i></th>
                      <th scope="col"><i class="fas fa-bell" style="cursor: pointer" @click="toggleNotifAppDocentes()"></i></th>
                    </tr>
                  </tfoot>
                </table>
                <div class="row">
                  <div class="col-sm-12">
                    <button type="button" class="btn btn-outline-success"><i class="fas fa-bell"></i> Enviar notificaciones</button>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12" v-if="section == 'alumnos'">
        
        </div>
        </div>
      </div>
    </div>`
});

Vue.component('list-logs', {
  props: ['titulo'],
  data: () => {
    return {
      page: 1,
      cantPerPage: 10,
      search: "",
      logs: [],
    }
  },
  methods: {
    loadLogs() {
      this.$http.get('/logs')
        .then((response) => {

          let logs = response.body;

          for (let key in logs) {
            this.logs.push(logs[key]);
          }
          this.logs = this.logs.sort(function (a, b) {
            return b.createdAt - a.createdAt
          });
        }, err => {
          console.log(err);
        });
    },
    displayDate(timestamp) {
      let fecha = new Date(timestamp);

      let date = fecha.getDate();
      let month = fecha.getMonth() + 1;
      let year = fecha.getFullYear();

      let hours = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours();
      let minutes = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes();
      let seconds = fecha.getSeconds() < 10 ? '0' + fecha.getSeconds() : fecha.getSeconds();

      return fecha.getDate() + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ":" + seconds;
    },
  },
  beforeMount() {
    this.loadLogs();
  },
  template: `<div><div class="card strpied-tabled-with-hover">
                                <div class="card-header ">
                                  <div class="row">
                                    <div class="col-sm-6">
                                      <h4 class="card-title">{{titulo}}</h4>
                                    </div>
                                    <div class="col-sm-6">
                                      <!--<p class="card-category">Here is a subtitle for this table</p>-->
                                      <div class="form-inline float-right" v-if="logs.length > 0">
                                        <div class="input-group mb-2 mr-sm-2">
                                          <div class="input-group-prepend">
                                            <div class="input-group-text"><i class="fas fa-search"></i></div>
                                          </div>
                                          <input type="text" class="form-control" v-model="search" placeholder="Buscar...">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="card-body table-full-width table-responsive" v-if="logs.length == 0" style="text-align: center"><i class="fas fa-spinner fa-spin fa-3x"></i></div>
                                <div class="card-body table-full-width table-responsive" v-if="logs.length > 0">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                              <th>Tipo de error</th>
                                              <th>Descripción</th>
                                              <th>Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="log in logs">
                                                <td>{{log.pagina}}</td>
                                                <td>{{log.error}}</td>
                                                <td>{{displayDate(log.createdAt)}}</td>                                                     
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>`,

});


Vue.component('list-courses', {
  props: ['titulo'],
  data: () => {
    return {
      page: 1,
      cantPerPage: 10,
      search: "",
      cursos: [],
      cursoMostrar: null,
    }
  },
  methods: {
    getCursosPage(pg) {
      let cursosRet = [];

      for (let i = 0; i < this.cursos.length; i++) {
        if (this.search == "") {
          cursosRet.push(this.cursos[i]);
        } else {
          if (this.cursos[i].codigo.toString().includes(this.search) ||
            this.cursos[i].nombre.toUpperCase().includes(this.search.toUpperCase()) ||
            this.cursos[i].nombreUA.toUpperCase().includes(this.search.toUpperCase())) {
            cursosRet.push(this.cursos[i]);
          }
        }
      }

      return cursosRet;
    },
    listPages() {
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
    loadCourses() {
      this.$http.get('/curso')
        .then((response) => {

          let cursos = response.body;

          for (let key in cursos) {

            for (let alumno of cursos[key].alumnos) {
              alumno.sendNotifEmail = false;
              alumno.sendNotifApp = false;
            }
            for (let docente of cursos[key].docentes) {
              docente.sendNotifEmail = false;
              docente.sendNotifApp = false;
            }

            this.cursos.push(cursos[key]);
          }



        }, err => {
          console.log(err);
        });
    },
    nextPage() {
      if (this.listPages().length > this.page) {
        this.page++;
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    verCurso(curso) {
      this.cursoMostrar = curso;
    },
    closeCurso() {
      this.cursoMostrar = null;
    }
  },
  beforeMount() {
    this.loadCourses();
  },
  template: `<div><div class="card strpied-tabled-with-hover" v-if="cursoMostrar == null">
                                <div class="card-header ">
                                  <div class="row">
                                    <div class="col-sm-6">
                                      <h4 class="card-title">{{titulo}}</h4>
                                    </div>
                                    <div class="col-sm-6">
                                      <!--<p class="card-category">Here is a subtitle for this table</p>-->
                                      <div class="form-inline float-right" v-if="cursos.length > 0">
                                        <div class="input-group mb-2 mr-sm-2">
                                          <div class="input-group-prepend">
                                            <div class="input-group-text"><i class="fas fa-search"></i></div>
                                          </div>
                                          <input type="text" class="form-control" v-model="search" placeholder="Buscar...">
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="card-body table-full-width table-responsive" v-if="cursos.length == 0" style="text-align: center"><i class="fas fa-spinner fa-spin fa-3x"></i></div>
                                <div class="card-body table-full-width table-responsive" v-if="cursos.length > 0">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                              <th>Código</th>
                                              <th>Nombre</th>
                                              <th>Estado</th>
                                              <th>Inscriptos</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="curso in getCursosPage(page)" @click="verCurso(curso)" style="cursor: pointer">
                                                <td><button class="btn vtn-default"> {{curso.codigo}} </button></td>
                                                <td>{{curso.nombre}}</td>
                                                <td><i 
                                                :class="{
                                                'fas fa-play-circle text-success': curso.estado.toUpperCase() == 'INICIADO', 
                                                'fas fa-stop-circle text-danger': curso.estado.toUpperCase() == 'TERMINADO'}">
                                                </i></td>
                                                <td>{{curso.alumnos.length}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="card-footer">
                                 <!-- <div class="form-inline float-right" v-if="cursos.length > 0">
                                      <input class="form-control" type="number" v-model="cantPerPage">
                                    <div class="btn-group">
                                      <button class="btn btn-default" @click="prevPage"><i class="fas fa-arrow-left"></i></button>
                                      <button v-for="pg in listPages()" class="btn" :class="{ 'btn-primary': pg === page, 'btn-default': pg != page}"  @click="page = pg">{{pg}}</button>
                                      <button class="btn btn-default" @click="nextPage"><i class="fas fa-arrow-right"></i></button>
                                    </div>
                                  </div>-->
                                </div>
                            </div>
                             <box-curso :curso="cursoMostrar" v-on:closeCurso="closeCurso()"></box-curso>
                            </div>`,
});


var app = new Vue({
  el: '#app',
  data: {
    navbar: [],
    cursos: [],
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
  },
  beforeMount() {
    this.loadNavBar();
    //this.loadCourses();
  },
});
