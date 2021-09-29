import React, { useEffect, useState } from 'react';
import '../App.css';
import { useMutation, useQuery } from '@apollo/client';
import queries from '../queries';
import DeleteBtn from './DeleteBtn';
import BinButton from './BinButton';

function MyPosts(props) {

    const { loading, data, error } = useQuery(queries.POSTED_IMAGES, { fetchPolicy: 'cache-and-network' });
    const [upLoadImage] = useMutation(queries.UPLOAD_IMAGE)
     

    const refreshPage = ()=>{
        window.location.reload();
     }
//define upload dive
    let url;
    let description;
    let posterName;

    let postDiv = (   <div className="center">
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
        refreshPage();
        
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


    if (data && data.userPostedImages && data.userPostedImages.length > 0) {
                let { userPostedImages} = data;
        return (
            <div>
                {postDiv}

                <div className="center">
            <ul>
                {userPostedImages.map((image) => {

                    return (
                        <li className="image-li" key={image.id}>
                            <div className="image-div">
                                <br />

                                <p>Poster: {image.posterName}</p>
                                <p>Description:{image.description}</p>
                                <p><img src={image.url} alt="Image cap"></img></p>
                                <BinButton image={image} />
                                <br />
                                <DeleteBtn image={image} />

                                <br />
                            </div>
                        </li>
                    )

                })}

            </ul>
            <br />
            <br />
            </div>

        </div>
    )
} else {

    return (<div className="center">
        <h2>No Posted Images</h2>
        <br/>
        {postDiv}
        
        </div>)
}



}
export default MyPosts;