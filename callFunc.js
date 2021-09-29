const uuid = require('uuid');

const nodeFetch = require('node-fetch');
const { createApi } = require('unsplash-js');
const unsplash = createApi({
    accessKey: "g_TyEbq8r6RRTqJNwVqiY8SKsXOiFguId9bEvtz3tu8",
    fetch: nodeFetch
});
const bluebird = require('bluebird');
const redis = require('redis');
const { countBy } = require('lodash');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;


async function unsplashedImages(pageNum){
        
        let resultList  = [];
         console.log("unsplashImages called.\n");
         try {
            let result = await unsplash.photos.list({page:pageNum});
         //   console.log(result)
                if (result.errors) {
                   // console.log('error occurred:', result.errors[0]);
                    throw 'could not get data'
                } else {
                    const data = result.response;
                    const { total, results } = data;
                  
                 //  console.log(`received ${results.length} photos out of ${total}`);
               // console.log('photos: ', results);
                   
                    for (let element of results) {
                     //   console.log(element)
                        let newElement = {
                            id: element.id,
                            url: (element.urls && element.urls.raw) ? element.urls.small: "N/A",
                            posterName: (element.user && element.user.username ) ? element.user.username: "N/A",
                            description: element.description?element.description:"N/A",
                            userPosted: false,// from unsplash, so false
                            binned: false, //initial false
                            numBinned:element.likes?element.likes:0
    
                        }
                       // console.log(newElement);
                        resultList.push(newElement);  
                    }
                }
            return resultList; 
         } catch (error) {
             console.log(error)
         }
 
     
}
async function uploadImage(url,posterName,description){
    console.log("upload images called\n");
    if(typeof url === 'undefined' ) 
    throw 'You need to provide url'

    if(!url || url.trim() === '') throw 'url should be non-empty string'
    if(typeof posterName ==='undefined'||!posterName || posterName.trim()==='') posterName = 'N/A'
    if(typeof description === 'undefined'||!description||description.trim()==='') description = 'N/A'
    let newId = uuid.v4();
    let newOne = {
        id:newId,
        url:url.trim(),
        posterName:posterName.trim(),
        userPosted:true,
        description:description.trim(),
        binned:false,
        numBinned:0
    }
    try {
        const cacheNew = await client.hsetAsync('posted',newId,JSON.stringify(newOne));
        
        return newOne;
    } catch (error) {
        console.log(error)
    }

}



