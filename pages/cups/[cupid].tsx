import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/CupDetails.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserProvider";
import JoinCupDialog from "../../Components/JoinCupDialog";
import EndRegistrationDialog from "../../Components/EndRegistrationDialog";
import DistributePrizesDialog from "../../Components/DistributePrizesDialog";
import moment from "moment";
import { db } from "../../config/firebase.config";
import { getDoc, Timestamp, doc, onSnapshot } from "firebase/firestore";
import Leaderboard from "../../Components/Leaderboards";
import CupWallet from "../../Components/CupWallet";
import Grid from "@mui/material/Grid";
import { CryptoContext } from "../../context/CryptoProvider";


const CupDetails: NextPage = () => {  
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [cupid, setCupid] = useState(router.asPath.substring(1).split("/")[1]);
  const [imageURL, setImageURL] = useState("");
  const [name, setName] = useState("");
  const [director, setDirector] = useState("");
  const [directorID, setDirectorID] = useState("");
  const [cupState, setCupState] = useState("");
  const [cupType, setCupType] = useState("");
  const [buyIn, setBuyIn] = useState(0);
  const [startDate, setStartDate] = useState(Timestamp.now());
  const [endDate, setEndDate] = useState(Timestamp.now());
  const [joinedUser, setJoinedUser] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [userPortfolios, setUserPortfolios] = useState<any>({});
  const {
    query: { id },
  } = router;
  const user = useContext(UserContext);

  useEffect(() => {
    const cupid = router.asPath.substring(1).split("/")[1];
    if (cupid === "[cupid]") return;
    setCupid(cupid);
    const cupDocRef = doc(db, "cups", cupid);
    onSnapshot(cupDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data: any = snapshot.data();
        setImageURL(data.imageURL);
        setName(data.name);
        setDirectorID(data.director);
        setCupState(data.currentState);
        setCupType(data.cupType);
        setBuyIn(data.buyIn);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setEthAddress(data.ethAddress);
        setUserPortfolios(data.userPortfolios);        
        if (user.uid in data.userPortfolios) {
          setJoinedUser(true);
        }
        const userDocRef = doc(db, "users", data.director);
        const userDocSnap = await getDoc(userDocRef);
        const userData: any = userDocSnap.data();
        setDirector(userData.firstName + " " + userData.lastName);
        setLoading(false);
      }
    });
  }, [router.asPath.substring(1).split("/")[1]]);

  return (
    <div>
      <Head>
        <title>{name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img className={styles.placeholder} src={imageURL}></img>
      <div className={styles.container}>
        {loading ? (
          <p>loading</p>
        ) : (
          <div>
            {user.uid === directorID && cupState === "created" && (
              <EndRegistrationDialog cup={{ id: cupid, ethAddress }} />
            )}
            {user.uid === directorID && cupState === "active" && (
              <DistributePrizesDialog
                cup={{
                  id: cupid,
                  ethAddress,
                  userPortfolios,
                }}
              />
            )}
            <h5 className={styles.name}>{name}</h5>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div className={styles.cuptype}>{cupType}</div>
              <div style={{ width: 20 }} />
              <div className={styles.cuptype}>{cupState}</div>
            </div>
            <h6 className={styles.commis}>Cup Commissioner: {director}</h6>
            <h6 className={styles.buyin}>Buy-In: {buyIn} ETH</h6>
            <h6 className={styles.date}>
              {moment(startDate.toDate()).format("M/D/YYYY")}&nbsp;-&nbsp;
              {moment(endDate.toDate()).format("M/D/YYYY")}
            </h6>
            {!joinedUser ? (
              <div>
                <div className={styles.center}>
                  <h4 className={styles.joinnow}>
                    This Cup is currently accepting players. Join now!
                  </h4>
                  <div>
                    <JoinCupDialog
                      cup={{ name, id: cupid, buyIn, ethAddress }}
                    />
                  </div>
                </div>
                <h5>Standings:</h5>
                {Object.keys(userPortfolios).length > 0 && (
                  <Leaderboard cupid={cupid}/>
                )}
              </div>
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={3}>
                  <h5 className={styles.cupwallet}>Your Cup Wallet:</h5>
                  {user.uid && (
                    <CupWallet cupid={cupid} portfolios={userPortfolios}/>
                  )}
                </Grid>
                <Grid item xs={9}>
                  <h5 className={styles.cupwallet}>Standings:</h5>
                  {Object.keys(userPortfolios).length > 0 && (
                    <Leaderboard cupid={cupid}/>
                  )}
                </Grid>
              </Grid>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CupDetails;
