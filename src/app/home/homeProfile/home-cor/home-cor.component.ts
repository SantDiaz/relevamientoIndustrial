import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campo, DatoControl, encuestas, encuestasObtener, ResumenRim, TasaNoRespuesta } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  
  selector: 'app-home-cor',
  templateUrl: './home-cor.component.html',
  styleUrls: ['./home-cor.component.css']
})

export class HomeCorComponent implements OnInit {
@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

   pasoActual: number = 1;
  C1: DatoControl[] = [];
  C2: ResumenRim[] = [];
  C3: Campo[] = [];
  C4: TasaNoRespuesta[] = [];
  consultaActiva: string = ''; // consulta1, consulta2, etc.
  datoss: any[] = [];

  selectedConsulta: string = ''; // puede iniciar vacío o con 'ventas'
  estadoSeleccionado: string = ''; // o algún valor inicial si quieres
  username: string = '';
  mostrarModal = false;
  itemSeleccionado: any = null;
  activeSegment: string = 'all'; // Variable para controlar el segmento activo
  pendientes: encuestasObtener[] = [];
  encuestaSeleccionada: any = {};


  //IMAGEN DE PERFIL
    avatarUrl: string | null = null;
  defaultAvatarUrl = 'https://api.dicebear.com/7.x/initials/svg?seed=TuUsuario';
  randomSeed = Math.random().toString(36).substring(2);

  constructor(private encuestaService: EncuestaService, private router: Router, private http: HttpClient  ) { }

  ngOnInit(): void {
     this.username = localStorage.getItem('username') || '';

  }


  // Estados a enviar
  estados = [
      'No entregado' ,
      'No encontrado (no existe)' , 
      'Cierre definitivo' , 
      'Rechazado', 
      'Ausente', 
      'Entregado', 
      'Recepcionado', 
      'Pre-validado', 
      'Validado', 
      'Ingresado'
  ];


    encuesta: encuestas = {
      id_operativo: 0,
      id_empresa: 0,
      ingresador: '',
      analista: '',
      fecha_entrega: new Date(),
      fecha_recupero: new Date(),
      fecha_supervision: new Date(),
      fecha_ingreso: new Date(),  // No será visible
      medio: 'PAPEL',
      observaciones_ingresador: '',
      observaciones_analista: '',
      observaciones_supervisor: '',
      referente: '',
      fecha_mod_estado:  new Date(), // Asegurarse de que esta fecha también se incluya
      anio: '2024', 
    };
  
    idEmpresa: number = 0 ;

    
    mostrarConsulta(consulta: string) {
      this.consultaActiva = consulta;
      this.datoss = [];
      switch (consulta) {
        case 'consulta1':
      this.encuestaService.obtenerDatos().subscribe({
        next: (resp) => {
          console.log("Consulta 1", resp);
          this.C1 = resp;
        },
        error: (err) => console.error('Error en consulta 1:', err)
        });

        break;
    case 'consulta2':
      this.encuestaService.obtenerResumenRim().subscribe({
        next: (resp) => this.C2 = resp,
        error: (err) => console.error('Error en consulta 2:', err)
      });
      break;
    case 'consulta3':
      this.encuestaService.obtenerCampos().subscribe({
        next: (resp) => this.C3 = resp,
        error: (err) => console.error('Error en consulta 3:', err)
      });
      break;
    case 'consulta4':
      this.encuestaService.obtenerTasas().subscribe({
        next: (resp) => this.C4 = resp,
        error: (err) => console.error('Error en consulta 4:', err)
      });
      break;
  }

  }

cargarConsulta() {
  this.encuestaService.obtenerDatos().subscribe({
    next: (resp) => this.datoss = resp,
    error: (err) => console.error('Error al obtener datos:', err)
  });
}


    // Método para cambiar de segmento
    toggleSegment(segment: string) {
      this.activeSegment = segment;
    
      if (segment === 'favorites') {
        this.cargarPendientes();
      }else if (segment === 'all') {

      }else {
        this.cargarConsulta();
      }
    }


 exportarAExcel() {
    let datos: any[] = [];

    switch (this.consultaActiva) {
      case 'consulta1':
        datos = this.C1;
        break;
      case 'consulta2':
        datos = this.C2;
        break;
      case 'consulta3':
        datos = this.C3;
        break;
      case 'consulta4':
        datos = this.C4;
        break;
      default:
        return;
    }

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Datos');

    const nombreArchivo = `${this.consultaActiva}_reporte.xlsx`;
    const excelBuffer: any = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, nombreArchivo);
  }
    


    cargarPendientes() {
      const estadosParam = this.estados.map(estado => `estado=${encodeURIComponent(estado)}`).join('&');
      const url = `http://localhost:8080/api/filtrar?${estadosParam}`;
    
      console.log('URL construida:', url);
    
      this.http.get<any[]>(url).subscribe({
        next: data => {
          console.log('Datos recibidos:', data);
            
          this.pendientes = data;
        this.pendientes.forEach(encuesta => {
 
          }
          );
        },
        error: err => {
          console.error('Error al cargar pendientes:', err);
        }
      });
    }
