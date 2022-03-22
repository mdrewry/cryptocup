import type { NextPage } from 'next'
import cupstyles from '../styles/Cups.module.css'
import { useRouter } from "next/router"
import {db} from "../config/firebase.config"
import {collection,getDocs,QueryDocumentSnapshot,DocumentData, Timestamp,addDoc} from "firebase/firestore";
import {useState,useEffect} from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Cup from "../Components/ViewCup";

const Leaderboard: NextPage = () => {
    const [leaderboard,setLeaderboard]=useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const usersRef=collection(db,"users");
    const getCups=async()=>{
        const data=await getDocs(usersRef);
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.forEach((c)=>{
            result.push(c);
        }
        )
        // setCups(data.docs.map((item)=>{
        //     return {...item.data(),id:item.id}
        // }));
        
        setLeaderboard(result);
        // setLoading(false);
    };
    
    useEffect(()=>{
        getCups();
        setTimeout( () => {
            setLoading(false);
          },2000)
    },[]);
    


    const router = useRouter()
    const {
      query: { id },
    } = router

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '316px',
        maxHeight: '316px',
      });

      
    return(
        <div className={cupstyles.padding}>
            <h1>Leaderboards</h1>
            <h4>Global Leaderboards: Total Wins</h4>
            {/* {loading ? (<div>loading</div>) :
            
            } */}
            
        </div>
        )
    
}

export default Leaderboard