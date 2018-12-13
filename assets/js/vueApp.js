Vue.use(VTooltip);


Vue.component('box-curso', {
  props: ['curso'],
  data: () => {
    return {
      section: 'general',
      alumnosSection: 'todos',
    }
  },
  watch: {
    curso: function (val) {
      this.loadNewData();
    }
  },
  methods: {
    close() {
      this.$emit('closeCurso', true);
    },
    loadNewData() {
      this.$http.get('/curso/' + this.curso.id)
        .then((response) => {

          let data = response.body;

          this.curso.alumnos = data.alumnos;
          this.curso.docentes = data.docentes;

          for (let alumno of  this.curso.alumnos) {
            alumno.sendNotifEmail = false;
            alumno.sendNotifApp = false;
          }
          for (let docente of this.curso.docentes) {
            docente.sendNotifEmail = false;
            docente.sendNotifApp = false;
          }
          this.$forceUpdate();
      });
    },
    getImgPath() {
      return this.curso.img;
    },
    changeSection(newSection) {
      this.section = newSection;
    },
    toggleNotifAppAlumnos(section){
      switch (section) {
        case 'todos':
          for (let alumno of this.curso.alumnos) {
            alumno.sendNotifApp = ! alumno.sendNotifApp;
          }
          break;
        case 'inscriptos':
          for (let alumno of this.curso.alumnos) {
            if (alumno.pago) {
              alumno.sendNotifApp = ! alumno.sendNotifApp;
            }
          }
          break;
        case 'solicitudes':
          for (let alumno of this.curso.alumnos) {
            if (!alumno.pago) {
              alumno.sendNotifApp = ! alumno.sendNotifApp;
            }
          }
          break;
      }
      this.$forceUpdate();
    },
    toggleNotifEmailAlumnos(section) {
      switch (section) {
        case 'todos':
          for (let alumno of this.curso.alumnos) {
            alumno.sendNotifEmail = ! alumno.sendNotifEmail;
          }
          break;
        case 'inscriptos':
          for (let alumno of this.curso.alumnos) {
            if (alumno.pago) {
              alumno.sendNotifEmail = ! alumno.sendNotifEmail;
            }
          }
          break;
        case 'solicitudes':
          for (let alumno of this.curso.alumnos) {
            if (!alumno.pago) {
              alumno.sendNotifEmail = ! alumno.sendNotifEmail;
            }
          }
          break;
      }
      this.$forceUpdate();
    },
    toggleNotifAppDocentes(){
      for (let docente of this.curso.docentes) {
        docente.sendNotifApp = !docente.sendNotifApp;
      }
      this.$forceUpdate();
    },
    toggleNotifEmailDocentes(){
      for (let docente of this.curso.docentes) {
        docente.sendNotifEmail = !docente.sendNotifEmail;
      }
      this.$forceUpdate();
    },
    getListadoAlumnos(section) {
      let alumnosReturn = [];
      switch (section){
        case 'todos':
          return this.curso.alumnos;
          break;
        case 'solicitudes':
            return this.curso.alumnos.filter(element => !element.pago);
          break;
        case 'inscriptos':
          return this.curso.alumnos.filter(element => element.pago);
          break;
      }

      return this.curso.alumnos;
    },
    changeSectionAlumnos(val) {
      this.alumnosSection = val;
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
              <div><b>Vigente:</b> {{curso.vigente}}</div>
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
                      <th scope="col">Caracter</th>
                      <th scope="col">E-Mail</th>
                      <th scope="col"><i class="fas fa-at" v-tooltip="'Notificación via E-Mail'"></i></th>
                      <th scope="col"><i class="fas fa-bell" v-tooltip="'Notificación via App'"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="docente in curso.docentes">
                      <td>{{docente.clave}}</td>
                      <td>{{docente.apellido}}</td>
                      <td>{{docente.nombre}}</td>
                      <td>{{docente.caracter}}</td>
                      <td>{{docente.email}}</td>
                      <td style="padding-left: 30px"><input class="form-check-input position-static" type="checkbox" v-model="docente.sendNotifEmail"></td>
                      <td style="padding-left: 30px"><input class="form-check-input position-static" type="checkbox" v-model="docente.sendNotifApp"></td>
                    </tr>
                    <tr v-if="curso.docentes.length == 0"><td colspan="9" class="text-center"><b>No se registraron docentes</b></td></tr>
                  </tbody>
                  <tfoot v-if="curso.docentes.length > 0">
                  <tr>
                      <th scope="col" colspan="5">Marcar/Desmarcar todos</th>
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
        <div class="row pt-3">
          <div class="col-sm-12">
          <nav class="nav nav-pills">
            <a class="nav-link" :class="{'active': alumnosSection == 'todos'}" href="#" @click="changeSectionAlumnos('todos')">Todos ({{getListadoAlumnos('all').length}})</a>
            <a class="nav-link" :class="{'active': alumnosSection == 'solicitudes'}" href="#" @click="changeSectionAlumnos('solicitudes')">Solicitudes ({{getListadoAlumnos('solicitudes').length}})</a>
            <a class="nav-link" :class="{'active': alumnosSection == 'inscriptos'}" href="#" @click="changeSectionAlumnos('inscriptos')">Inscriptos ({{getListadoAlumnos('inscriptos').length}})</a>
          </nav>
          </div>
        </div>
        <div class="row pt-3">
            <div class="col-sm-12">
              <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Clave UCC</th>
                      <th scope="col">Apellido</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Documento</th>
                      <th scope="col">E-Mail</th>
                      <th scope="col">Documentación</th>
                      <th scope="col">Pago</th>
                      <th scope="col"><i class="fas fa-at" v-tooltip="'Notificación via E-Mail'"></i></th>
                      <th scope="col"><i class="fas fa-bell" v-tooltip="'Notificación via App'"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="alumno in getListadoAlumnos(alumnosSection)">
                      <td>{{alumno.clave == 0 ? 'No definido' : alumno.clave}}</td>
                      <td>{{alumno.apellido}}</td>
                      <td>{{alumno.nombre}}</td>
                      <td>{{alumno.tipoDocumento}} {{alumno.documento}}</td>
                      <td>{{alumno.email}}</td>
                      <td>
                        <i :class="{
                        'fas fa-check-circle text-success': alumno.documentacion === true,
                        'fas fa-times-circle text-danger': alumno.documentacion === false,
                        'fas fa-spinner fa-spin': alumno.documentacion == null,
                        }"></i>
                      </td>
                      <td>
                       <i :class="{
                        'fas fa-check-circle text-success': alumno.pago === true,
                        'fas fa-times-circle text-danger': alumno.pago === false,
                        'fas fa-spinner fa-spin': alumno.pago == null,
                        }"></i>
                      </td>
                      <td style="padding-left: 30px"><input class="form-check-input position-static" type="checkbox" v-model="alumno.sendNotifEmail"></td>
                      <td style="padding-left: 30px"><input class="form-check-input position-static" type="checkbox" v-model="alumno.sendNotifApp"></td>
                    </tr>
                    <tr v-if="getListadoAlumnos(alumnosSection).length == 0"><td colspan="9" class="text-center"><b>No se registraron alumnos</b></td></tr>
                  </tbody>
                  <tfoot>
                  <tr v-if="getListadoAlumnos(alumnosSection).length > 0">
                      <th scope="col" colspan="7">Marcar/Desmarcar todos</th>
                      <th scope="col"><i v-tooltip="'Invertir selección'" class="fas fa-at" style="cursor: pointer" @click="toggleNotifEmailAlumnos(alumnosSection)"></i></th>
                      <th scope="col"><i v-tooltip="'Invertir selección'" class="fas fa-bell" style="cursor: pointer" @click="toggleNotifAppAlumnos(alumnosSection)"></i></th>
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
      inicio: 0,
      fin : 9,
      cantLogs: 0,
    }
  },
  methods: {
    loadLogs() {
      this.$http.get('/log')
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
    getLogs() {

      this.cantLogs = this.logs.length;

      this.inicio = this.page * this.cantPerPage - this.cantPerPage;
      this.fin = this.page * this.cantPerPage;

      if (this.inicio == 1) {
        this.inicio = 0;
      }

      return this.logs.slice(this.inicio, this.fin);
    },
    nextPage() {
      let pages = Math.trunc(this.cantLogs / this.cantPerPage);
      let rest = this.cantLogs % this.cantPerPage;

      if (rest>0) {
        pages++;
      }
      if (this.page < pages) {
        this.page++;
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    downloadLogsExcel() {
      window.location.href = '/log/generateXlsx'
    },
    displayDate(timestamp) {
      let fecha = new Date(timestamp);

      let date = fecha.getDate();
      let month = fecha.getMonth() + 1;
      let year = fecha.getFullYear();

      let hours = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours();
      let minutes = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes();
      let seconds = fecha.getSeconds() < 10 ? '0' + fecha.getSeconds() : fecha.getSeconds();

      return date + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ":" + seconds;
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
                                            <tr v-for="log in getLogs()">
                                                <td>{{log.pagina}}</td>
                                                <td>{{log.error}}</td>
                                                <td>{{displayDate(log.createdAt)}}</td>                                                     
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="card-footer" v-if="logs.length > 0">
                                     <div class="row" style="display: flex">
                                         <div class="col-sm-10">
                                            {{inicio + 1}} - {{fin}} de {{cantLogs}} 
                                         </div>
                                         <div class="col-sm-2" style="display: flex">
                                            <div class="input-group mb-3" style="display: flex">
                                                <div class="input-group-prepend" style="display: flex">
                                                    <button class="btn btn-outline-secondary" style="padding-bottom: 2px" type="button" @click="prevPage()"><i class="fas fa-arrow-left"></i></button>
                                                </div>
                                                 <input type="text" class="form-control" placeholder="" aria-label="" v-model="page" aria-describedby="basic-addon1">
                                            <div class="input-group-append" style="display: flex">
                                                 <button class="btn btn-outline-secondary" style="padding-bottom: 2px" type="button" @click="nextPage()"><i class="fas fa-arrow-right"></i></button>
                                             </div>
                                          </div>
                                      </div>
                                   </div>
                                   <div class="row" style="display: flex">
                                   <div class="col-sm-12" style="display: flex;">
                                      <button class="btn btn-success" @click="downloadLogsExcel()"><i class="fas fa-file-excel"></i> Descargar en formato Excel</button>
                                   </div>
                                   </div>
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
      sort: {
        order: 'asc',
        by: 'inicio'
      },
      inicio: 0,
      fin : 9,
      cantCursos: 0,
    }
  },
  watch: {
    search: function (val) {
      this.page = 1;
    },
  },
  methods: {
    getCursos() {
      let cursosRet = [];

      for (let curso of this.cursos) {
        if (this.search == "") {
          cursosRet.push(curso);
        } else {
          if (curso.codigo.toString().includes(this.search) ||
            curso.nombre.toUpperCase().includes(this.search.toUpperCase()) ||
            curso.nombreUA.toUpperCase().includes(this.search.toUpperCase())) {
            cursosRet.push(curso);
          }
        }
      }

      this.cantCursos = cursosRet.length;

      this.inicio = this.page * this.cantPerPage - this.cantPerPage;
      this.fin = this.page * this.cantPerPage;

      if (this.inicio == 1) {
        this.inicio = 0;
      }

      return cursosRet.slice(this.inicio, this.fin);
    },
    sortCursos(by) {

      if (this.sort.order == 'asc') {
        this.cursos = this.cursos.sort(function (a, b) {
          if (a[by] > b[by]) {
            return 1;
          }
          if (a[by] < b[by]) {
            return -1;
          }

          return 0;

        });
      }
      else {
        this.cursos = this.cursos.sort(function (a, b) {
          if (a[by] > b[by]) {
            return -1;
          }
          if (a[by] < b[by]) {
            return 1;
          }

          return 0;
        });
      }

      this.sort.by = by;
      this.sort.order = this.sort.order == 'asc' ? 'desc' : 'asc';
    },
    displayDate(timestamp) {
      let fecha = new Date(timestamp);

      let date = fecha.getDate();
      let month = fecha.getMonth() + 1;
      let year = fecha.getFullYear();

      let hours = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours();
      let minutes = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes();
      let seconds = fecha.getSeconds() < 10 ? '0' + fecha.getSeconds() : fecha.getSeconds();

      return date + '/' + month + '/' + year;
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

            if (cursos[key].img == "") {
              cursos[key].img = "https://via.placeholder.com/313x250.png?text=Sin Imagen";
            }
            else {
              cursos[key].img = "https://www.ucc.edu.ar/portalucc/archivos/File/fjs/fotos/" + cursos[key].img;
            }
            this.cursos.push(cursos[key]);
          }
        }, err => {
          console.log(err);
        });
    },
    nextPage() {
      let pages = Math.trunc(this.cantCursos / this.cantPerPage);
      let rest = this.cantCursos % this.cantPerPage;

      if (rest>0) {
        pages++;
      }
      if (this.page < pages) {
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
                                              <th @click="sortCursos('codigo')" style="cursor: pointer">
                                                <i v-if="sort.by == 'codigo'" 
                                                  :class="{'fas fa-sort-amount-up': sort.order == 'desc',
                                                  'fas fa-sort-amount-down': sort.order == 'asc'}">                     
                                                </i> 
                                                Código
                                              </th>
                                              <th @click="sortCursos('nombre')" style="cursor: pointer">
                                               <i v-if="sort.by == 'nombre'" 
                                                  :class="{'fas fa-sort-amount-up': sort.order == 'desc',
                                                  'fas fa-sort-amount-down': sort.order == 'asc'}">                     
                                                </i> 
                                              Nombre
                                              </th>
                                              <th @click="sortCursos('nombreUA')" style="cursor: pointer" v-tooltip="'Unidad Academica'">
                                               <i v-if="sort.by == 'nombreUA'" 
                                                  :class="{'fas fa-sort-amount-up': sort.order == 'desc',
                                                  'fas fa-sort-amount-down': sort.order == 'asc'}">                     
                                                </i> 
                                              UA</th>
                                              <th>Vigencia</th>
                                              <th>Estado</th>
                                              <th>Inicio</th>
                                              <th>Alumnos</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="curso in getCursos()" @click="verCurso(curso)" style="cursor: pointer">
                                                <td><button class="btn btn-default"> {{curso.codigo}} </button></td>
                                                <td>{{curso.nombre}}</td>
                                                <td>{{curso.nombreUA}}</td>
                                                <td><button 
                                                :class="{
                                                'btn btn-success': curso.vigente.toUpperCase() == 'VIGENTE', 
                                                'btn btn-warning': curso.vigente.toUpperCase() == 'EN REPROGRAMACIÓN', 
                                                'btn btn-danger': curso.vigente.toUpperCase() == 'CANCELADO', 
                                                }">{{curso.vigente}}</button></td>
                                                <td>
                                                  <i v-tooltip='curso.estado' 
                                                  v-if="curso.estado.toUpperCase() == 'INICIADO' 
                                                  || curso.estado.toUpperCase() == 'TERMINADO'
                                                  || curso.estado.toUpperCase() == 'POR INICIAR'"
                                                  :class="{
                                                  'fas fa-play-circle fa-2x text-success': curso.estado.toUpperCase() == 'INICIADO', 
                                                  'fas fa-stop-circle fa-2x text-danger': curso.estado.toUpperCase() == 'TERMINADO',
                                                  'fas fa-arrow-circle-right fa-2x text-warning': curso.estado.toUpperCase() == 'POR INICIAR',}">
                                                  </i>
                                                  <span 
                                                  v-if="curso.estado.toUpperCase() != 'INICIADO' 
                                                  && curso.estado.toUpperCase() != 'TERMINADO'
                                                  && curso.estado.toUpperCase() != 'POR INICIAR'">{{curso.estado}}</span>
                                                </td>
                                                <td>{{curso.inicio.replace(/-/g,'/')}}</td>
                                                <td>{{curso.alumnos.length}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="card-footer" v-if="cursos.length > 0">
                                  <div class="row" style="display: flex">
                                    <div class="col-sm-10">
                                    {{inicio + 1}} - {{fin}} de {{cantCursos}} 
                                    </div>
                                    <div class="col-sm-2" style="display: flex">
                                       <div class="input-group mb-3" style="display: flex">
                                        <div class="input-group-prepend" style="display: flex">
                                          <button class="btn btn-outline-secondary" style="padding-bottom: 2px" type="button" @click="prevPage()"><i class="fas fa-arrow-left"></i></button>
                                        </div>
                                        <input type="text" class="form-control" placeholder="" aria-label="" v-model="page" aria-describedby="basic-addon1">
                                        <div class="input-group-append" style="display: flex">
                                          <button class="btn btn-outline-secondary" style="padding-bottom: 2px" type="button" @click="nextPage()"><i class="fas fa-arrow-right"></i></button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