async function updateImage(id,url,posterName,userPosted,description,binned,numBinned){
    console.log("update Images called\n");
    console.log("numbinned: "+numBinned);
    if(typeof id ==='undefined' ) throw 'You need to provide an id';
    try {
        let cacheExist = await client.existsAsync(id);
      //  console.log(cacheExist);
    if(cacheExist){
      //  console.log("in the cache\n");
      //  console.log("ImageBIn:"+binned);
      console.log("image numbinned: "+numBinned);
      //  console.log("userPosted:"+userPosted);
        let thisImage = await client.getAsync(id);
      //  console.log(thisImage);
        let parsedImage = JSON.parse(thisImage);
        //console.log(parsedImage);
        if(typeof userPosted === 'undefined'|| typeof userPosted !=='boolean')
        userPosted = parsedImage.userPosted;

         if(typeof binned ==='undefined'|| typeof binned !=='boolean') binned = parsedImage.binned;

        if(!binned && !parsedImage.userPosted){//not userposted and unbinned , remove
            await client.delAsync(id);
            await client.hdelAsync("binned",id);
          //  console.log("remove:\n")
            parsedImage.binned = binned;
          //  console.log(parsedImage);
            return parsedImage;
        }else if(binned&&!parsedImage.userPosted){
            let updatedOne ={
                id:id,
                url:url?url:parsedImage.url,
                posterName:posterName?posterName:parsedImage.posterName,
                userPosted:userPosted,
                description:description?description:parsedImage.description,
                binned:binned,
                numBinned:numBinned
            }
           // console.log("update to:\n");
           // console.log(updatedOne);
            
            await client.hsetAsync('binned',id,JSON.stringify(updatedOne));
            return updatedOne;
        }else if(!binned && parsedImage.userPosted){
            let updatedOne ={
                id:id,
                url:url?url:parsedImage.url,
                posterName:posterName?posterName:parsedImage.posterName,
                userPosted:userPosted,
                description:description?description:parsedImage.description,
                binned:binned,
                numBinned:0
            }
         //   console.log("update to:\n");
         //   console.log(updatedOne);
            await client.hsetAsync('posted',id,JSON.stringify(updatedOne))
            await client.hdelAsync('binned',id);
            return updatedOne;
        }else{//binned and userPosted
            let updatedOne ={
                id:id,
                url:url?url:parsedImage.url,
                posterName:posterName?posterName:parsedImage.posterName,
                userPosted:userPosted,
                description:description?description:parsedImage.description,
                binned:binned,
                numBinned:1
            }
            await client.hsetAsync('posted',id,JSON.stringify(updatedOne))
            await client.hsetAsync('binned',id,JSON.stringify(updatedOne));
            return updatedOne;
        }

    }else{
        console.log("not in the cache");
        if(binned){
            console.log(numBinned);
            if(!url) throw 'You need to provide url'
            if(typeof userPosted === 'undefined') throw 'you need to provide userPosted'
            let updateOne = {
                id:id,
                url:url,
                posterName: posterName?posterName:"N/A",
                userPosted:userPosted,
                description: description?description:"N/A",
                binned:true,
                numBinned:numBinned
            }
          //  console.log("add to the cache:\n");
            await client.setAsync(id,JSON.stringify(updateOne));
            await client.hsetAsync("binned",id,JSON.stringify(updateOne));
          //  console.log(updateOne)
            return updateOne
        }else{//unbinned
            let updateOne = {
                id:id,
                url:url,
                posterName: posterName?posterName:"N/A",
                userPosted:userPosted,
                description: description?description:"N/A",
                binned:false,
                numBinned:numBinned
            }
            await client.hdelAsync("binned",id);
            return updateOne
        }
        
    }
    } catch (error) {
        throw error;
    }
    

    
}

async function binnedImages(){
    console.log("binnedImages called-----------\n");
    try {
      //  console.log("binnedImages:\n");
        const scanResult = await client.hgetallAsync("binned");
      //  console.log(scanResult);
       
        let result = [];
        if(scanResult){
          //  console.log(scanResult)
        for(const[key,value] of Object.entries(scanResult)){
             
            result.push(JSON.parse(value));
        }
        //console.log("binned images are:\n")
       // console.log(result);
        return result;
        }else{
            return []
        }

    } catch (error) {
        throw error
    }

}

async function unsplashImage(id){
    if(!id || typeof(id)!='string'||id.trim()==''){
        throw 'you need to provide an id'
    }
    try {
        let result = await unsplash.photos.get({photoId:id});
        if (result.errors) {
          //  console.log('error occurred:', result.errors[0]);
            throw 'could not get data'
        } else {
            const data = result.response;
          //  console.log(data);
            let newData ={
                id:id,
                url: (data.urls && data.urls.raw) ? data.urls.small: "N/A",
                posterName: (data.user && data.user.username ) ? data.user.username : "N/A",
                description: data.description?data.description:"N/A",
                userPosted: false,// from unsplash, so false
                binned: false ,//initial false
                numBinned:data.likes?data.likes:0,
            }
            return newData;
        }
    } catch (error) {
        throw error
    }

}

async function postedImages(){
    console.log("posted Images called-----------\n");
    try {
      //  console.log("binnedImages:\n");
        const scanResult = await client.hgetallAsync("posted");
      //  console.log(scanResult);
       
        let result = [];
        if(scanResult){
            console.log(scanResult)
        for(const[key,value] of Object.entries(scanResult)){
             
            result.push(JSON.parse(value));
        }
        console.log("posted images are:\n")
        console.log(result);
        return result;
        }else{
            return []
        }

    } catch (error) {
        throw error
    }
   
}

module.exports ={
    unsplashedImages,
    updateImage,
    binnedImages,
    unsplashImage,
    uploadImage,
    postedImages
}