guardarCambios() {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;

  const index = this.pendientes.findIndex(p => p.idEmpresa === idEmpresa);
  this.encuestaSeleccionada.mod_usu = this.username
    if (index !== -1) {
      this.encuestaSeleccionada.fecha_mod_estado = new Date(); // Actualizar la fecha en el frontend
      this.pendientes[index] = {
        ...this.pendientes[index],
        ...this.encuestaSeleccionada,
      };
    }

const mostrarMensajeExito = () => {
  Swal.fire('¡Editado con éxito!', 'Los cambios fueron guardados correctamente.', 'success');
};

switch (this.pasoActual) {
  case 1:
    const url = `http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateEncuestaIngresador`;
    this.http.put(url, this.encuestaSeleccionada).subscribe({
      next: () => mostrarMensajeExito(),
      error: err => console.error(err)
    });
    break;

  case 2:
    this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosIdentificacionEmpresa`, this.encuestaSeleccionada.datosIdentificacionEmpresa)
      .subscribe({
        next: () => mostrarMensajeExito(),
        error: err => console.error(err)
      });
    break;

  case 3:
    this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosRespondiente`, this.encuestaSeleccionada.datosRespondiente)
      .subscribe({
        next: () => mostrarMensajeExito(),
        error: err => console.error(err)
      });
    break;

  case 4:
    this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosReferente`, this.encuestaSeleccionada.Datos_referente)
      .subscribe({
        next: () => mostrarMensajeExito(),
        error: err => console.error(err)
      });
    break;

  // Para los que llaman funciones como `guardarProduccion()`, pasales el callback:
  case 5:
    this.guardarProduccion(mostrarMensajeExito);
    break;
  case 6:
    this.guardarInsumosBasicos(mostrarMensajeExito);
    break;
  case 7:
    this.guardarManoDeObra(mostrarMensajeExito);
    break;
  case 8:
    this.guardarUtilizacionInsumos(mostrarMensajeExito);
    break;
  case 9:
    this.guardarUtilizacionServicios(mostrarMensajeExito);
    break;
  case 10:
    this.guardarCantidadTrabajadores(mostrarMensajeExito);
    break;
  case 11:
    this.guardarHorasNormales(mostrarMensajeExito);
    break;
  case 12:
    this.guardarHorasExtras(mostrarMensajeExito);
    break;
  case 13:
    this.guardarVentas(mostrarMensajeExito);
    break;
  case 14:
    this.guardarHorasNormales(mostrarMensajeExito);
    break;
  case 15:
    this.guardarPerspectiva(mostrarMensajeExito);
    break;

  default:
    console.log('Paso no manejado aún');
    break;
}
}


guardarProduccion(callback?: () => void) {
  // stepper 5 Tabla produccion
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const produccionModificada = this.encuestaSeleccionada?.produccion;
      if (callback) callback();

  if (!idEmpresa || !produccionModificada || produccionModificada.length === 0) {
    console.error("No hay datos de producción para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateProduccionMasiva`;

  this.http.put(url, produccionModificada).subscribe({
    next: () => console.log('Producción actualizada correctamente'),
    error: (error) => console.error('Error al actualizar producción', error)
  });
}

guardarInsumosBasicos(callback?: () => void) {
  // stepper 6 Tabla InsumosBasicos

  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.insumosBasicos;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos para guardar Insumos Básicos.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateInsumosMasiva`; // <- adaptá si es necesario

  this.http.put(url, datos).subscribe({
    next: () => console.log('Insumos Básicos actualizados correctamente'),
    error: (error) => console.error('Error al actualizar Insumos Básicos', error)
  });
}
guardarManoDeObra(callback?: () => void) {
  // stepper 7 Tabla ManodeObra
  
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const manoDeObraModificada = this.encuestaSeleccionada?.manoDeObra;
  if (callback) callback();

  if (!idEmpresa || !manoDeObraModificada || manoDeObraModificada.length === 0) {
    console.error("No hay datos de Mano de Obra para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateManoDeObraMasiva`;

  this.http.put(url, manoDeObraModificada).subscribe({
    next: () => console.log('Mano de Obra actualizada correctamente'),
    error: (error) => console.error('Error al actualizar Mano de Obra', error)
  });
}

