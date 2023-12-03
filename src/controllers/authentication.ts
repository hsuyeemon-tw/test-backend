import express from 'express';

import { getUserByEmail  , createUser } from '../db/users';
import { authentication, random } from '../helpers';
export const register = async (req:express.Request, res : express.Response) => {

    try{

        const {email , password ,  username } = req.body;

        // checking if the req body contains all the input element needed
        if (!email || !password || !username ){
            return res.sendStatus(400);
        }

        // checking if the user is already existed in db
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.sendStatus(400);
        }

        // all perfect. continue to authentication
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication :{
                salt,
                password : authentication(salt,password),
            },
        });

        return res.sendStatus(200).json(user).end();

    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}