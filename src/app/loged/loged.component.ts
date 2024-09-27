import { Component, OnDestroy, OnInit, ChangeDetectorRef  } from '@angular/core';

import { getAuth, signOut } from "firebase/auth";
import { HomePage } from '../home/home.page';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { FirestoreService } from '../Servicios/firestore.service';

@Component({
  selector: 'app-loged',
  templateUrl: './loged.component.html',
  styleUrls: ['./loged.component.scss'],
})
export class LogedComponent implements OnInit, OnDestroy {

  rango = "Usuario";

  public usuariosLeidos:any;
  public usuariosLeidosOrdenados:any;
  unsubscribe: () => void;

  constructor(private routerRecieved:Router, public srvFirebase:FirestoreService, private cd: ChangeDetectorRef) 
  {}

  spinnerMostrandose = true;

  async ngOnInit() 
  {
    //--------SPINNER----------------------------------------------
    setTimeout( ()=> { this.spinnerMostrandose = false}, 2000);
    //-------------------------------------------------------------

    const auth = getAuth();
    
    try
    {
      if (auth.currentUser.email != null)
      {
          if (auth.currentUser.email == "admin@admin.com")
          {
              this.rango = "Administrador";

              let  btnUpdateUser = document.getElementById("btn-subir-user");
              btnUpdateUser.removeAttribute("hidden");
          }
          else
          {
            let  btnUpdateUser = document.getElementById("btn-subir-user");
            btnUpdateUser.setAttribute("hidden","true");
          }
      }
    }
    catch(e)
    {
      this.routerRecieved.navigate(['/home']);
    }
    this.srvFirebase.getUsuarios((data) => {
      this.usuariosLeidos = data;
      this.cd.detectChanges();
      this.usuariosLeidosOrdenados = this.usuariosLeidos.sort( (a,b)=> { if(a.nombre > b.nombre){return 1;}else{return -1}});
    });
    this.usuariosLeidos = await this.srvFirebase.leerDBUsuarios();
    this.usuariosLeidosOrdenados = this.usuariosLeidos.sort( (a,b)=> { if(a.nombre > b.nombre){return 1;}else{return -1}});
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }


  logOut()
  {
    const auth = getAuth();
    signOut(auth).then(() => 
    {
      // Sign-out successful.
      console.log("Cierre de sesión satisfactorio.");
      this.routerRecieved.navigate(['/home']);

    }).catch((error) => 
    {
      // An error happened.
      console.log(error);
    });
  }

  goToAltaUser()
  {
    this.routerRecieved.navigate(['/altausuario']);
    this.spinnerMostrandose = true;
    setTimeout( ()=> { this.spinnerMostrandose = false}, 2000);
  }
  
}
