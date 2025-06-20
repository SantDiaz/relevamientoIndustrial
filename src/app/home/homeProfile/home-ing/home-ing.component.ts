import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encuestas, encuestasObtener } from 'src/app/Interfaces/models';
import { EncuestaService } from 'src/app/services/encuesta.service';

@Component({
  selector: 'app-home-ing',
  templateUrl: './home-ing.component.html',
  styleUrls: ['./home-ing.component.css']
})
export class HomeIngComponent implements OnInit {
   pasoActual: number = 1;

    mostrarModal = false;
    itemSeleccionado: any = null;
    pendientes: encuestasObtener[] = [];
    encuestaSeleccionada: any = {};

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
    anio: '2024', 
  };

  idEmpresa: number = 0 ;
  activeSegment: string = 'all'; // Variable para controlar el segmento activo

  
  constructor(private encuestaService: EncuestaService, private router: Router,private http: HttpClient ) { }

  ngOnInit(): void {

  }


  estados = [
    'Ingresado',
    'Recepcionado',
    'Pre-validado',
  ];


  cargarPendientes() {
    const estadosParam = this.estados.map(estado => `estado=${encodeURIComponent(estado)}`).join('&');
    const url = `http://localhost:8080/api/filtrar?${estadosParam}`;
  
    console.log('URL construida:', url);
  
    this.http.get<any[]>(url).subscribe({
      next: data => {
        console.log('Datos recibidos:', data);
          
        this.pendientes = data;

      },
      error: err => {
        console.error('Error al cargar pendientes:', err);
      }
    });
  }

  

  verEncuesta(idEncuesta: number) {
    this.http.get(`http://localhost:8080/api/${idEncuesta}`).subscribe((data: any) => {
      this.encuestaSeleccionada = data.encuesta;
      console.log('Encuesta seleccionada:', this.encuestaSeleccionada);
      this.mostrarModal = true;
    });
  }


    siguientePaso() {
    if (this.pasoActual < 13) this.pasoActual++;
    // this.guardarCambios(); // Guardar los cambios al avanzar al siguiente paso
  }
  
  pasoAnterior() {
    if (this.pasoActual > 1) this.pasoActual--;
  }

// guardarCambios() {
//   const url = `http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateEncuestaIngresador`;
//   this.http.put(url, this.encuestaSeleccionada).subscribe(() => {

//   });
// }


guardarCambios() {
  const idEmpresa = this.encuestaSeleccionada.id_empresa;
  const url = `http://localhost:8080/api/${idEmpresa}/updateEncuestaIngresador`;

  this.http.put(url, this.encuestaSeleccionada).subscribe(() => {
    
    // ✅ Actualizar solo el registro modificado en el array 'pendientes'
    const index = this.pendientes.findIndex(p => p.idEmpresa === idEmpresa);
    if (index !== -1) {
      this.encuestaSeleccionada.fecha_mod_estado = new Date(); // Actualizar la fecha en el frontend
      this.pendientes[index] = {
        ...this.pendientes[index],
        ...this.encuestaSeleccionada
      };
    }

    console.log('Encuesta actualizada:', this.encuestaSeleccionada);
  });
}

// guardarCambios() {
//   const idEmpresa = this.encuestaSeleccionada?.id_empresa;

//   switch (this.pasoActual) {
//     case 1:
//      const url = `http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateEncuestaIngresador`;
//   this.http.put(url, this.encuestaSeleccionada).subscribe(() => {

//   });
//       break;

//     case 2:
//       // Paso 2: Datos de identificación de empresa
//       this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateDatosEmpresa`, this.encuestaSeleccionada.datosIdentificacionEmpresa)
//         .subscribe(() => console.log('Paso 2: Datos empresa actualizados'), error => console.error(error));
//       break;

//     case 3:
//       // Paso 3: Datos del respondiente
//       this.http.put(`http://localhost:8080/api/${this.encuestaSeleccionada.id_empresa}/updateRespondiente`, this.encuestaSeleccionada.datosRespondiente)
//         .subscribe(() => console.log('Paso 3: Respondiente actualizado'), error => console.error(error));
//       break;

//     default:
//       console.log('Paso no manejado aún');
//       break;
//   }
// }

  
  editarEncuesta(encuestaSeleccionada: encuestasObtener) {
    this.encuesta = {
      id_empresa: encuestaSeleccionada.idEmpresa,
      id_operativo: encuestaSeleccionada.idOperativo,
      ingresador: encuestaSeleccionada.ingresador,
      analista: encuestaSeleccionada.analista,
      fecha_entrega: encuestaSeleccionada.fecha_entrega,
      fecha_recupero: encuestaSeleccionada.fecha_recupero,
      fecha_supervision: encuestaSeleccionada.fecha_supervision,
      fecha_ingreso: encuestaSeleccionada.fecha_ingreso,
      medio: encuestaSeleccionada.medio,
      estado: encuestaSeleccionada.estado,
      observaciones_analista: encuestaSeleccionada.observaciones_analista,
      observaciones_ingresador: encuestaSeleccionada.observaciones_ingresador,
      // estado_validacion: encuestaSeleccionada.estado_validacion,
      // observaciones_validacion: encuestaSeleccionada.observaciones_validacion,
      referente: encuestaSeleccionada.referente,
    };
    this.mostrarModal = true;
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

      // Método para cambiar de segmento
      toggleSegment(segment: string) {
        this.activeSegment = segment;
      
        if (segment === 'favorites') {
          this.cargarPendientes();
        }
      }
}
