
import React, { useState } from 'react';
import '../App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';

function NewPost(){

 
     const [upLoadImage] = useMutation(queries.UPLOAD_IMAGE)

    //fill-in places
    let url;
    let description;
    let posterName;



    return (   <div className="center">
        <h2>Post One</h2>
        <form
        className="form"
        onSubmit={(e)=>{
            e.preventDefault();

            upLoadImage({
                variables:{
                    url: url.value,
                    description:description.value?description.value:"N/A",
                    posterName:posterName.value?posterName.value:"N/A"
                }
            });

            url.value='';
            description.value='';
            posterName.value='';
            alert("Successfully Posted!")
        }}
        >

        <div className="form-group">
            <label>
             Image URL:
                <br/>
                <input ref={(node)=>{url = node;}} required autoFocus ={true} />     
            </label>
        </div>
        <br/>
        <div className="form-group">
            <label>
            Poster name:
                <br/>
                <input ref={(node)=>{posterName = node;}}  autoFocus ={true} />     
            </label>
        </div>
        <br/>
        <div className="form-group">
            <label>
                Description:
                <br/>
                <input ref={(node)=>{description = node;}}  autoFocus ={true} />     
            </label>
        </div>
        <br/>
       
        <button className="button" type="submit">Post</button>


        </form>
    </div>)

}
export default NewPost;