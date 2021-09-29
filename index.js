const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid');
const callFunc = require('./callFunc');
const nodeFetch = require('node-fetch');
const { createApi } = require('unsplash-js');
const unsplash = createApi({
    accessKey: "g_TyEbq8r6RRTqJNwVqiY8SKsXOiFguId9bEvtz3tu8",
    fetch: nodeFetch
});
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const typeDefs = gql`
type Query {
    unsplashImages(pageNum:Int):[ImagePost]
    binnedImages:[ImagePost]
    userPostedImages:[ImagePost]
    getTopTenBinnedPosts:[ImagePost]

}
type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned:Int
}
type Mutation{
    uploadImage(url: String!, description: String, posterName: String) : ImagePost
    updateImage(id: ID!, url: String, posterName: String, userPosted: Boolean,description: String, binned: Boolean, numBinned: Int) : ImagePost
    deleteImage(id: ID!) : ImagePost
}
`;


const resolvers = {
 
    Query: {
        //args: pageNum
        unsplashImages: async (_, args) => await callFunc.unsplashedImages(args.pageNum),

        binnedImages: async () => {
            try{
             let result = await callFunc.binnedImages();
             return result
            }catch(error){
                console.log(error);
            }
            
        },

        userPostedImages: async () => {
            try {
                
                let result = await callFunc.postedImages();

              return result;
            } catch (error) {
                console.log(error);
            }
        },
        getTopTenBinnedPosts:async ()=>{
            try{
                console.log("i am in the top like.")
                let result = await callFunc.binnedImages();
                if(result){
                    result.sort(function (a,b){
                        return b.numBinned - a.numBinned;
                    })
                }
               // console.log(result)
                return result.slice(0,10);
            }catch(error){
                console.log(error);
            }
        }
    },

    Mutation: {
        uploadImage: async (_, args) => {
            try {
               return await callFunc.uploadImage(args.url,args.posterName,args.description);
            } catch (error) {
                console.log(error);
            }


        },

        updateImage: async (_, args) => {
           // console.log("updating here")
          const result = await callFunc.updateImage(args.id,args.url,args.posterName,args.userPosted,args.description,args.binned,args.numBinned);
         // console.log(result) ;
          return result;   
        },
        //id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean
        deleteImage: async (_, args) => {
            try {
                console.log("delete function\n");
                if (args && args.id) {
                    console.log(args.id);
                    const getOne = await client.getAsync(args.id);
                    if(getOne){
                        const deleted = await client.delAsync(args.id);
                         await client.hdelAsync('binned',args.id);
                         await client.hdelAsync('posted',args.id);
                      //  console.log("delete: \n")
                      //  console.log(getOne)
                        return JSON.parse(getOne)
                    }
                } else {
                    console.log("no id");
                    return null;
                }
            } catch (error) {
               console.log(error);
            }


        }
        //id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean
    }

}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});