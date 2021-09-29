import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import queries from '../queries';
import '../App.css';


const BinButton = (props) => {
    const [bin, setBin] = useState(props.image.binned);
    const [change,setChange] = useState(false);
   // const [numBinned,setNumBinned] = useState(props.image.numBinned);
    const [text, setText] = useState(undefined);
    const [updateImage] = useMutation(queries.EDIT_IMAGE)
   
    useEffect(()=>{
        
        console.log("binn button use effect\n");
        //console.log(props.image)
       // console.log(props.image.numBinned);
       // setNumBinned(props.image.numBinned);
        let bin = props.image.binned;
         setBin(bin); 
         if(bin){
             setText("Remove from Bin")
            }
         else{
            setText("Add to BIN");
         }
 
     },[]);

     useEffect(()=>{
       
         //setBin(!bin); 
         setChange(true);
       
     },[change]);

    const changeStatus=()=>{
        setBin(!bin);    

    }
    
    if(change){
        return(
            <div>
            <button onClick={(e) => {
                  
                e.preventDefault();
                  changeStatus();
                  updateImage(
                    {
                        variables: {
                            id: props.image.id,
                            url: props.image.url,
                            posterName: props.image.posterName,
                            userPosted: props.image.userPosted,
                            description: props.image.description,
                            binned: (props.image.binned)?false:true,
                            numBinned: props.image.numBinned
                        }
                    }
                  );
                  
                  
             }}>{bin?"Remove from bin":"Add to bin"}</button>
            </div >
        )
    }else{
        return(
            <div>
            <form
                className="form"
                onSubmit={(e) => {
                    changeStatus()
                    // changeStatus(props.image);
                   
                    alert('set bined');
                }}
            >
                <button className={bin?"binned":"unbinned"} type="submit">{text}</button>
            </form>
            </div >
        )
    }
 
    

    
    
    
    
       

    

}
export default BinButton;