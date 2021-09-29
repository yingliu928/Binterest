import React, { useEffect, useState } from 'react';
import '../App.css';
import { useQuery } from '@apollo/client';
import queries from '../queries';

import BinButton from './BinButton';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom'


function Home(props) {

    const [pageNum, setPage] = useState(undefined);
    const [nextPage, setNextPage] = useState(pageNum + 1)
    const binList = useQuery(queries.BINNED_IMAGES,{fetchPolicy: 'cache-and-network'});
    const { loading, data, error } = useQuery(queries.UNSPLASH_IMAGES, {
        fetchPolicy: 'cache-and-network',
        variables: {
            pageNum: nextPage
        }
    });
 
        

    useEffect(() => {
        console.log("home fire using effect\n")
        let page = props.match.params.page;
        if (page) {
            setPage(Number.parseInt(page));
            let next = Number.parseInt(page) + 1;
            setNextPage(next);
        } else {
            setNextPage(1);
        }

    }, [props.match.params.page]);

    let images = [];
    if (data && data.unsplashImages && binList.data) {

        // console.log(getBin.data.binnedImages);
         let binData = binList.data.binnedImages
        // console.log(binnedList)
        let unsplash = Array.from(data.unsplashImages);

        for (let i = 0; i < unsplash.length; i++) {
            for (let j = 0; j < binData.length; j++) {
                if (unsplash[i].id === binData[j].id) {
                   unsplash.splice(i,1,binData[j]);
                 
                }
            }
        }
        images = unsplash;

    } else if (data && data.unsplashImages) {
        images = data.unsplashImages;
    }

    if (images) {
        return (
            <div className="center">
                <NavLink className="nav-link" to={`/page/${nextPage}`}>
                    Get More
            </NavLink>
                <ul>
                    {images.map((image) => {

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

    } else if (loading) {
        return (<div><p>Loading</p></div>)
    } else if (error) {
        return (errorDiv)
    }



}
export default Home;