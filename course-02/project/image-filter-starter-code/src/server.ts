import express, { Response,Request, NextFunction, Errback } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { ExecException } from 'child_process';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage",
    async (req:Request,res:Response,next:NextFunction) => {

      try {
       
            let image_url:string = req.query.image_url as string;
            if(!image_url || image_url.length==0) return res.status(422).send("image url required!.");
           
            let filteredimage_url:string = await filterImageFromURL(image_url);
         
            res.status(200).sendFile(filteredimage_url);
          
          res.on('finish',async()=> await deleteLocalFiles([filteredimage_url]));

      } catch (error) {
        console.log(error)
        return next(error.toString());
      }  
  })

  //middleware for handling
  app.use(async(err:Errback,req:Request,res:Response,next:NextFunction)=>{
   
     if(err.length>0)
     {
       return res.status(422).send(err.toString());
     }
     else
     {
      next();
     }
    
  })
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();

