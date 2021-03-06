import React, { useState, useContext } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import joinCupStyles from "../styles/joincup.module.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import { UserContext } from "../context/UserProvider";
import ViewCup from "../Components/ViewCup";

const useStyles = makeStyles((theme) => ({
  textField: {
    [`& fieldset`]: {
      borderRadius: 25,
    },
    "&": {
      marginTop: "9px",
    },
    "& .MuiInputBase-input": {
      borderRadius: 25,
      fontFamily: "Space Mono",
      fontSize: 20,
      color: "#ffffff",
      backgroundColor: "rgba(47, 56, 105, 0.6)",
      width: 500,
      padding: "15px 15px",
    },
  },
}));

const JoinCup: NextPage = () => {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [name, setName] = useState("");
  const handleSearch = (e: any) => {
    setName(e.target.value);
  };

  return (
    <div className={joinCupStyles.page}>
      <Head>
        <title>Join Cup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={joinCupStyles.header}>
        <h1>Join a Cup</h1>
        <h6>View Open Cups or search for a specific Cup.</h6>
      </div>
      <p className={joinCupStyles.fieldName}>Cup Name: </p>
      <TextField
        className={classes.textField}
        name="cupName"
        onChange={handleSearch}
      />
      <div className={joinCupStyles.spacer} />
      <ViewCup filter={2} cupNameFilter={name} />
    </div>
  );
};
export default JoinCup;
