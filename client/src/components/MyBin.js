import React, { useEffect, useState } from 'react';
import '../App.css';
import { useQuery } from '@apollo/client';
import queries from '../queries';

import BinButton from './BinButton';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom'



function MyBin(props) {

    const {loading,data,error} = useQuery(queries.BINNED_IMAGES,{fetchPolicy: 'cache-and-network'});
  

    if(data&&data.binnedImages&&data.binnedImages.length>0){
        let {binnedImages} = data;
      //  console.log(binnedImages)
        return (
            <div className="center">
                <ul>
                    {binnedImages.map((image) => {

                        return (
                            <li className="image-li" key={image.id}>
                                <div className="image-div">
                                    <br />

                                    <p>Poster: {image.posterName}</p>
                                    <p>Description:{image.description}</p>
                                    <p><img src={image.url} alt="Image cap"></img></p>
                                    <BinButton image={image} />

                                    <br />
                                </div>
                            </li>
                        )

                    })}

                </ul>
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
export default MyBin;