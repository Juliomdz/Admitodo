import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, onSnapshot  } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadString, getStorage } from '@firebase/storage';
import { app } from '../home/home.page';

export const storage = getStorage();
//export const db = getFirestore(app);
//export const usuarios = collection(db, "usuarios");

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private db: Firestore;
  private usuarios;

  constructor() {
    this.db = getFirestore(app);
    this.usuarios = collection(this.db, 'usuarios');
  }

  getUsuarios(callback: (data: any[]) => void) {
    onSnapshot(this.usuarios, (snapshot) => {
      const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(usuarios);
    });
  }

  public async subirUsuarioDB(nombreRecibido:string, apellidoRecibido:string, mailRecibido:string, dniRecibido:number, claveRecibida:string, fotoFile:any) 
  {
    
    /*ESCANEO QR DE DATOS*/
    
    //Estructuro el usuario
    let usuarioEstructurado = 
    {
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      mail: mailRecibido,
      dni: dniRecibido,
      clave: claveRecibida,
      fotoFile: fotoFile
    }

    this.subirFoto(usuarioEstructurado.fotoFile, usuarioEstructurado);
  }
//////////////////


  // COSAS LINDAS

  private async subirFoto(filePhoto:any,usuarioEstructuradoRecibido:any)
  {
    let lastId = this.getLastIDUsuarios();
    let newID = await lastId + 1;

    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));
    
    let referencia = ref(storage, `images/${usuarioEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual}`);

    uploadBytes(referencia, filePhoto).then((snapshot)=>
    {
      getDownloadURL(referencia).then(async (url)=>
      {
          usuarioEstructuradoRecibido.fotoFile = url;
          let newDocument = doc(this.db,"usuarios", newID.toString());
          await setDoc(newDocument,usuarioEstructuradoRecibido);
      });
    }).catch( () => { console.log("Error");})   
  }

  async leerDBUsuarios()
  {
    console.log("-------------------------------------");
    console.log("USUARIOS LEIDOS DE LA DB:")

    let usuariosDB = new Array();

    //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
    // let cosaslindas = collection(db, "cosaslindas");
    const querySnapshot = await getDocs(collection(this.db, "usuarios"));
    
    querySnapshot.forEach((doc) => 
    {
        // imprimo la data
        console.log(doc.id, " => ", doc.data());
        
        let data = doc.data();
        data.id = doc.id;

        // let publicacion = new Foto(doc.data()['emisor'],doc.data()['fecha'],doc.data()['foto'],doc.data()['hora'],doc.data()['like']);
        usuariosDB.push(data);
    });
    console.log(usuariosDB);

    // cosasLindasDB = cosasLindasDB.sort();
    usuariosDB = usuariosDB.sort( (a,b) => 
    {
        if (parseInt(a.id) > parseInt(b.id))
        {
          console.log(a.id);
          return -1;
        }
        else
        {
          console.log(b.id);
          return 1;
        }
    });

    return usuariosDB;
  }

  private async getLastIDUsuarios()
  {
    let querySnapshot = getDocs(this.usuarios);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
        // console.log(flagMax);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  public async userEstaRegistrado(mailRecibido:string)
  {
    let estaRegistrado:boolean = false;
    
    let usuariosDB = new Array();

    //Obtengo los documentos de forma asincronica, con un await. Por cada documento creo un usuario le asigno los datos y lo guardo
    // let cosaslindas = collection(db, "cosaslindas");
    const querySnapshot = await getDocs(collection(this.db, "usuarios"));
    
    querySnapshot.forEach((doc) => 
    {
      if (doc.data()["mail"] == mailRecibido)
      {
        estaRegistrado = true;
      }
    });

    return estaRegistrado;
  }
}
