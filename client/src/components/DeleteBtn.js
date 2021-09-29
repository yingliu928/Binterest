import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import queries from '../queries';
import '../App.css';


const DeleteBtn = (props) => {
    const [deleted, setDelete] = useState(false);
    const [text, setText] = useState(undefined);
    const [deleteImage] = useMutation(queries.DELETE_IMAGE)
   

     useEffect(()=>{
       
         if(deleted){
             setText("deleted")
         }else{
             setText("delete");
         }
       
     },[deleted]);

    const changeStatus=()=>{
        setDelete(!deleted);    

    }
    const refreshPage = ()=>{
        window.location.reload();
     }

        return(
            <div>
            <button className={deleted?"del":"undel"} onClick={(e) => {
                  
                e.preventDefault();
                  changeStatus();
                  deleteImage(
                    {
                        
                        variables: {
                            id: props.image.id,
                            
                
                        }
                    }
                  );
                   refreshPage();
                  
             }}>{text}</button>
            </div >
        )
   
    }

export default DeleteBtn;