guardarUtilizacionInsumos(callback?: () => void) {
  // stepper 8 Tabla UitilizacionInsumos

  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const utilizacionInsumosModificada = this.encuestaSeleccionada?.utilizacionInsumos;
      if (callback) callback();

  if (!idEmpresa || !utilizacionInsumosModificada || utilizacionInsumosModificada.length === 0) {
    console.error("No hay datos de Utilización de Insumos para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateUtilizacionInsumosMasiva`;

  this.http.put(url, utilizacionInsumosModificada).subscribe({
    next: () => console.log('Utilización de Insumos actualizada correctamente'),
    error: (error) => console.error('Error al actualizar Utilización de Insumos', error)
  });
}


guardarUtilizacionServicios(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const utilizacionServicios = this.encuestaSeleccionada?.utilizacionServicios;
      if (callback) callback();

  if (!idEmpresa || !utilizacionServicios || utilizacionServicios.length === 0) {
    console.error("No hay datos de Utilización de Servicios para guardar.");
    return;
  }

  const url = `http://localhost:8080/api/${idEmpresa}/updateUtilizacionServiciosMasiva`;

  this.http.put(url, utilizacionServicios).subscribe({
    next: () => console.log('Utilización de Servicios actualizada correctamente'),
    error: (error) => console.error('Error al actualizar Utilización de Servicios', error)
  });
}

guardarCantidadTrabajadores(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.cantidadTrabajadores;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de trabajadores.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateCantidadTrabajadoresMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Cantidad de trabajadores actualizada correctamente'),
    error: (err) => console.error('Error al actualizar trabajadores', err)
  });
}

guardarHorasNormales(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.horasNormales;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de horas normales.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateHorasNormalesMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Horas normales actualizadas correctamente'),
    error: (err) => console.error('Error al actualizar horas normales', err)
  });
}

guardarHorasExtras(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.horasExtras;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de horas extras.");
    return;
  }

  const url = `http://localhost:8080/apiTwo/${idEmpresa}/updateHorasExtrasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Horas extras actualizadas correctamente'),
    error: (err) => console.error('Error al actualizar horas extras', err)
  });
}

guardarVentas(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.venta;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de ventas.");
    return;
  }

  const url = `http://localhost:8080/apiThree/${idEmpresa}/updateVentasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Ventas actualizadas correctamente'),
    error: (err) => console.error('Error al actualizar ventas', err)
  });
}

guardarPerspectiva(callback?: () => void) {
  const idEmpresa = this.encuestaSeleccionada?.id_empresa;
  const datos = this.encuestaSeleccionada?.perspectiva?.item;
      if (callback) callback();

  if (!idEmpresa || !datos || datos.length === 0) {
    console.error("No hay datos de perspectiva para guardar.");
    return;
  }

  const url = `http://localhost:8080/apiFour/${idEmpresa}/updatePerspectivasMasiva`;

  this.http.put(url, datos).subscribe({
    next: () => console.log('Perspectiva actualizada correctamente'),
    error: (err) => console.error('Error al actualizar perspectiva', err)
  });
}


  verEncuesta(idEncuesta: number) {
    this.http.get(`http://localhost:8080/api/${idEncuesta}`).subscribe((data: any) => {
      this.encuestaSeleccionada = data.encuesta;
      console.log('Encuesta seleccionada:', this.encuestaSeleccionada);
      this.mostrarModal = true;
    });
  }


   
    
    abrirModal(item: any) {
      this.itemSeleccionado = item;
      this.mostrarModal = true;
    }
    
    
    cerrarModal() {
      this.mostrarModal = false;
      this.encuestaSeleccionada = {};
    }



    
    onSubmit() {


      this.encuestaService.saveEncuesta(this.encuesta).subscribe({
        next: (response) => {
          console.log('Encuesta saved successfully:', response);
          this.encuesta.anio = '2024';
          // Suponiendo que el id_empresa viene en el response
          const idEmpresa = response.id_empresa;
  
          // Redirigir al componente 'oneComponent' con id_empresa como parámetro
          this.router.navigate(['/one', idEmpresa]);
        },
        error: (error) => {
          console.error('Error saving encuesta:', error);
        }
      });
    }
    
  nextStep() {
    console.log(this.encuesta);
    this.onSubmit();  // Save the form data when moving to the next step
  }












    siguientePaso() {
    if (this.pasoActual < 15) this.pasoActual++;
    // this.guardarCambios(); // Guardar los cambios al avanzar al siguiente paso
  }
  
  pasoAnterior() {
    if (this.pasoActual > 1) this.pasoActual--;
  }






  //IMAGEN DE PERFIL 

onAvatarSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      this.avatarUrl = base64Image;
      localStorage.setItem('avatarImage', base64Image); // Guarda en localStorage
    };
    reader.readAsDataURL(file);
  }
}

generarSeedAleatorio(): string {
  return Math.random().toString(36).substring(2, 10);
}

cambiarAvatarRandom() {
  this.randomSeed = this.generarSeedAleatorio();
}

}
