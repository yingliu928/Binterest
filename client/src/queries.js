import { gql } from '@apollo/client';


const UNSPLASH_IMAGES = gql`
query GetImages($pageNum:Int){
 
    unsplashImages(pageNum:$pageNum){
     id
     url
     posterName
     userPosted
     description
     binned
     numBinned
   }

   }
`;

const BINNED_IMAGES = gql`
query {
 
    binnedImages{
     id
     url
     posterName
     userPosted
     description
     binned
     numBinned
   
 }         
}
`;

const POP_IMAGES = gql`
query {
 
    getTopTenBinnedPosts{
     id
     url
     posterName
     userPosted
     description
     binned
     numBinned
   
 }         
}
`;




const POSTED_IMAGES = gql`
query {
  
    userPostedImages{
     id
     url
     posterName
     userPosted
     description
     binned
     numBinned
   }
             
   }
`;

const UPLOAD_IMAGE = gql `
mutation upLoad($url: String!, $posterName: String, $description: String)
{
    uploadImage(url:$url,posterName:$posterName,description:$description)
 {
  id
  url
  posterName
  userPosted
  description
  binned
  numBinned
 }
}
`;

const EDIT_IMAGE = gql`
   mutation editImage($id:ID!, $url: String, $posterName: String, $userPosted: Boolean,$description: String, $binned: Boolean,$numBinned:Int)
   {
    updateImage(id:$id,url:$url,posterName:$posterName,userPosted:$userPosted,description:$description, binned:$binned,numBinned:$numBinned){
            id
            url
            posterName
            userPosted
            description
            binned
            numBinned 
    }
   }

`;



const DELETE_IMAGE =gql `
mutation deleteImage($id:ID!) 
{
 
     deleteImage(id:$id){
         id
         url 
         posterName
         userPosted
        description
        binned
        numBinned

     }
 }

 `;



export default{
    UNSPLASH_IMAGES,
     BINNED_IMAGES,
    POSTED_IMAGES,
     EDIT_IMAGE,
     UPLOAD_IMAGE,
     DELETE_IMAGE,
     POP_IMAGES
};