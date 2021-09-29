import React, { useEffect, useState } from 'react';
import '../App.css';
import { useQuery } from '@apollo/client';
import queries from '../queries';

import BinButton from './BinButton';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom'
import { each } from 'bluebird';



function Popularity(props) {

    const {loading,data,error} = useQuery(queries.POP_IMAGES,{fetchPolicy: 'cache-and-network'});
  

    if(data&&data.getTopTenBinnedPosts&&data.getTopTenBinnedPosts.length>0){
        let {getTopTenBinnedPosts} = data;
       // console.log(getTopTenBinnedPosts)
       let postsNum = 0;
       for(let item of getTopTenBinnedPosts){
            postsNum+=item.numBinned;
       }
      
        return (
            <div className="center">
                <h2>You are: {(postsNum>200)?"Mainstream":"Non-mainstream"}</h2>
                <ol>
                    {getTopTenBinnedPosts.map((image) => {

                        return (
                            <li className="image-li" key={image.id}>
                                <div className="image-div">
                                    <br />

                                    <p>Poster: {image.posterName}</p>
                                    <p>Description:{image.description}</p>
                                    <p>Binned Numbers:{image.numBinned}</p>
                                    <p><img src={image.url} alt="Image cap"></img></p>
                                    <BinButton image={image} />

                                    <br />
                                </div>
                            </li>
                        )

                    })}

                </ol>
            </div>
        )
    } else if(loading) {

        return (<div className="center"><h2>loading</h2></div>)
    }else if(error){
        return (<div className="center"><h2>404 Error</h2></div>)
    }else{
        return (<div className="center"><h2>Empty Bin</h2></div>)
    }



}
export default Popularity;