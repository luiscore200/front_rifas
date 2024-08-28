  import { createComprador, deleteSeparated, forcedAssign, rifaCreate, rifaDelete, rifaUpdate } from './api';
  import Database from './sqlite';



  const updateRifas=async()=> {
    try {
      const db = new Database();
      const rifas = await db.find('rifas', { local: 1 });
      console.log('valores rifas a reconectarse',rifas);
    if(rifas.length>0){
        const promises = rifas.map(async (rifa) => {
            if(rifa.delete && rifa.deleted===1){
                  
              const aa = await rifaDelete(rifa.id);
              console.log('response de eliminar rifa',aa);
              if(aa.mensaje){
                await db.deleteDataTable('asignaciones',{id_raffle:rifa.id});
                await db.deleteDataTable('rifas',{id:rifa.id}); 
              }
            
            }else{
                if(rifa.id>=0){

                  const request = new FormData();
                  request.append("titulo",rifa.titulo);
                  request.append("pais",rifa.pais);
                  request.append("precio",rifa.precio.toString());
                  request.append("tipo",rifa.tipo);
                  request.append("numeros",rifa.numeros);
                  request.append("premios",rifa.premios);
                  
                  const response:any = await rifaUpdate(request,rifa.id);
                  console.log('response de actualziar rifa',response);
                  if(response.mensaje){
                    await db.update('rifas', { local: 0 }, [{ id: rifa.id }, '']);

                  }

                }else{

                      
                      const request = new FormData();
                      request.append("titulo",rifa.titulo);
                      request.append("pais",rifa.pais);
                      request.append("precio",rifa.precio.toString());
                      request.append("tipo",rifa.tipo);
                      request.append("numeros",rifa.numeros);
                      request.append("premios",rifa.premios);
                      //const body = rifa.image!==""? await imageBody(rifa.image):"";
                      request.append('imagen',"");

                      const response:any = await rifaCreate(request); 
                      console.log('response de crear rifa',response);
                      if(response.mensaje){
                        await db.update('rifas', { id: response.id, local: 0 }, [{ id: rifa.id }, '']);

                      }

                }

            }


          });
      
          await Promise.all(promises);
          console.log('All compradores processed successfully!');
    }
    } catch (error) {
  //    console.error('Error in updateRifas:', error);
    }
  }

 

    

    const AddCompradores=async()=> {
          try {
            const db = new Database();
            const compradores = await db.find('compradores', { local: 1, deleted: 0 }, ['name', 'email', 'phone', 'document','local','id']);
            console.log('valores a comprador reconectarse',compradores);
          if(compradores.length>0){
              const promises = compradores.map(async (comprador) => {
                  const create = await createComprador(comprador);
                  
                  if (create.mensaje) {
                      console.log('response compradores',create);
                    await db.update('compradores', { id: create.comprador.id, local: 0 }, [{ id: comprador.id }, '']);
                  }else{
                      console.log('error al reconectar asignaciones',create.error)
                  }
                });
            
                await Promise.all(promises);
                console.log('All compradores processed successfully!');
          }
          } catch (error) {
            console.error('Error in AddCompradores:', error);
          }
        }

        
      const UpdateAsignaciones= async()=> {
          try {
            const db = new Database();
            const aa =  await db.indexWithRelations(
              {tableName:'asignaciones' },
              [{tableName:'compradores',alias:'purchaser',foreignKey:'id_purchaser'},{tableName:'rifas',alias:'rifa',foreignKey:'id_raffle'}],
              ['id','number','status','id_raffle','id_purchaser','deleted'],
              [{alias:'purchaser',fields:['id']},{alias:'rifa',fields:['id']}],
              ` rifa.local=0 AND rifa.deleted = 0 AND purchaser.local=0 AND asignaciones.local = 1`
            );

            console.log('valores a asignacioens reconectarse',aa);

            
        if(aa.length>0){
          const promises = aa.map(async (asignacion) => {
            if(asignacion.deleted===0){
              const a = await forcedAssign(asignacion.id_raffle,asignacion.id_purchaser,asignacion.status,asignacion.number);
              if(a.mensaje){
                console.log('response asignaciones',a);
                  await db.update('asignaciones',{id:a.id,local:0},[{id:asignacion.id},""]);
              }else{
                  console.log('error al reconectar asignaciones',a.error);
              }
          }else{
            
              const response = await deleteSeparated(asignacion.id);
              console.log('response asignaciones',response);
              if(response.mensaje){
                  await db.deleteDataTable('asignaciones',{id:asignacion.id});
              }
          }
          });

    await Promise.all(promises);
    console.log('All compradores processed successfully!');
        }
          } catch (error) {
            console.error('Error in AddCompradores:', error);
          }
        }
      

      export const process=async()=> {
          try {
                await updateRifas();
              await AddCompradores();
          await UpdateAsignaciones();
          } catch (error) {
              console.error('Error in process:', error);
          }
      }
        

      

